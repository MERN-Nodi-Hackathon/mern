# MERN Nodi Hackathon

Supabase-first scheduling starter for the MERN Nodi hackathon. This baseline gives the team a routed React app, Tailwind v4 styling, shared TypeScript contracts, Supabase schema and seed files, and Edge Function scaffolding for booking and reminders.

## Stack

- React 19 + Vite 8
- TypeScript + npm workspaces
- Tailwind CSS 4 + shadcn/ui
- Supabase Auth + Postgres + Edge Functions
- React Router 7

## Repo Layout

```text
apps/web           React app, auth shell, dashboard pages
packages/shared    Shared Zod schemas and TypeScript contracts
supabase           SQL migrations, seed data, Edge Functions
```

## Quick Start

1. Use Node `22` with `nvm use`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the web env template:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open the app at `http://localhost:5173`.

## Supabase Setup

1. Create a hosted Supabase project.
2. In the SQL editor, run the migration in [supabase/migrations/20260403113500_initial_hackathon_schema.sql](/Users/ceron/Developer/Projects/hackathons/mern/supabase/migrations/20260403113500_initial_hackathon_schema.sql).
3. Run the seed file in [supabase/seed.sql](/Users/ceron/Developer/Projects/hackathons/mern/supabase/seed.sql).
4. Invite or create one staff user in Supabase Auth.
5. Sign in through the app. The auth trigger will create a `profiles` row and attach that user to clinic `1`.

## Edge Functions

- `booking-flow`
  Handles availability, booking, rescheduling, and cancellation.
- `reminders`
  Finds due appointments and sends reminders, with a dry-run mode by default.

Required function secrets when you deploy:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER` or `TWILIO_SMS_NUMBER`
- `GOOGLE_CALENDAR_ACCESS_TOKEN`
- `GOOGLE_CALENDAR_DEFAULT_ID`

Without Twilio or Google credentials, the adapters fall back to safe mock behavior so frontend and function work can continue in parallel.

## Team Workflow

- `npm run dev`
  Starts the Vite app.
- `npm run lint`
  Runs ESLint across workspaces.
- `npm run typecheck`
  Runs TypeScript checks across workspaces.
- `npm run build`
  Builds the shared package and the web app.

## Security Notes

- The GitHub personal access token and database password shared in chat should be rotated immediately.
- Only public Supabase client values belong in `.env.example`.
- Keep service-role keys, Twilio secrets, Google tokens, and database passwords out of git.
