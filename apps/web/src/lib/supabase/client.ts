import { createBrowserClient } from '@supabase/ssr';

import { env, isSupabaseConfigured } from '@/lib/env';

export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
}

export const client = isSupabaseConfigured ? createClient() : null;
