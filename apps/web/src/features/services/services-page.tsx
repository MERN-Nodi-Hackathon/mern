import { PageIntro } from '@/components/page-intro';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useClinicData } from '@/features/clinic/use-clinic-data';
import { formatDuration } from '@/lib/formatters';

export function ServicesPage() {
  const { appointments, services } = useClinicData();

  return (
    <div>
      <PageIntro
        eyebrow="Service Menu"
        title="Durations, not vague ideas."
        description="The shared contracts already encode duration and scheduling relationships, so providers, services, and appointment creation stay aligned across frontend and Edge Functions."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {services.map((service) => {
          const usage = appointments.filter(
            (appointment) => appointment.service_id === service.id,
          ).length;

          return (
            <Card
              key={service.id}
              className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-[11px] text-[var(--muted)]">
                      Service #{service.id}
                    </p>
                    <h2 className="headline-display mt-2 text-3xl font-semibold">
                      {service.name}
                    </h2>
                    <p className="mt-2 text-[var(--muted-foreground)]">
                      Duration locked at {formatDuration(service.duration_min)}
                    </p>
                  </div>
                  <Badge className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--color-pine)]">
                    {usage} booked
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
