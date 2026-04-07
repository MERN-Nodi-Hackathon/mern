import { client } from '@/lib/supabase/client';
import { StaffMember, StaffShift, AISuggestion } from '@/types/models';

function ensureClient() {
  if (!client) {
    return null;
  }
  return client;
}

function toInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(Math.abs(diffMs) / 60000);
  if (diffMinutes < 60) return diffMinutes + ' min';
  return Math.floor(diffMinutes / 60) + ' h';
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
  const supabase = ensureClient();  if (!supabase) return null;  const { data, error } = await supabase.from('profiles').select('clinic_id').eq('id', userId).maybeSingle();
  if (error) {
    console.error('Error obteniendo clinic_id:', error.message);
    return null;
  }
  return data?.clinic_id ?? null;
}

export async function getMedicalTeam(): Promise<StaffMember[]> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: 'mock-staff-1',
        name: 'Dr. 1',
        specialty: 'Médico de prueba',
        status: 'available',
        statusLabel: 'Disponible',
        consultorio: 'Test 101',
        photoUrl: '',
        initials: 'D1',
      },
      {
        id: 'mock-staff-2',
        name: 'Dr. 2',
        specialty: 'Especialista de prueba',
        status: 'busy',
        statusLabel: 'Ocupado',
        consultorio: 'Test 102',
        photoUrl: '',
        initials: 'D2',
      },
    ];
  }

  const userId = await getSessionUserId();
  if (!userId) return [];

  const clinicId = await getClinicIdForUser(userId);
  if (!clinicId) return [];

  const [{ data: providers, error: providerError }, { data: appointments, error: appointmentError }] =
    await Promise.all([
      supabase.from('providers').select('id, name, specialization, email, phone, calendar_id').eq('clinic_id', clinicId),
      supabase.from('appointments').select('provider_id, start_time, status').eq('clinic_id', clinicId).gt('start_time', new Date().toISOString()).order('start_time', { ascending: true }),
    ]);

  if (providerError) {
    console.error('Error cargando proveedores:', providerError.message);
    return [];
  }

  if (appointmentError) {
    console.error('Error cargando citas de proveedores:', appointmentError.message);
  }

  const appointmentMap = new Map<number, any[]>();
  (appointments ?? []).forEach((appt) => {
    const providerId = Number(appt.provider_id);
    const items = appointmentMap.get(providerId) ?? [];
    items.push(appt);
    appointmentMap.set(providerId, items);
  });

  const now = Date.now();

  return (providers ?? []).map((provider) => {
    const upcoming = (appointmentMap.get(Number(provider.id)) ?? []).sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
    const nextAppointment = upcoming[0];
    const nextStart = nextAppointment ? new Date(nextAppointment.start_time).getTime() : null;
    const diffMinutes = nextStart ? Math.floor((nextStart - now) / 60000) : null;

    let status: 'available' | 'busy' | 'away' = 'away';
    let statusLabel = 'Sin Turno';
    let nextTurno: string | undefined;
    let timeLeft: string | undefined;
    let urgentAvailable = false;

    if (nextAppointment) {
      if (diffMinutes !== null && diffMinutes <= 60 && diffMinutes >= 0) {
        status = 'busy';
        statusLabel = 'En Consulta';
        timeLeft = `${diffMinutes} min`;
      } else {
        status = 'available';
        statusLabel = 'Disponible';
      }
      nextTurno = new Date(nextAppointment.start_time).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });
      urgentAvailable = status === 'available';
    }

    return {
      id: String(provider.id),
      name: provider.name,
      specialty: provider.specialization,
      status,
      statusLabel,
      consultorio: provider.calendar_id ?? provider.email ?? `Consultorio ${provider.id}`,
      nextTurno,
      timeLeft,
      returnDate: undefined,
      urgentAvailable,
      photoUrl: '',
      initials: toInitials(provider.name),
    };
  });
}

export async function getStaffShifts(): Promise<StaffShift[]> {
  const userId = await getSessionUserId();
  if (!userId) return [];

  const clinicId = await getClinicIdForUser(userId);
  if (!clinicId) return [];

  const supabase = ensureClient();
  const { data: appointments, error } = await supabase!
    .from('appointments')
    .select('id, start_time, provider:providers!inner(name), service:services!inner(name)')
    .eq('clinic_id', clinicId)
    .gt('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(8);

  if (error || !appointments) {
    console.error('Error cargando turnos:', error?.message);
    return [];
  }

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return appointments.map((appt) => {
    const start = new Date(appt.start_time);
    const hour = start.getHours();
    const dayLabel = `${dayNames[start.getDay()]} ${start.getDate()}`;
    const dayType = hour < 12 ? 'morning' : hour < 16 ? 'specialty' : 'surgery';
    const name = (appt.provider as any)?.name ?? 'Proveedor';

    return {
      id: String(appt.id),
      dayLabel,
      dayType,
      title: name,
      subtitle: (appt.service as any)?.name ?? 'Consulta programada',
      avatars: [''],
      overflow: null,
    };
  });
}

export async function getAISuggestions(): Promise<AISuggestion[]> {
  const userId = await getSessionUserId();
  if (!userId) return [];

  const clinicId = await getClinicIdForUser(userId);
  if (!clinicId) return [];

  const supabase = ensureClient();
  const [pendingResult, upcomingResult] = await Promise.all([
    supabase!.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).eq('status', 'pending'),
    supabase!.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).gt('start_time', new Date().toISOString()),
  ]);

  return [
    {
      id: '1',
      type: 'Optimización',
      body: `Hay **${pendingResult.count ?? 0} citas pendientes** por confirmar. Sería ideal priorizar la gestión de pacientes en espera.`,
      actionLabel: 'Ver pendientes',
    },
    {
      id: '2',
      type: 'Capacidad',
      body: `Se han agendado **${upcomingResult.count ?? 0} citas** para los próximos días. Revisa la asignación de turnos del equipo.`,
      actionLabel: 'Ajustar agenda',
    },
  ];
}

export async function getStaffStats() {
  const userId = await getSessionUserId();
  if (!userId) return {};

  const clinicId = await getClinicIdForUser(userId);
  if (!clinicId) return {};

  const supabase = ensureClient();
  const [providerResult, upcomingResult, pendingResult] = await Promise.all([
    supabase!.from('providers').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId),
    supabase!.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).gt('start_time', new Date().toISOString()),
    supabase!.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).eq('status', 'pending'),
  ]);

  const teamEfficiency = providerResult.count ? Math.min(100, Math.round(((upcomingResult.count ?? 0) / (providerResult.count || 1)) * 10 + 50)) : 70;

  return {
    modelVersion: 'v1.0',
    agentInsight: 'El equipo clínico está optimizando los turnos en tiempo real.',
    teamEfficiency,
    efficiencyIncrease: pendingResult.count ? Math.max(5, Math.min(20, Math.round((providerResult.count ?? 1) / (pendingResult.count + 1) * 2))) : 12,
  };
}
