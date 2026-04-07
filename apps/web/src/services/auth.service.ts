import { client } from '@/lib/supabase/client';
import { getClinicById, getClinicIdForCurrentSession, getProfileRow, getSessionUserId } from '@/lib/supabase/db';
import { User, Clinic } from '@/types/models';

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

export async function login(email: string, password: string): Promise<User | null> {
  if (!client) {
    return null;
  }

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Error de autenticación:', error.message);
    return null;
  }

  return getCurrentUser();
}

export async function logout(): Promise<void> {
  if (!client) {
    return;
  }

  const { error } = await client.auth.signOut();
  if (error) {
    console.error('Error cerrando sesión:', error.message);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!client) {
    return null;
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return null;
  }

  const profile = await getProfileRow(userId);
  if (!profile) {
    return null;
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

export async function getCompanyInfo(): Promise<Clinic> {
  const clinicId = await getClinicIdForCurrentSession();
  if (!clinicId) {
    console.warn('No se encontró una clínica asociada, usando datos mock.');
    return {
      id: 'mock-clinic-1',
      name: 'Clínica de Prueba 1',
      shortName: 'Prueba Clínica 1',
      brandName: 'CLÍNICA TEST 1',
      slogan: 'Datos mock de prueba - no son del BD',
      specialty: 'Medicina de prueba',
      logo: 'T',
      description: 'Información mock de ejemplo para diferenciación.',
      email: 'test@example.com',
      phone: '123',
      address: 'Dirección de prueba 123',
    };
  }

  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    console.warn('No se pudo cargar la clínica, usando datos mock.');
    return {
      id: 'mock-clinic-1',
      name: 'Clínica de Prueba 1',
      shortName: 'Prueba Clínica 1',
      brandName: 'CLÍNICA TEST 1',
      slogan: 'Datos mock de prueba - no son del BD',
      specialty: 'Medicina de prueba',
      logo: 'T',
      description: 'Información mock de ejemplo para diferenciación.',
      email: 'test@example.com',
      phone: '123',
      address: 'Dirección de prueba 123',
    };
  }

  return mapClinic(clinic);
}
