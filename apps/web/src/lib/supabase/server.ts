import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';

export function createClient(request: Request) {
  const headers = new Headers();
  const processEnv =
    (
      globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env ?? {};
  const url = processEnv.VITE_SUPABASE_URL ?? processEnv.SUPABASE_URL;
  const publishableKey =
    processEnv.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    processEnv.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      'Missing Supabase environment variables for the server helper.',
    );
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '') as {
          name: string;
          value: string;
        }[];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append(
            'Set-Cookie',
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });

  return { supabase, headers };
}
