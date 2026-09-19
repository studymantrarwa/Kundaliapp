# Study Mantra — Supabase Login & Signup Setup

This version adds Supabase Auth without replacing the existing Kundli, Matching, Numerology, Panchang, chart, Dasha, Yoga/Dosha, Phalaadesh, or professional Home/Index systems.

## 1. Supabase environment variables
Set these in Vercel Project Settings → Environment Variables:

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase publishable/anon key
- `SUPABASE_SERVICE_ROLE_KEY` — server-only service role key (never put this in HTML)

## 2. Run the SQL
Open Supabase → SQL Editor and run `supabase/schema.sql` from this ZIP. The schema creates `profiles` linked to `auth.users`, role/RLS foundations, and the signup profile trigger.

## 3. Email confirmation
For production, configure Supabase Auth → URL Configuration:
- Site URL: your Vercel site
- Redirect URL: `https://YOUR-DOMAIN/auth.html`

If email confirmation is enabled, signup will show a message asking the user to confirm their email before login.

## 4. Login/Signup
Open `/auth.html`.
- Login uses Supabase `signInWithPassword`.
- Signup uses Supabase `signUp` and saves the full name in Auth user metadata.
- The existing backend APIs receive the Supabase access token through `Authorization: Bearer ...`.
- Logout clears the local token and returns to Home.
- Forgot-password sends a Supabase password reset email.

## 5. Security
Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend files. The browser receives only `SUPABASE_URL` and `SUPABASE_ANON_KEY` through `/api/config`.

New accounts are created with the database `user` role. Astrologer/admin privileges should be granted through the protected profile/admin workflow, not by trusting a browser-supplied role.
