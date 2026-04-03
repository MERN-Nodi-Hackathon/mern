import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Clinic, Profile } from '@mern/shared';
import { ClinicSchema, ProfileSchema } from '@mern/shared';

import { isSupabaseConfigured } from '@/lib/env';
import { client } from '@/lib/supabase/client';

type AuthContextValue = {
  client: SupabaseClient | null;
  clinic: Clinic | null;
  error: string | null;
  isConfigured: boolean;
  loading: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile(activeUser: User | null) {
    const supabaseClient = client;

    if (!supabaseClient || !activeUser) {
      setProfile(null);
      setClinic(null);
      return;
    }

    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', activeUser.id)
      .maybeSingle();

    if (profileError || !profileData) {
      setProfile(null);
      setClinic(null);
      setError(
        profileError?.message ??
          'Profile row not found yet. Run the migration and create or re-login the staff user.',
      );
      return;
    }

    const parsedProfile = ProfileSchema.parse(profileData);

    const { data: clinicData, error: clinicError } = await supabaseClient
      .from('clinics')
      .select('*')
      .eq('id', parsedProfile.clinic_id)
      .maybeSingle();

    if (clinicError || !clinicData) {
      setProfile(parsedProfile);
      setClinic(null);
      setError(clinicError?.message ?? 'Clinic record not found for the active profile.');
      return;
    }

    setProfile(parsedProfile);
    setClinic(ClinicSchema.parse(clinicData));
    setError(null);
  }

  useEffect(() => {
    if (!client || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const supabaseClient = client;

    async function bootstrap() {
      const { data, error: sessionError } = await supabaseClient.auth.getSession();

      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await loadProfile(data.session.user);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if (nextSession?.user) {
        void loadProfile(nextSession.user);
      } else {
        setProfile(null);
        setClinic(null);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      client,
      clinic,
      error,
      isConfigured: isSupabaseConfigured,
      loading,
      profile,
      refreshProfile: async () => {
        await loadProfile(user);
      },
      session,
      signIn: async (email: string, password: string) => {
        if (!client) {
          throw new Error('Supabase environment is not configured.');
        }

        const { error: signInError } = await client.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
      },
      signOut: async () => {
        if (!client) {
          return;
        }

        const { error: signOutError } = await client.auth.signOut();

        if (signOutError) {
          throw signOutError;
        }
      },
      user,
    }),
    [clinic, error, loading, profile, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
