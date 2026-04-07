import { Patient, PatientStats } from '@/types/models';
import data from '@/features/patient/patient-data.json';

// @TODO: Connect to Supabase 'patients' table
export async function getPatients(): Promise<Patient[]> {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return data.patients as Patient[];
}

export async function getPatientStats(): Promise<PatientStats[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return data.stats as PatientStats[];
}
