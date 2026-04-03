import { PageIntro } from '@/components/page-intro';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useClinicData } from '@/features/clinic/use-clinic-data';

export function PatientsPage() {
  const { appointments, patients } = useClinicData();

  return (
    <div>
      <PageIntro
        eyebrow="Patient Directory"
        title="A contact surface built for reminders and reschedules."
        description="Patients stay account-less in the MVP. Phone and email are enough to route bookings, reminders, and cancellations through chat or staff tools."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {patients.map((patient) => {
          const visits = appointments.filter(
            (appointment) => appointment.patient_id === patient.id,
          );

          return (
            <Card
              key={patient.id}
              className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-[11px] text-[var(--muted)]">
                      Patient #{patient.id}
                    </p>
                    <h2 className="headline-display mt-2 text-3xl font-semibold">
                      {patient.name}
                    </h2>
                  </div>
                  <Badge className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--color-pine)]">
                    {visits.length} visits
                  </Badge>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <ContactTile label="Phone" value={patient.phone} />
                  <ContactTile
                    label="Email"
                    value={patient.email ?? 'Not captured yet'}
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

type ContactTileProps = {
  label: string;
  value: string;
};

function ContactTile({ label, value }: ContactTileProps) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-4">
      <p className="eyebrow text-[11px] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
