export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabasePublishableKey:
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
};

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabasePublishableKey,
);

// Debug: log configuration status
console.log('🔍 Supabase Configuration Check:');
console.log('  URL:', env.supabaseUrl ? '✅ SET' : '❌ NOT SET');
console.log('  Key:', env.supabasePublishableKey ? '✅ SET' : '❌ NOT SET');
console.log('  isSupabaseConfigured:', isSupabaseConfigured);
