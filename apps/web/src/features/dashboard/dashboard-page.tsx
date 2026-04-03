import { Clock3, Orbit, Sparkles, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageIntro } from '@/components/page-intro';
import { useClinicData } from '@/features/clinic/use-clinic-data';
import { formatDateTime, formatDuration } from '@/lib/formatters';

export function DashboardPage() {
  const {
    appointments,
    clinic,
    error,
    patients,
    providers,
    services,
    usingDemo,
  } = useClinicData();

  const nextAppointment = appointments.find(
    (appointment) => new Date(appointment.start_time).getTime() > Date.now(),
  );

  const scheduledCount = appointments.filter(
    (appointment) => appointment.status === 'scheduled',
  ).length;
  const providerLoad = providers
    .map((provider) => ({
      provider,
      count: appointments.filter(
        (appointment) => appointment.provider_id === provider.id,
      ).length,
    }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 3);

  return (
    <div>
      <PageIntro
        eyebrow="Operations Snapshot"
        title="See the whole clinic in one glance."
        description="The baseline ships with seeded scheduling entities, protected routing, and a dashboard shell that makes team progress visible on day one."
        actions={
          <>
            {usingDemo ? (
              <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-blush)] px-4 py-2 text-[var(--color-pine)]">
                Demo snapshot
              </Badge>
            ) : null}
            <Badge className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--color-pine)]">
              {clinic.timezone}
            </Badge>
          </>
        }
      />

      {error ? (
        <Card className="mb-6 rounded-[1.75rem] border-[var(--border)] bg-[rgba(195,135,61,0.12)] shadow-none">
          <CardContent className="p-5 text-sm leading-6 text-[var(--color-pine)]">
            Falling back to seeded preview data because Supabase returned an
            error: {error}
          </CardContent>
        </Card>
      ) : null}

      <div className="metric-grid">
        <MetricCard
          label="Scheduled appointments"
          value={scheduledCount}
          accent="Operational rhythm"
          icon={Clock3}
        />
        <MetricCard
          label="Active patients"
          value={patients.length}
          accent="Patient roster"
          icon={Users}
        />
        <MetricCard
          label="Provider rooms"
          value={providers.length}
          accent="Care network"
          icon={Orbit}
        />
        <MetricCard
          label="Service offerings"
          value={services.length}
          accent="Menu live"
          icon={Sparkles}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="editorial-card rounded-[2rem] border-[var(--border)] shadow-none">
          <CardContent className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-[11px] text-[var(--muted)]">
                  Next up
                </p>
                <h2 className="headline-display mt-2 text-3xl font-semibold">
                  Upcoming flow
                </h2>
              </div>
              <Badge className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--color-pine)]">
                {appointments.length} total
              </Badge>
            </div>

            {nextAppointment ? (
              <div className="mt-6 rounded-[1.75rem] border border-[var(--border)] bg-[rgba(20,53,45,0.94)] p-6 text-white">
                <p className="eyebrow text-[11px] text-white/60">
                  Next confirmed slot
                </p>
                <p className="headline-display mt-3 text-4xl font-semibold">
                  {formatDateTime(nextAppointment.start_time)}
                </p>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">
                  Service #{nextAppointment.service_id} with provider #
                  {nextAppointment.provider_id}.
                </p>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {appointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      Appointment #{appointment.id}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {formatDateTime(appointment.start_time)} to{' '}
                      {formatDateTime(appointment.end_time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-blush)] px-3 py-1 text-[var(--color-pine)]">
                      {appointment.status}
                    </Badge>
                    <Badge className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--color-pine)]">
                      Patient #{appointment.patient_id}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="editorial-card rounded-[2rem] border-[var(--border)] shadow-none">
          <CardContent className="p-6 md:p-7">
            <p className="eyebrow text-[11px] text-[var(--muted)]">
              Provider Load
            </p>
            <h2 className="headline-display mt-2 text-3xl font-semibold">
              Who is carrying today?
            </h2>
            <div className="mt-6 space-y-4">
              {providerLoad.map(({ provider, count }) => (
                <div
                  key={provider.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{provider.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {provider.specialization}
                      </p>
                    </div>
                    <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-paper)] px-3 py-1 text-[var(--color-pine)]">
                      {count} booked
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    Calendar sync: {provider.calendar_id ? 'linked' : 'pending'}
                    . Most common slot duration in this clinic is{' '}
                    {formatDuration(services[0]?.duration_min ?? 15)}.
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent: string;
};

function MetricCard({ accent, icon: Icon, label, value }: MetricCardProps) {
  return (
    <Card className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <Badge className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--color-pine)]">
            {accent}
          </Badge>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--color-blush)] p-3 text-[var(--color-pine)]">
            <Icon className="size-4" />
          </div>
        </div>
        <div>
          <p className="headline-display text-5xl font-semibold">{value}</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
