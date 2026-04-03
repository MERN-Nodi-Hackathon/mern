import { useDeferredValue, useState } from 'react';

import { Search } from 'lucide-react';

import { PageIntro } from '@/components/page-intro';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useClinicData } from '@/features/clinic/use-clinic-data';
import { formatDateTime } from '@/lib/formatters';

export function AppointmentsPage() {
  const { appointments, patients, providers, services } = useClinicData();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const visibleAppointments = appointments.filter((appointment) => {
    const patient = patients.find((item) => item.id === appointment.patient_id);
    const provider = providers.find(
      (item) => item.id === appointment.provider_id,
    );
    const service = services.find((item) => item.id === appointment.service_id);
    const haystack = [
      patient?.name,
      provider?.name,
      service?.name,
      appointment.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(deferredSearch.toLowerCase());
  });

  return (
    <div>
      <PageIntro
        eyebrow="Schedule Desk"
        title="Appointments arranged like an operations board."
        description="Every record is already shaped around the Supabase schema, so new booking flows can plug in without moving the furniture."
      />

      <div className="mb-6 flex max-w-md items-center gap-3 rounded-full border border-[var(--border)] bg-white/82 px-4 py-3">
        <Search className="size-4 text-[var(--muted)]" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by patient, provider, or service"
          className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {visibleAppointments.map((appointment) => {
          const patient = patients.find(
            (item) => item.id === appointment.patient_id,
          );
          const provider = providers.find(
            (item) => item.id === appointment.provider_id,
          );
          const service = services.find(
            (item) => item.id === appointment.service_id,
          );

          return (
            <Card
              key={appointment.id}
              className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="eyebrow text-[11px] text-[var(--muted)]">
                      Appointment #{appointment.id}
                    </p>
                    <h2 className="headline-display mt-2 text-3xl font-semibold">
                      {service?.name ?? 'Unmapped service'}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {formatDateTime(appointment.start_time)}
                    </p>
                  </div>
                  <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-blush)] px-3 py-1 text-[var(--color-pine)]">
                    {appointment.status}
                  </Badge>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  <InfoTile
                    label="Patient"
                    value={
                      patient?.name ?? `Patient #${appointment.patient_id}`
                    }
                  />
                  <InfoTile
                    label="Provider"
                    value={
                      provider?.name ?? `Provider #${appointment.provider_id}`
                    }
                  />
                  <InfoTile
                    label="Event Sync"
                    value={appointment.external_event_id ? 'Linked' : 'Pending'}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

type InfoTileProps = {
  label: string;
  value: string;
};

function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-4">
      <p className="eyebrow text-[11px] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
