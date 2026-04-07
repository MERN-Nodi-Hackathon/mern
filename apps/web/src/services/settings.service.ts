import { UserPreferences, BillingInfo } from '@/types/models';
import settingsData from '@/features/settings/user-company-data.json';

// @TODO: Connect to Supabase 'user_preferences' table
export async function getPreferences(): Promise<UserPreferences> {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return settingsData.preferences as UserPreferences;
}

export async function getBillingInfo(): Promise<BillingInfo> {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return settingsData.billing as BillingInfo;
}

export async function updatePreferences(prefs: UserPreferences): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would be a PUT/PATCH request
  console.log('Updating preferences:', prefs);
}
