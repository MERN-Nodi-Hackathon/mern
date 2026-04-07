import { DashboardStats, RecentActivity, AIPulseMetric, AIThread } from '@/types/models';

// @TODO: Connect to Supabase 'dashboard_stats' view or metrics tables
export async function getDashboardStats(): Promise<DashboardStats> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    todayAppointments: 42,
    appointmentGrowth: '+12% vs ayer',
    aiConversionRate: '89.4%',
    activeClinics: 8,
    locationsCount: 3
  };
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [
    {
      initials: 'SM',
      name: 'Sarah Mitchell',
      avatarClass: 'bg-primary-fixed text-primary',
      badgeClass: 'bg-tertiary-container/10 text-tertiary-container',
      badgeLabel: 'Gestionado por IA',
      time: 'hace 2 min',
    },
    {
      initials: 'JR',
      name: 'James Rodriguez',
      avatarClass: 'bg-secondary-container text-secondary',
      badgeClass: 'bg-secondary-container/30 text-on-secondary-fixed-variant',
      badgeLabel: 'En Consulta',
      time: 'hace 14 min',
    },
    {
      initials: 'EL',
      name: 'Elena Laine',
      avatarClass: 'bg-primary-fixed text-primary',
      badgeClass: 'bg-tertiary-container/10 text-tertiary-container',
      badgeLabel: 'Reserva Confirmada',
      time: 'hace 28 min',
    },
    {
      initials: 'TB',
      name: 'Thomas Burke',
      avatarClass: 'bg-error-container/20 text-error',
      badgeClass: 'bg-error-container text-on-error-container',
      badgeLabel: 'Acción Requerida',
      time: 'hace 1 hora',
    }
  ];
}

export async function getAIPulse(): Promise<{ metrics: AIPulseMetric[], threads: AIThread[] }> {
  await new Promise(resolve => setTimeout(resolve, 700));
  return {
    metrics: [
      { label: 'Carga de Procesamiento', value: 24, colorClass: 'bg-primary', textClass: 'text-primary' },
      { label: 'Eficiencia de Memoria', value: 92, colorClass: 'bg-tertiary-container', textClass: 'text-tertiary-container' },
    ],
    threads: [
      { label: 'Análisis de Consultas', active: true },
      { label: 'Agenda Inteligente', active: true },
      { label: 'Admisión de Pacientes', active: false },
    ]
  };
}
