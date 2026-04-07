import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/app/layout/app-shell';
import { ProtectedRoute } from '@/app/layout/protected-route';

import { LandingPage } from '@/features/landing/landing-page';
import { LoginPage } from '@/features/auth/login-page';
import { TermsPage } from '@/features/legal/terms-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { CalendarPage } from '@/features/calendar/calendar-page';
import { AgentPage } from '@/features/agent/agent-page';
import { PatientPage } from '@/features/patient/patient-page';
import { PersonalPage } from '@/features/personal/personal-page';
import { SettingsPage } from '@/features/settings/settings-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
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
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'agent',
        element: <AgentPage />,
      },
      {
        path: 'patient',
        element: <PatientPage />,
      },
      {
        path: 'personal',
        element: <PersonalPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
