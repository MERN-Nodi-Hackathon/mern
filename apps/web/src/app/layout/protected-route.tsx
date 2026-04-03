import type { PropsWithChildren } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/lib/supabase/auth-context';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <div className="editorial-card w-full max-w-lg rounded-[2rem] p-8 text-center">
          <p className="eyebrow text-[11px] text-[var(--muted)]">
            Loading Workspace
          </p>
          <h1 className="headline-display mt-3 text-4xl font-semibold">
            Mapping the clinic floor.
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Syncing your session, clinic profile, and schedule data.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
