import { useEffect, useState } from 'react';

import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/supabase/auth-context';

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConfigured, loading, signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const target = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      navigate(target ?? '/dashboard', { replace: true });
    }
  }, [location.state, navigate, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setError(
        'Set the Supabase URL and publishable key in apps/web/.env.local first.',
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate('/dashboard', { replace: true });
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Unable to sign in with Supabase.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-4 md:px-6">
      <div className="app-shell-frame mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="editorial-card flex rounded-[2rem] p-8 md:p-12">
          <div className="flex max-w-2xl flex-col justify-between">
            <div>
              <Badge className="rounded-full border border-[var(--border)] bg-[var(--color-blush)] px-4 py-1 text-[var(--color-pine)]">
                Scheduling MVP Baseline
              </Badge>
              <h1 className="headline-display mt-8 max-w-xl text-6xl font-semibold leading-none md:text-7xl">
                A clinic dashboard that already feels staffed.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted-foreground)]">
                This starter is built for a hackathon team: React, Vite,
                Tailwind, Supabase auth, routed admin modules, SQL migrations,
                Edge Functions, and seeded scheduling data.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none">
                <CardContent className="space-y-3 p-6">
                  <ShieldCheck className="size-5 text-[var(--color-moss)]" />
                  <h2 className="headline-display text-3xl font-semibold">
                    Team-ready access
                  </h2>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                    Staff accounts use Supabase Auth and row-level security.
                    Patients stay account-less in the MVP.
                  </p>
                </CardContent>
              </Card>

              <Card className="editorial-card rounded-[1.75rem] border-[var(--border)] shadow-none">
                <CardContent className="space-y-3 p-6">
                  <KeyRound className="size-5 text-[var(--color-moss)]" />
                  <h2 className="headline-display text-3xl font-semibold">
                    Hosted-first flow
                  </h2>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                    Add the shared Supabase credentials, invite one staff user,
                    and teammates can start building immediately.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="editorial-card flex rounded-[2rem] p-8 md:p-10">
          <div className="m-auto w-full max-w-md">
            <p className="eyebrow text-[11px] text-[var(--muted)]">
              Staff Sign-In
            </p>
            <h2 className="headline-display mt-3 text-5xl font-semibold">
              Enter the floor.
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Use a Supabase Auth user created for your hackathon team. After
              sign-in, the profile trigger links you to the default clinic.
            </p>

            {!isConfigured ? (
              <Card className="mt-8 rounded-[1.75rem] border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.7)]">
                <CardContent className="p-6">
                  <p className="font-semibold">Missing local environment</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    Copy `apps/web/.env.example` to `apps/web/.env.local`, keep
                    the provided publishable values, and restart `npm run dev`.
                  </p>
                </CardContent>
              </Card>
            ) : null}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="team@mernnodi.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? (
                <p className="rounded-2xl border border-[var(--border)] bg-[rgba(195,135,61,0.12)] px-4 py-3 text-sm text-[var(--color-pine)]">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={loading || submitting}
                className="h-12 w-full rounded-full bg-[var(--color-pine)] text-white hover:bg-[var(--color-moss)]"
              >
                {submitting ? 'Unlocking workspace...' : 'Sign in'}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
