import { PageIntro } from '@/components/page-intro';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useClinicData } from '@/features/clinic/use-clinic-data';

export function ProvidersPage() {
  const { appointments, providers } = useClinicData();

  return (
    <div>
      <PageIntro
        eyebrow="Provider Network"
        title="Multi-provider support starts with calm, explicit scheduling units."
        description="Each provider record carries a future Google Calendar mapping so availability and booking logic can stay deterministic from the first webhook."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {providers.map((provider) => {
          const load = appointments.filter(
            (appointment) => appointment.provider_id === provider.id,
          ).length;

          return (
            <Card
              key={provider.id}
              className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-[11px] text-[var(--muted)]">
                      Provider #{provider.id}
                    </p>
                    <h2 className="headline-display mt-2 text-3xl font-semibold">
                      {provider.name}
                    </h2>
                    <p className="mt-2 text-[var(--muted-foreground)]">
                      {provider.specialization}
                    </p>
                  </div>
                  <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-blush)] px-3 py-1 text-[var(--color-pine)]">
                    {load} booked
                  </Badge>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-4">
                  <p className="eyebrow text-[11px] text-[var(--muted)]">
                    Calendar integration
                  </p>
                  <p className="mt-2 font-semibold">
                    {provider.calendar_id ?? 'Pending provider calendar ID'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
