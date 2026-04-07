import { client } from '@/lib/supabase/client';
import { Clinic, User, InboxNotification, BillingInfo, UserPreferences } from '@/types/models';

function ensureClient() {
  if (!client) {
    return null;
  }
  return client;
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(Math.abs(diffMs) / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 1) return diffMs >= 0 ? 'hace unos segundos' : 'en unos segundos';
  if (diffMinutes < 60) return diffMs >= 0 ? `hace ${diffMinutes} min` : `en ${diffMinutes} min`;
  if (diffHours < 24) return diffMs >= 0 ? `hace ${diffHours} h` : `en ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return diffMs >= 0 ? `hace ${diffDays} d` : `en ${diffDays} d`;
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

async function getProfile(userId: string) {
  const supabase = ensureClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) {
    console.error('Error obteniendo perfil:', error.message);
    return null;
  }
  return data as any;
}

function mapClinic(row: any): Clinic {
  return {
    id: String(row.id),
    name: row.name,
    shortName: row.brand_name ?? row.name,
    brandName: row.brand_name ?? row.name,
    slogan: row.slogan ?? '',
    specialty: row.description ?? 'General',
    logo: row.logo ?? '',
    description: row.description ?? '',
    email: '',
    phone: row.phone_prefix ?? '',
    address: row.address ?? '',
  };
}

export async function getClinicData(): Promise<Clinic> {
  if (!client) {
    // Fallback to mock data
    return {
      id: 'mock-clinic-1',
      name: 'Clínica de Prueba 1',
      shortName: 'Prueba Clínica 1',
      brandName: 'CLÍNICA TEST 1',
      slogan: 'Datos de prueba - no son del BD',
      specialty: 'Medicina de prueba',
      logo: 'T',
      description: 'Información mock de ejemplo para diferenciación.',
      email: 'test@example.com',
      phone: '123',
      address: 'Calle Prueba 123',
    };
  }

  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error('No hay usuario autenticado para obtener la clínica.');
  }

  const profile = await getProfile(userId);
  if (!profile) {
    throw new Error('No se encontró el perfil de usuario.');
  }

  const supabase = ensureClient();
  const { data: clinic, error } = await supabase!
    .from('clinics')
    .select('*')
    .eq('id', profile.clinic_id)
    .maybeSingle();

  if (error || !clinic) {
    console.error('Error obteniendo datos de clínica:', error?.message);
    throw new Error('No se pudo cargar la información de la clínica.');
  }

  return mapClinic(clinic);
}

export async function getUserData(): Promise<User> {
  if (!client) {
    // Fallback to mock data
    return {
      id: 'usr-test-1',
      firstName: 'Doctor 1',
      fullName: 'Dr. Doctor 1',
      role: 'staff',
      photoUrl: '',
      email: 'doctor1@example.com',
    };
  }

  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error('No hay usuario autenticado para obtener datos.');
  }

  const profile = await getProfile(userId);
  if (!profile) {
    throw new Error('No se encontró el perfil de usuario.');
  }

  return {
    id: profile.id,
    firstName: profile.first_name ?? profile.full_name?.split(' ')[0] ?? '',
    fullName: profile.full_name ?? '',
    role: profile.role ?? 'staff',
    photoUrl: profile.photo_url ?? '',
    email: profile.email ?? '',
  };
}

export async function getNotifications(): Promise<InboxNotification[]> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: 'mock-notification-1',
        message: 'Notificación de prueba: cita para Doctor 1 mañana',
        time: 'hace 2 h',
        isRead: false,
      },
      {
        id: 'mock-notification-2',
        message: 'Notificación de prueba: consulta de test@example.com',
        time: 'hace 4 h',
        isRead: true,
      },
    ];
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return [];
  }

  const profile = await getProfile(userId);
  if (!profile) {
    return [];
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('id, status, start_time, patient:patients!inner(name), service:services!inner(name)')
    .eq('clinic_id', profile.clinic_id)
    .order('start_time', { ascending: false })
    .limit(5);

  if (error || !data) {
    console.error('Error obteniendo notificaciones:', error?.message);
    return [];
  }

  return data.map((appointment, index) => ({
    id: String(appointment.id),
    message: `${(appointment.patient as any)?.name ?? 'Paciente'} tiene una cita ${appointment.status} ${(appointment.service as any)?.name ? `para ${(appointment.service as any).name}` : ''}`.trim(),
    time: formatRelativeTime(appointment.start_time),
    isRead: index > 1,
  }));
}

export async function getBillingInfo(): Promise<BillingInfo> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return {
      plan: 'Plan Básico',
      cardType: 'Visa',
      cardNumberHidden: '•••• 4242',
      cardExpiry: '12/26',
      nextChargeDate: '2026-05-15',
      priceMonthly: '$129',
    };
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return {
      plan: 'Plan Básico',
      cardType: 'Visa',
      cardNumberHidden: '•••• 4242',
      cardExpiry: '12/26',
      nextChargeDate: '2026-05-15',
      priceMonthly: '$129',
    };
  }

  const profile = await getProfile(userId);
  if (!profile) {
    return {
      plan: 'Plan Básico',
      cardType: 'Visa',
      cardNumberHidden: '•••• 4242',
      cardExpiry: '12/26',
      nextChargeDate: '2026-05-15',
      priceMonthly: '$129',
    };
  }

  const clinic = await supabase!
    .from('clinics')
    .select('id')
    .eq('id', profile.clinic_id)
    .maybeSingle();

  return {
    plan: 'Plan Estándar',
    cardType: 'Visa',
    cardNumberHidden: '•••• 4242',
    cardExpiry: '12/26',
    nextChargeDate: '2026-05-15',
    priceMonthly: '$129',
  };
}
