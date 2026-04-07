import { client } from '@/lib/supabase/client';
import { CalendarEvent } from '@/types/models';

function ensureClient() {
  if (!client) {
    return null;
  }
  return client;
}

async function getSessionUserId(): Promise<string | null> {
  const supabase = ensureClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error obteniendo sesión:', error.message);
    return null;
  }
  return data.session?.user?.id ?? null;
}

async function getClinicId(userId: string): Promise<number | null> {
  const supabase = ensureClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('clinic_id').eq('id', userId).maybeSingle();
  if (error) {
    console.error('Error obteniendo clinic_id:', error.message);
    return null;
  }
  return data?.clinic_id ?? null;
}

function mapStatusToEventType(status: string): string {
  switch (status) {
    case 'scheduled':
      return 'booking';
    case 'pending':
      return 'booking';
    case 'completed':
      return 'confirmed';
    case 'cancelled':
      return 'blocked';
    default:
      return 'internal';
  }
}

export async function getEvents(): Promise<CalendarEvent[]> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: 'mock-event-1',
        type: 'booking',
        label: 'Cita de prueba',
        title: 'Paciente Test 1',
        detail: 'Dr. 1',
        date: new Date().toISOString().slice(0, 10),
        hour: 10,
      },
      {
        id: 'mock-event-2',
        type: 'confirmed',
        label: 'Consulta de prueba',
        title: 'Paciente Test 2',
        detail: 'Dr. 2',
        date: new Date().toISOString().slice(0, 10),
        hour: 14,
      },
    ];
  }

  const userId = await getSessionUserId();
  if (!userId) return [];

  const clinicId = await getClinicId(userId);
  if (!clinicId) return [];

  const { data, error } = await supabase
    .from('appointments')
    .select('id, start_time, status, patient:patients!inner(name), provider:providers!inner(name), service:services!inner(name)')
    .eq('clinic_id', clinicId)
    .order('start_time', { ascending: true });

  if (error || !data) {
    console.error('Error cargando eventos:', error?.message);
    return [];
  }

  return data.map((appointment) => {
    const start = new Date(appointment.start_time);
    return {
      id: String(appointment.id),
      type: mapStatusToEventType(appointment.status) as any,
      label: (appointment.service as any)?.name ?? (appointment.status || 'Cita'),
      title: (appointment.patient as any)?.name ?? 'Paciente sin nombre',
      detail: (appointment.provider as any)?.name ? `Dr. ${(appointment.provider as any).name}` : undefined,
      date: start.toISOString().slice(0, 10),
      hour: start.getHours(),
    } as CalendarEvent;
  });
}

export async function createAppointment(appointmentData: {
  patientId: number;
  providerId: number;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  notes?: string;
}): Promise<{ success: boolean; id?: number; error?: string }> {
  const supabase = ensureClient();
  if (!supabase) {
    return { success: false, error: 'Supabase no configurado' };
  }

  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const clinicId = await getClinicId(userId);
    if (!clinicId) {
      return { success: false, error: 'Clínica no encontrada' };
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          clinic_id: clinicId,
          patient_id: appointmentData.patientId,
          provider_id: appointmentData.providerId,
          service_id: appointmentData.serviceId,
          start_time: appointmentData.startTime.toISOString(),
          end_time: appointmentData.endTime.toISOString(),
          notes: appointmentData.notes || null,
          status: 'pending',
        },
      ])
      .select('id');

    if (error) {
      console.error('Error creando cita:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.[0]?.id };
  } catch (err: any) {
    console.error('Error creando cita:', err.message);
    return { success: false, error: err.message };
  }
}
