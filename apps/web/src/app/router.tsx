import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/app/layout/app-shell';
import { ProtectedRoute } from '@/app/layout/protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <div className="flex h-full min-h-[60vh] items-center justify-center p-8 text-center text-[var(--foreground)]">
            <h1 className="headline-display text-4xl font-semibold">
              Espacio de trabajo en blanco
            </h1>
          </div>
        ),
      },
    ],
  },
]);
