import { User, Clinic } from '@/types/models';

// @TODO: Replace with Supabase Auth or JWT-based authentication
export async function login(email: string, password: string): Promise<User | null> {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (email === 'demo@sanctuary.com' && password === 'admin') {
    return {
      id: 'usr-1',
      firstName: 'Mateo',
      fullName: 'Dr. Mateo Ruiz',
      role: 'Director Médico y Propietario',
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL47PqNn5-M_B_FvP8L0S_jS8f8m7f2R6z8r3G9W6X=s64-c',
      email: 'm.ruiz@vitalsanctuary.com'
    };
  }
  return null;
}

export async function logout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
}

// @TODO: Connect to Supabase 'profiles' table
export async function getCurrentUser(): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: 'usr-1',
    firstName: 'Mateo',
    fullName: 'Dr. Mateo Ruiz',
    role: 'Director Médico y Propietario',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL47PqNn5-M_B_FvP8L0S_jS8f8m7f2R6z8r3G9W6X=s64-c',
    email: 'm.ruiz@vitalsanctuary.com'
  };
}

// @TODO: Connect to Supabase 'clinics' or 'organizations' table
export async function getCompanyInfo(): Promise<Clinic> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: 'c1',
    name: 'Vital Sanctuary Clinical Center',
    shortName: 'Clinical Sanctuary',
    brandName: 'VITAL SANCTUARY',
    slogan: 'IA PARA EL BIENESTAR CLÍNICO',
    specialty: 'Medicina Interna',
    logo: 'S',
    description: 'Premier health and wellness destination.',
    email: 'contacto@vitalsanctuary.mx',
    phone: '+52 55 1234 5678',
    address: 'Calle de los Arcos 45, CDMX'
  };
}
