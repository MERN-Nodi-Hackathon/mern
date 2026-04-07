import { client } from '@/lib/supabase/client';
import { Patient, PatientStats } from '@/types/models';

function ensureClient() {
  if (!client) {
    return null;
  }
  return client;
}

function mapCategory(category?: string) {
  const normalized = (category ?? '').toLowerCase();
  if (normalized.includes('crít') || normalized.includes('cron')) return 'chronic';
  if (normalized.includes('urg')) return 'urgent';
  return 'general';
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calculateAge(dob?: string | null) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
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

async function getClinicIdForUser(userId: string): Promise<number | null> {
  const supabase = ensureClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('clinic_id').eq('id', userId).maybeSingle();
  if (error) {
    console.error('Error obteniendo clinic_id:', error.message);
    return null;
  }
  return data?.clinic_id ?? null;
}

export async function getPatients(): Promise<Patient[]> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: 'mock-patient-1',
        name: 'Paciente Test 1',
        photoUrl: '',
        age: 44,
        category: 'chronic',
        lastVisit: {
          date: '2026-04-01',
          reason: 'Consulta de prueba',
        },
        nextVisit: {
          date: '2026-05-15',
          status: 'confirmed',
        },
        email: 'test1@example.com',
        phone: '123',
      },
      {
        id: 'mock-patient-2',
        name: 'Paciente Test 2',
        photoUrl: '',
        age: 70,
        category: 'chronic',
        lastVisit: {
          date: '2026-03-20',
          reason: 'Seguimiento de prueba',
        },
        nextVisit: {
          date: 'No programada',
          status: 'none',
        },
        email: 'test2@example.com',
        phone: '1234',
      },
    ];
  }

  const userId = await getSessionUserId();
  if (!userId) return [];

  const clinicId = await getClinicIdForUser(userId);
  if (!clinicId) return [];

  const [{ data: patients, error: patientError }, { data: appointments, error: appointmentError }] =
    await Promise.all([
      supabase.from('patients').select('id, name, phone, email, timezone, date_of_birth, category').eq('clinic_id', clinicId).order('name', { ascending: true }),
      supabase.from('appointments').select('patient_id, start_time, status, notes, service:services!inner(name), provider:providers!inner(name)').eq('clinic_id', clinicId).order('start_time', { ascending: true }),
    ]);

  if (patientError) {
    console.error('Error cargando pacientes:', patientError.message);
    return [];
  }

  if (appointmentError) {
    console.error('Error cargando citas de pacientes:', appointmentError.message);
  }

  const appointmentMap = new Map<number, any[]>();
  (appointments ?? []).forEach((appointment) => {
    const patientId = Number(appointment.patient_id);
    const items = appointmentMap.get(patientId) ?? [];
    items.push(appointment);
    appointmentMap.set(patientId, items);
  });

  const now = Date.now();

  return (patients ?? []).map((patient) => {
    const patientAppointments = appointmentMap.get(Number(patient.id)) ?? [];
    const pastAppointments = patientAppointments.filter((appt) => new Date(appt.start_time).getTime() <= now);
    const futureAppointments = patientAppointments.filter((appt) => new Date(appt.start_time).getTime() > now);
    const lastAppointment = pastAppointments.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())[0];
    const nextAppointment = futureAppointments.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

    return {
      id: String(patient.id),
      name: patient.name,
      photoUrl: '',
      age: calculateAge(patient.date_of_birth),
      category: mapCategory(patient.category),
      lastVisit: {
        date: lastAppointment ? formatDate(lastAppointment.start_time) : '',
        reason: (lastAppointment?.service as any)?.name ?? undefined,
      },
      nextVisit: {
        date: nextAppointment ? formatDate(nextAppointment.start_time) : 'No programada',
        status: nextAppointment ? (nextAppointment.status as any) : 'none',
      },
      email: patient.email ?? '',
      phone: patient.phone,
    } as Patient;
  });
}

export async function getPatientStats(): Promise<PatientStats[]> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: 'total',
        label: 'Pacientes Totales',
        value: '45',
        sub: 'En el sistema',
      },
      {
        id: 'confirmed',
        label: 'Citas Confirmadas',
        value: '32',
        sub: 'Agendadas actualmente',
      },
      {
        id: 'pending',
        label: 'Pendientes',
        value: '8',
        sub: 'A confirmar',
      },
      {
        id: 'new',
        label: 'Nuevos ingresos',
        value: '3',
        sub: 'Hoy',
      },
    ];
  }

  const userId = await getSessionUserId();
  if (!userId) return [];

  const clinicId = await getClinicIdForUser(userId);
  if (!clinicId) return [];

  const [totalResult, scheduledResult, pendingResult, newResult] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId),
    supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).eq('status', 'scheduled'),
    supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).eq('status', 'pending'),
    supabase.from('patients').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).gte('created_at', new Date().toISOString().slice(0, 10)),
  ]);

  return [
    {
      id: 'total',
      label: 'Pacientes Totales',
      value: String(totalResult.count ?? 0),
      sub: 'En el sistema',
    },
    {
      id: 'confirmed',
      label: 'Citas Confirmadas',
      value: String(scheduledResult.count ?? 0),
      sub: 'Agendadas actualmente',
    },
    {
      id: 'pending',
      label: 'Pendientes',
      value: String(pendingResult.count ?? 0),
      sub: 'A confirmar',
    },
    {
      id: 'new',
      label: 'Nuevos ingresos',
      value: String(newResult.count ?? 0),
      sub: 'Hoy',
    },
  ];
}
