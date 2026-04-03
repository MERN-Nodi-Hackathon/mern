import {
  Activity,
  CalendarDays,
  Cog,
  Hospital,
  LogOut,
  Stethoscope,
  Users,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/supabase/auth-context';
import { cn } from '@/lib/utils';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: Activity },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/providers', label: 'Providers', icon: Stethoscope },
  { to: '/services', label: 'Services', icon: Hospital },
  { to: '/settings', label: 'Settings', icon: Cog },
];

export function AppShell() {
  const { clinic, profile, signOut, isConfigured } = useAuth();

  return (
    <div className="app-shell-frame min-h-screen px-4 py-4 text-[var(--foreground)] md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="editorial-card rounded-[2rem] p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.66)] p-3 text-[var(--color-pine)]">
              <Hospital className="size-6" />
            </div>
            <div>
              <p className="eyebrow text-[11px] text-[var(--muted)]">
                Hackathon Build
              </p>
              <h1 className="headline-display text-3xl font-semibold">
                Clinic Ops
              </h1>
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-[var(--border)] bg-[rgba(20,53,45,0.94)] p-5 text-white">
            <p className="eyebrow text-[11px] text-white/60">Active Clinic</p>
            <p className="mt-3 headline-display text-3xl font-semibold">
              {clinic?.name ?? 'Baseline Preview'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white"
              >
                {clinic?.timezone ?? 'America/Bogota'}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white"
              >
                {isConfigured ? 'Hosted Supabase' : 'Preview Data'}
              </Badge>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between rounded-2xl border px-4 py-3 transition',
                    isActive
                      ? 'border-[rgba(20,53,45,0.16)] bg-[rgba(20,53,45,0.94)] text-white shadow-lg'
                      : 'border-transparent bg-[rgba(255,255,255,0.54)] text-[var(--foreground)] hover:border-[var(--border)] hover:bg-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'size-4',
                          !isActive && 'text-[var(--color-moss)]',
                        )}
                      />
                      <span className="font-medium">{label}</span>
                    </span>
                    <span
                      className={cn(
                        'size-2 rounded-full transition',
                        isActive
                          ? 'bg-[var(--color-gold)]'
                          : 'bg-[rgba(18,32,24,0.16)]',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <Separator className="my-6 bg-[var(--border)]" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-11 border border-[var(--border)]">
                <AvatarFallback className="bg-[var(--color-blush)] text-[var(--color-pine)]">
                  {(profile?.full_name ?? profile?.email ?? 'MN')
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {profile?.full_name ?? 'Hackathon teammate'}
                </p>
                <p className="truncate text-sm text-[var(--muted)]">
                  {profile?.email ??
                    'Connect Supabase auth to see your profile'}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void signOut()}
              className="rounded-full"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </aside>

        <main className="editorial-card rounded-[2rem]">
          <div className="flex min-h-[calc(100vh-2rem)] flex-col">
            <header className="flex flex-col gap-4 border-b border-[var(--border)] px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <p className="eyebrow text-[11px] text-[var(--muted)]">
                  Operations Workspace
                </p>
                <h2 className="headline-display mt-2 text-4xl font-semibold">
                  Scheduling, grounded.
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="rounded-full border border-[var(--border)] bg-white px-4 py-1 text-[var(--color-pine)]">
                  Staff auth
                </Badge>
                <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-blush)] px-4 py-1 text-[var(--color-pine)]">
                  Google Calendar ready
                </Badge>
              </div>
            </header>

            <div className="flex-1 px-6 py-6 md:px-8 md:py-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
