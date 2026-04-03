import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { corsHeaders } from '../_shared/cors.ts';
import { createCalendarAdapter } from '../_shared/adapters.ts';
import { createServiceClient, hasServiceRoleConfig } from '../_shared/supabase.ts';

type BookingIntent = 'availability' | 'book' | 'reschedule' | 'cancel';

type BookingFlowRequest = {
  intent: BookingIntent;
  clinicId?: number;
  patient?: {
    name: string;
    phone: string;
    email?: string;
  };
  serviceId?: number;
  providerId?: number;
  requestedStart?: string;
  requestedEnd?: string;
  appointmentId?: number;
  notes?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
    return json({
      status: 'received',
      message: 'Twilio webhook received. Switch to the JSON booking contract to exercise booking-flow.',
    });
  }

  try {
    const payload = (await request.json()) as BookingFlowRequest;
    const intent = payload.intent;
    const clinicId = payload.clinicId ?? 1;
    const calendar = createCalendarAdapter();

    if (!hasServiceRoleConfig()) {
      if (intent === 'availability') {
        return json({
          status: 'preview',
          message: 'Supabase service role is not configured. Returning mock availability.',
          candidateSlots: await calendar.listAvailability({
            clinicId,
            providerId: payload.providerId,
            start: payload.requestedStart,
            end: payload.requestedEnd,
          }),
        });
      }

      return json({
        status: 'preview',
        message: 'Supabase service role is not configured. Booking flow is running in mock mode.',
      });
    }

    const supabase = createServiceClient();

    if (intent === 'availability') {
      const slots = await calendar.listAvailability({
        clinicId,
        providerId: payload.providerId,
        start: payload.requestedStart,
        end: payload.requestedEnd,
      });

      return json({
        status: 'ok',
        message: slots.length
          ? 'Candidate appointment slots generated.'
          : 'No open slots returned by the current calendar adapter.',
        candidateSlots: slots,
      });
    }

    if (intent === 'cancel') {
      ensure(payload.appointmentId, 'appointmentId is required to cancel an appointment.');

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select(
          'id, clinic_id, external_event_id, notes, patient:patients(id, name, phone), provider:providers(id, name, calendar_id), service:services(id, name)',
        )
        .eq('id', payload.appointmentId)
        .eq('clinic_id', clinicId)
        .single();

      if (appointmentError || !appointment) {
        throw appointmentError ?? new Error('Appointment not found.');
      }

      await calendar.deleteEvent({
        calendarId: appointment.provider?.calendar_id ?? null,
        externalEventId: appointment.external_event_id,
      });

      const { data: updatedAppointment, error: updateError } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          notes: payload.notes ?? appointment.notes,
        })
        .eq('id', payload.appointmentId)
        .select('*')
        .single();

      if (updateError || !updatedAppointment) {
        throw updateError ?? new Error('Unable to cancel appointment.');
      }

      return json({
        status: 'ok',
        message: 'Appointment cancelled.',
        appointment: updatedAppointment,
      });
    }

    ensure(payload.providerId, 'providerId is required.');
    ensure(payload.serviceId, 'serviceId is required.');

    const [{ data: provider, error: providerError }, { data: service, error: serviceError }] =
      await Promise.all([
        supabase
          .from('providers')
          .select('id, clinic_id, name, specialization, calendar_id')
          .eq('id', payload.providerId)
          .eq('clinic_id', clinicId)
          .single(),
        supabase
          .from('services')
          .select('id, clinic_id, name, duration_min')
          .eq('id', payload.serviceId)
          .eq('clinic_id', clinicId)
          .single(),
      ]);

    if (providerError || !provider) {
      throw providerError ?? new Error('Provider not found.');
    }

    if (serviceError || !service) {
      throw serviceError ?? new Error('Service not found.');
    }

    const requestedStart = payload.requestedStart
      ? new Date(payload.requestedStart)
      : new Date();
    const requestedEnd = payload.requestedEnd
      ? new Date(payload.requestedEnd)
      : new Date(requestedStart.getTime() + service.duration_min * 60_000);

    if (intent === 'book') {
      ensure(payload.patient?.phone, 'patient phone is required.');
      ensure(payload.patient?.name, 'patient name is required.');

      const { data: existingPatient } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('phone', payload.patient.phone)
        .maybeSingle();

      const patientRecord =
        existingPatient ??
        (
          await supabase
            .from('patients')
            .insert({
              clinic_id: clinicId,
              name: payload.patient.name,
              phone: payload.patient.phone,
              email: payload.patient.email ?? null,
            })
            .select('*')
            .single()
        ).data;

      ensure(patientRecord, 'Unable to create or locate patient record.');

      const event = await calendar.createEvent({
        clinicId,
        providerId: provider.id,
        calendarId: provider.calendar_id,
        serviceName: service.name,
        patientName: patientRecord.name,
        start: requestedStart.toISOString(),
        end: requestedEnd.toISOString(),
        notes: payload.notes ?? null,
      });

      const { data: appointment, error: insertError } = await supabase
        .from('appointments')
        .insert({
          clinic_id: clinicId,
          patient_id: patientRecord.id,
          provider_id: provider.id,
          service_id: service.id,
          start_time: requestedStart.toISOString(),
          end_time: requestedEnd.toISOString(),
          status: 'scheduled',
          notes: payload.notes ?? null,
          external_event_id: event.externalEventId,
        })
        .select('*')
        .single();

      if (insertError || !appointment) {
        throw insertError ?? new Error('Unable to create appointment.');
      }

      return json({
        status: 'ok',
        message: 'Appointment booked successfully.',
        appointment,
      });
    }

    ensure(intent === 'reschedule', 'Unsupported booking intent.');
    ensure(payload.appointmentId, 'appointmentId is required to reschedule an appointment.');

    const { data: currentAppointment, error: currentAppointmentError } = await supabase
      .from('appointments')
      .select('*, patient:patients(id, name, phone)')
      .eq('id', payload.appointmentId)
      .eq('clinic_id', clinicId)
      .single();

    if (currentAppointmentError || !currentAppointment) {
      throw currentAppointmentError ?? new Error('Appointment not found.');
    }

    const event = await calendar.updateEvent({
      clinicId,
      providerId: provider.id,
      calendarId: provider.calendar_id,
      serviceName: service.name,
      patientName: currentAppointment.patient?.name ?? 'Patient',
      start: requestedStart.toISOString(),
      end: requestedEnd.toISOString(),
      notes: payload.notes ?? currentAppointment.notes ?? null,
      externalEventId: currentAppointment.external_event_id,
    });

    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update({
        provider_id: provider.id,
        service_id: service.id,
        start_time: requestedStart.toISOString(),
        end_time: requestedEnd.toISOString(),
        status: 'rescheduled',
        notes: payload.notes ?? currentAppointment.notes,
        external_event_id: event.externalEventId,
      })
      .eq('id', payload.appointmentId)
      .select('*')
      .single();

    if (updateError || !updatedAppointment) {
      throw updateError ?? new Error('Unable to reschedule appointment.');
    }

    return json({
      status: 'ok',
      message: 'Appointment rescheduled.',
      appointment: updatedAppointment,
    });
  } catch (error) {
    return json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unexpected booking-flow error.',
      },
      400,
    );
  }
});
