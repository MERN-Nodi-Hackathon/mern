import {
  CheckCircle2,
  CircleDashed,
  DatabaseZap,
  MessageSquareReply,
  ShieldEllipsis,
} from 'lucide-react';

import { PageIntro } from '@/components/page-intro';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/supabase/auth-context';

const integrations = [
  {
    icon: DatabaseZap,
    label: 'Supabase project',
    description:
      'Hosted auth, Postgres, migrations, and Edge Functions for the hackathon team.',
  },
  {
    icon: MessageSquareReply,
    label: 'Twilio adapter',
    description:
      'Webhook-ready placeholder for WhatsApp or SMS confirmations and reminders.',
  },
  {
    icon: ShieldEllipsis,
    label: 'Google Calendar adapter',
    description:
      'Provider-level calendar syncing with safe mock behavior when secrets are absent.',
  },
];

export function SettingsPage() {
  const { clinic, error, isConfigured, profile } = useAuth();

  return (
    <div>
      <PageIntro
        eyebrow="Project Control"
        title="Operational settings without mystery."
        description="This page is intentionally thin in v1: it exposes environment readiness, identity state, and the integration seams your team will fill during the hackathon."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="editorial-card rounded-[2rem] border-[var(--border)] shadow-none">
          <CardContent className="space-y-5 p-6 md:p-7">
            <div>
              <p className="eyebrow text-[11px] text-[var(--muted)]">
                Environment readiness
              </p>
              <h2 className="headline-display mt-2 text-3xl font-semibold">
                Status board
              </h2>
            </div>

            <div className="grid gap-3">
              <StatusRow
                label="Supabase client env"
                status={isConfigured ? 'ready' : 'pending'}
                detail={
                  isConfigured
                    ? 'Publishable URL and key are available to the web app.'
                    : 'Copy apps/web/.env.example to apps/web/.env.local and restart Vite.'
                }
              />
              <StatusRow
                label="Staff profile"
                status={profile ? 'ready' : 'pending'}
                detail={
                  profile
                    ? `Authenticated as ${profile.email}`
                    : 'Create or invite one Supabase Auth user after running the SQL migration.'
                }
              />
              <StatusRow
                label="Clinic link"
                status={clinic ? 'ready' : 'pending'}
                detail={
                  clinic
                    ? `${clinic.name} (${clinic.timezone})`
                    : 'The signup trigger will attach new staff to clinic #1.'
                }
              />
            </div>

            {error ? (
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(195,135,61,0.12)] p-4 text-sm leading-6 text-[var(--color-pine)]">
                {error}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {integrations.map(({ description, icon: Icon, label }) => (
            <Card
              key={label}
              className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-[11px] text-[var(--muted)]">
                      Integration seam
                    </p>
                    <h2 className="headline-display mt-2 text-3xl font-semibold">
                      {label}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                      {description}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--color-blush)] p-3 text-[var(--color-pine)]">
                    <Icon className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

type StatusRowProps = {
  label: string;
  status: 'ready' | 'pending';
  detail: string;
};

function StatusRow({ detail, label, status }: StatusRowProps) {
  const ready = status === 'ready';

  return (
    <div className="flex items-start gap-4 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-4">
      {ready ? (
        <CheckCircle2 className="mt-0.5 size-5 text-[var(--color-moss)]" />
      ) : (
        <CircleDashed className="mt-0.5 size-5 text-[var(--color-gold)]" />
      )}
      <div>
        <div className="flex items-center gap-3">
          <p className="font-semibold">{label}</p>
          <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-paper)] px-3 py-1 text-[var(--color-pine)]">
            {status}
          </Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {detail}
        </p>
      </div>
    </div>
  );
}
