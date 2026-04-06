import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { corsHeaders } from '../_shared/cors.ts';
import { createCalendarAdapter } from '../_shared/adapters.ts';
import { createServiceClient, hasServiceRoleConfig } from '../_shared/supabase.ts';

type BookingIntent = 'availability' | 'book' | 'reschedule' | 'cancel';

type BookingFlowRequest = {
  intent: BookingIntent;
  clinicId?: number;
  patient?: { name: string; phone: string; email?: string };
  serviceId?: number;
  providerId?: number;
  requestedStart?: string;
  appointmentId?: number;
  notes?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 60;
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= maxRequests;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // Rate limiting
  const clientIp = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(clientIp)) {
    return json({ status: 'error', message: 'Too many requests. Try again in a minute.' }, 429);
  }

  if (request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
    return json({ status: 'received', message: 'Twilio webhook received.' });
  }

  try {
    const payload = (await request.json()) as BookingFlowRequest;
    const intent = payload.intent;
    const clinicId = payload.clinicId ?? 1;
    const calendar = createCalendarAdapter();

    // Validación: intent válido
    const validIntents = ['availability', 'book', 'reschedule', 'cancel'];
    if (!validIntents.includes(intent)) {
      return json({ status: 'error', message: `Invalid intent. Must be one of: ${validIntents.join(', ')}.` }, 400);
    }

    if (!hasServiceRoleConfig()) {
      if (intent === 'availability') {
        return json({
          status: 'preview',
          message: 'Mock mode — service role not configured.',
          candidateSlots: await calendar.listAvailability({ clinicId, providerId: payload.providerId, start: payload.requestedStart }),
        });
      }
      return json({ status: 'preview', message: 'Booking flow running in mock mode.' });
    }

    const supabase = createServiceClient();

    // Validación: clínica existe
    const { data: clinic } = await supabase
      .from('clinics')
      .select('id, timezone, work_start_hour, work_end_hour')
      .eq('id', clinicId)
      .maybeSingle();

    if (!clinic) return json({ status: 'error', message: 'Clinic not found.' }, 400);

    if (intent === 'availability') {
      ensure(payload.serviceId, 'serviceId is required for availability.');

      // Solo providers que hacen este servicio
      const { data: eligibleProviders } = await supabase
        .from('provider_services')
        .select('provider_id')
        .eq('service_id', payload.serviceId);

      const providerIds = eligibleProviders?.map((r) => r.provider_id) ?? [];

      const slots = await calendar.listAvailability({
        clinicId,
        providerId: payload.providerId ?? providerIds[0],
        start: payload.requestedStart,
      });

      return json({
        status: 'ok',
        message: slots.length ? 'Candidate slots generated.' : 'No open slots.',
        candidateSlots: slots,
        eligibleProviderIds: providerIds,
      });
    }

    if (intent === 'cancel') {
      ensure(payload.appointmentId, 'appointmentId is required to cancel.');

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select('id, clinic_id, status, start_time, external_event_id, notes, patient:patients(id, name, phone), provider:providers(id, name, calendar_id), service:services(id, name)')
        .eq('id', payload.appointmentId)
        .eq('clinic_id', clinicId)
        .single();

      if (appointmentError || !appointment) throw appointmentError ?? new Error('Appointment not found.');

      if (['cancelled', 'completed'].includes(appointment.status)) {
        return json({ status: 'error', message: 'Appointment is already cancelled or completed.' }, 400);
      }

      await calendar.deleteEvent({
        calendarId: appointment.provider?.calendar_id ?? null,
        externalEventId: appointment.external_event_id,
      });

      const { data: updatedAppointment, error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', notes: payload.notes ?? appointment.notes })
        .eq('id', payload.appointmentId)
        .select('*')
        .single();

      if (updateError || !updatedAppointment) throw updateError ?? new Error('Unable to cancel appointment.');

      return json({ status: 'ok', message: 'Appointment cancelled.', appointment: updatedAppointment });
    }

    ensure(payload.providerId, 'providerId is required.');
    ensure(payload.serviceId, 'serviceId is required.');

    // Validar que el provider puede hacer este servicio
    const { data: providerServiceLink } = await supabase
      .from('provider_services')
      .select('provider_id')
      .eq('provider_id', payload.providerId)
      .eq('service_id', payload.serviceId)
      .maybeSingle();

    if (!providerServiceLink) {
      return json({ status: 'error', message: 'This provider does not offer the requested service.' }, 400);
    }

    const [
      { data: provider, error: providerError },
      { data: service, error: serviceError },
    ] = await Promise.all([
      supabase.from('providers').select('id, clinic_id, name, specialization, email, phone, calendar_id').eq('id', payload.providerId).eq('clinic_id', clinicId).single(),
      supabase.from('services').select('id, clinic_id, name, duration_min').eq('id', payload.serviceId).eq('clinic_id', clinicId).single(),
    ]);

    if (providerError || !provider) throw providerError ?? new Error('Provider not found.');
    if (serviceError || !service) throw serviceError ?? new Error('Service not found.');

    const requestedStart = payload.requestedStart ? new Date(payload.requestedStart) : new Date();

    // Duración calculada automáticamente desde el servicio
    const requestedEnd = new Date(requestedStart.getTime() + service.duration_min * 60_000);

    // Validación: no en el pasado
    if (requestedStart < new Date()) {
      return json({ status: 'error', message: 'Cannot book appointments in the past.' }, 400);
    }

    // Validación: horario laboral de la clínica
    const hour = requestedStart.getUTCHours();
    if (hour < clinic.work_start_hour || hour >= clinic.work_end_hour) {
      return json({ status: 'error', message: `Appointments only available between ${clinic.work_start_hour}:00 and ${clinic.work_end_hour}:00 UTC.` }, 400);
    }

    if (intent === 'book') {
      ensure(payload.patient?.phone, 'patient.phone is required.');
      ensure(payload.patient?.name, 'patient.name is required.');

      const { data: existingPatient } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('phone', payload.patient.phone)
        .maybeSingle();

      const patientRecord = existingPatient ?? (
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

      // Conflict check
      const { data: conflict } = await supabase
        .from('appointments')
        .select('id')
        .eq('provider_id', provider.id)
        .eq('clinic_id', clinicId)
        .in('status', ['scheduled', 'rescheduled'])
        .lt('start_time', requestedEnd.toISOString())
        .gt('end_time', requestedStart.toISOString())
        .maybeSingle();

      if (conflict) return json({ status: 'error', message: 'That slot is already booked.' }, 400);

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

      if (insertError || !appointment) throw insertError ?? new Error('Unable to create appointment.');

      return json({ status: 'ok', message: 'Appointment booked successfully.', appointment });
    }

    ensure(intent === 'reschedule', 'Unsupported booking intent.');
    ensure(payload.appointmentId, 'appointmentId is required to reschedule.');

    const { data: currentAppointment, error: currentAppointmentError } = await supabase
      .from('appointments')
      .select('*, patient:patients(id, name, phone)')
      .eq('id', payload.appointmentId)
      .eq('clinic_id', clinicId)
      .single();

    if (currentAppointmentError || !currentAppointment) throw currentAppointmentError ?? new Error('Appointment not found.');

    if (['cancelled', 'completed'].includes(currentAppointment.status)) {
      return json({ status: 'error', message: 'Cannot reschedule a cancelled or completed appointment.' }, 400);
    }

    // Conflict check en reschedule (excluye la cita actual)
    const { data: rescheduleConflict } = await supabase
      .from('appointments')
      .select('id')
      .eq('provider_id', provider.id)
      .eq('clinic_id', clinicId)
      .in('status', ['scheduled', 'rescheduled'])
      .neq('id', payload.appointmentId)
      .lt('start_time', requestedEnd.toISOString())
      .gt('end_time', requestedStart.toISOString())
      .maybeSingle();

    if (rescheduleConflict) return json({ status: 'error', message: 'That slot is already booked.' }, 400);

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

    if (updateError || !updatedAppointment) throw updateError ?? new Error('Unable to reschedule appointment.');

    return json({ status: 'ok', message: 'Appointment rescheduled.', appointment: updatedAppointment });

  } catch (error) {
    return json({ status: 'error', message: error instanceof Error ? error.message : 'Unexpected error.' }, 400);
  }
});