import type { PropsWithChildren } from 'react';

import { AuthProvider } from '@/lib/supabase/auth-context';

export function AppProviders({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
