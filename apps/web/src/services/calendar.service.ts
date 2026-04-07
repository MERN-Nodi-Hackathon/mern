import { CalendarEvent } from '@/types/models';
import data from '@/features/calendar/calendar-data.json';

// @TODO: Connect to Supabase 'appointments' table
export async function getEvents(): Promise<CalendarEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return data as any as CalendarEvent[];
}
