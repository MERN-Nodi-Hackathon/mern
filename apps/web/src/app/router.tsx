import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppShell } from '@/app/layout/app-shell';
import { ProtectedRoute } from '@/app/layout/protected-route';
import { AppointmentsPage } from '@/features/appointments/appointments-page';
import { SignInPage } from '@/features/auth/sign-in-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { PatientsPage } from '@/features/patients/patients-page';
import { ProvidersPage } from '@/features/providers/providers-page';
import { ServicesPage } from '@/features/services/services-page';
import { SettingsPage } from '@/features/settings/settings-page';

export const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
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
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
      {
        path: 'patients',
        element: <PatientsPage />,
      },
      {
        path: 'providers',
        element: <ProvidersPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
