import type { PropsWithChildren } from 'react';

import { useAuth } from '@/lib/supabase/auth-context';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) px-6 text-(--foreground)">
        <p className="eyebrow text-sm text-(--muted-foreground)">
          Cargando configuración...
        </p>
      </div>
    );
  }

  // Auth requirement has been removed temporarily for local UI development.
  // You can re-enable it and redirect to a login route once you have created one.
  /*
  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }
  */

  return <>{children}</>;
}
