import { client } from '@/lib/supabase/client';

export function ensureClient() {
  return client;
}

export async function getSessionUserId(): Promise<string | null> {
  const supabase = ensureClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error al obtener la sesión:', error.message);
    return null;
  }

  return data.session?.user?.id ?? null;
}

export async function getProfileRow(userId: string) {
  const supabase = ensureClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, clinic_id, email, full_name, first_name, photo_url, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener el perfil del usuario:', error.message);
    return null;
  }

  return data as {
    id: string;
    clinic_id: number;
    email: string;
    full_name: string;
    first_name?: string | null;
    photo_url?: string | null;
    role: string;
  } | null;
}

export async function getDefaultClinicId(): Promise<number | null> {
  const supabase = ensureClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('clinics')
    .select('id')
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener la clínica predeterminada:', error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function getClinicIdForCurrentSession(): Promise<number | null> {
  const supabase = ensureClient();
  if (!supabase) return null;

  const userId = await getSessionUserId();
  if (userId) {
    const profile = await getProfileRow(userId);
    if (profile?.clinic_id) return profile.clinic_id;
  }

  return await getDefaultClinicId();
}

export async function getClinicById(clinicId: number) {
  const supabase = ensureClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', clinicId)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener la clínica por id:', error.message);
    return null;
  }

  return data;
}
