import { client } from '@/lib/supabase/client';
import { DashboardStats, RecentActivity, AIPulseMetric, AIThread } from '@/types/models';

type AppointmentActivityRow = {
  id: number;
  status: string;
  start_time: string;
  notes: string | null;
  patient?: { name: string } | { name: string }[];
  provider?: { name: string } | { name: string }[];
  service?: { name: string } | { name: string }[];
};

function ensureClient() {
  if (!client) {
    return null;
  }
  return client;
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(Math.abs(diffMs) / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 1) return diffMs >= 0 ? 'hace unos segundos' : 'en unos segundos';
  if (diffMinutes < 60) return diffMs >= 0 ? `hace ${diffMinutes} min` : `en ${diffMinutes} min`;
  if (diffHours < 24) return diffMs >= 0 ? `hace ${diffHours} h` : `en ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return diffMs >= 0 ? `hace ${diffDays} d` : `en ${diffDays} d`;
}

function appointmentStatusStyles(status: string | null | undefined) {
  switch (status) {
    case 'scheduled':
      return { badgeClass: 'bg-emerald-50 text-emerald-700', badgeLabel: 'Programada' };
    case 'pending':
      return { badgeClass: 'bg-amber-50 text-amber-700', badgeLabel: 'Pendiente' };
    case 'rescheduled':
      return { badgeClass: 'bg-secondary-container/20 text-secondary', badgeLabel: 'Reagendada' };
    case 'cancelled':
      return { badgeClass: 'bg-error-container/20 text-error', badgeLabel: 'Cancelada' };
    case 'completed':
      return { badgeClass: 'bg-primary/10 text-primary', badgeLabel: 'Completada' };
    default:
      return { badgeClass: 'bg-surface-variant/10 text-on-surface-variant', badgeLabel: 'Sin estado' };
  }
}

async function countAppointments(filters: { gte?: string; lt?: string; status?: string } = {}): Promise<number | null> {
  const supabase = ensureClient();
  if (!supabase) return null;

  let query = supabase.from('appointments').select('id', { count: 'exact', head: true });

  if (filters.gte) query = query.gte('start_time', filters.gte);
  if (filters.lt) query = query.lt('start_time', filters.lt);
  if (filters.status) query = query.eq('status', filters.status);

  const { count, error } = await query;
  if (error) {
    console.error('Error contando appointments:', error.message);
    return null;
  }

  return count ?? 0;
}

function toISODateRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = ensureClient();
  if (!supabase) {
    console.log('📊 Dashboard: Using MOCK data (Supabase not configured)');
    return {
      todayAppointments: 12,
      appointmentGrowth: '+15% vs ayer',
      aiConversionRate: '78%',
      activeClinics: 1,
      locationsCount: 1,
    };
  }

  const todayRange = toISODateRange(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayRange = toISODateRange(yesterday);

  const [dailyStatsResponse, clinicCount, todayAppointments, yesterdayAppointments, scheduledCount, totalCount] = await Promise.all([
    supabase.from('v_daily_stats').select('appointments_today').maybeSingle(),
    supabase.from('clinics').select('id', { count: 'exact', head: true }),
    countAppointments({ gte: todayRange.start, lt: todayRange.end }),
    countAppointments({ gte: yesterdayRange.start, lt: yesterdayRange.end }),
    countAppointments({ status: 'scheduled' }),
    countAppointments(),
  ]);

  if (dailyStatsResponse.error || clinicCount.error ||
      todayAppointments === null || yesterdayAppointments === null ||
      scheduledCount === null || totalCount === null) {
    console.warn('📊 Dashboard: Supabase query falló, usando datos mock.');
    return {
      todayAppointments: 12,
      appointmentGrowth: '+15% vs ayer',
      aiConversionRate: '78%',
      activeClinics: 1,
      locationsCount: 1,
    };
  }

  const appointmentGrowth = yesterdayAppointments === 0
    ? `${todayAppointments} hoy`
    : `${Math.round(((todayAppointments - yesterdayAppointments) / Math.max(1, yesterdayAppointments)) * 100)}% vs ayer`;

  const aiConversionRate = totalCount > 0
    ? `${Math.round((scheduledCount / totalCount) * 100)}%`
    : '0%';

  return {
    todayAppointments: dailyStatsResponse.data?.appointments_today ?? todayAppointments,
    appointmentGrowth,
    aiConversionRate,
    activeClinics: clinicCount.count ?? 0,
    locationsCount: clinicCount.count ?? 0,
  };
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        initials: 'PT',
        name: 'Paciente Test 1',
        avatarClass: 'bg-primary-fixed text-primary',
        badgeClass: 'bg-emerald-50 text-emerald-700',
        badgeLabel: 'Completada',
        time: 'hace 2 h',
      },
      {
        initials: 'PT',
        name: 'Paciente Test 2',
        avatarClass: 'bg-amber-50 text-amber-700',
        badgeClass: 'bg-amber-50 text-amber-700',
        badgeLabel: 'Pendiente',
        time: 'hace 4 h',
      },
    ];
  }

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `id, status, start_time, notes, patient:patients(name), provider:providers(name), service:services(name)`
    )
    .order('start_time', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching recent activity:', error.message);
    return [
      {
        initials: 'ML',
        name: 'María López',
        avatarClass: 'bg-primary-fixed text-primary',
        badgeClass: 'bg-emerald-50 text-emerald-700',
        badgeLabel: 'Completada',
        time: 'hace 2 h',
      },
      {
        initials: 'CR',
        name: 'Carlos Rodríguez',
        avatarClass: 'bg-amber-50 text-amber-700',
        badgeClass: 'bg-amber-50 text-amber-700',
        badgeLabel: 'Pendiente',
        time: 'hace 4 h',
      },
    ];
  }

  const appointments = (data ?? []) as AppointmentActivityRow[];

  return appointments.map((appointment) => {
    const patient = Array.isArray(appointment.patient) ? appointment.patient[0] : appointment.patient;
    const patientName = patient?.name ?? 'Paciente desconocido';
    const initials = patientName
      .split(' ')
      .map((part) => part[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
    const { badgeClass, badgeLabel } = appointmentStatusStyles(appointment.status);

    return {
      initials,
      name: patientName,
      avatarClass: appointment.status === 'pending'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-primary-fixed text-primary',
      badgeClass,
      badgeLabel,
      time: formatRelativeTime(appointment.start_time),
    };
  });
}

export async function getAIPulse(): Promise<{ metrics: AIPulseMetric[], threads: AIThread[] }> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return {
      metrics: [
        {
          label: 'Citas en sistema',
          value: 45,
          colorClass: 'bg-primary',
          textClass: 'text-primary',
        },
        {
          label: 'Tasa de confirmación',
          value: 78,
          colorClass: 'bg-tertiary-container',
          textClass: 'text-tertiary-container',
        },
      ],
      threads: [
        { label: 'Análisis de Consultas', active: true },
        { label: 'Agenda Inteligente', active: true },
        { label: 'Admisión de Pacientes', active: false },
      ]
    };
  }

  const [totalCount, scheduledCount, pendingCount, completedCount] = await Promise.all([
    countAppointments(),
    countAppointments({ status: 'scheduled' }),
    countAppointments({ status: 'pending' }),
    countAppointments({ status: 'completed' }),
  ]);

  if (totalCount === null || scheduledCount === null || pendingCount === null || completedCount === null) {
    console.warn('📊 AI Pulse: Supabase query falló, usando datos mock.');
    return {
      metrics: [
        {
          label: 'Citas en sistema',
          value: 45,
          colorClass: 'bg-primary',
          textClass: 'text-primary',
        },
        {
          label: 'Tasa de confirmación',
          value: 78,
          colorClass: 'bg-tertiary-container',
          textClass: 'text-tertiary-container',
        },
      ],
      threads: [
        { label: 'Análisis de Consultas', active: true },
        { label: 'Agenda Inteligente', active: true },
        { label: 'Admisión de Pacientes', active: false },
      ]
    };
  }

  const confirmationRate = totalCount > 0 ? Math.round((scheduledCount / totalCount) * 100) : 0;

  return {
    metrics: [
      {
        label: 'Citas en sistema',
        value: totalCount,
        colorClass: 'bg-primary',
        textClass: 'text-primary',
      },
      {
        label: 'Tasa de confirmación',
        value: confirmationRate,
        colorClass: 'bg-tertiary-container',
        textClass: 'text-tertiary-container',
      },
    ],
    threads: [
      { label: 'Análisis de Consultas', active: totalCount > 0 },
      { label: 'Agenda Inteligente', active: scheduledCount > 0 },
      { label: 'Admisión de Pacientes', active: pendingCount > 0 },
    ]
  };
}
