# Yura

Yura is a student project collaboration platform built with Next.js App Router, Tailwind CSS, and Supabase.

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database Setup

1. Run SQL in `supabase/migrations/20260510210500_init_yura.sql` in your Supabase SQL editor.
2. Optionally run `supabase/seed.sql` for sample skills.

## Main Routes

- `/` landing page
- `/login` and `/signup` auth
- `/feed` project feed
- `/projects/create` create project
- `/projects/[id]` project details
- `/discover` browse students
- `/profile` edit profile
- `/notifications` offers and notifications

## Deploy to Vercel

1. Import the repo in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deploy and verify auth redirects and protected routes.
