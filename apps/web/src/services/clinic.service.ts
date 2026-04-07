import { Clinic, User, InboxNotification, BillingInfo, UserPreferences } from '@/types/models';
import data from '@/features/settings/user-company-data.json';

// @TODO: Connect to Supabase 'organizations' table
export async function getClinicData(): Promise<Clinic> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return data.clinic as Clinic;
}

export async function getUserData(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return data.user as User;
}

export async function getNotifications(): Promise<InboxNotification[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return data.inbox as InboxNotification[];
}

export async function getBillingInfo(): Promise<BillingInfo> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return data.billing as BillingInfo;
}

export async function getUserPreferences(): Promise<UserPreferences> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    notifications: data.preferences.notifications
  };
}
