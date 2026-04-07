import { StaffMember, StaffShift, AISuggestion } from '@/types/models';
import data from '@/features/personal/personal-data.json';

// @TODO: Connect to Supabase 'staff' table
export async function getMedicalTeam(): Promise<StaffMember[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return data.doctors as StaffMember[];
}

export async function getStaffShifts(): Promise<StaffShift[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return data.shifts as StaffShift[];
}

export async function getAISuggestions(): Promise<AISuggestion[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return data.aiSuggestions as AISuggestion[];
}

export async function getStaffStats() {
  await new Promise(resolve => setTimeout(resolve, 50));
  return data.stats;
}
