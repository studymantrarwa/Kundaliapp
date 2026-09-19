# Study Mantra Astrology V9 — Vercel Hobby Fix

## What this fixes
The previous V9 package had many files directly inside `/api/`.
On Vercel Hobby, that can exceed the 12 Serverless Functions per deployment limit.

This version uses **one** actual Vercel Serverless Function:

`/api/index.js`

The feature handlers are stored under:

`/lib/api/`

The Vercel rewrite sends routes such as:

- `/api/login.js`
- `/api/register.js`
- `/api/kundli.js`
- `/api/chat.js`
- `/api/messages.js`
- `/api/numerology.js`
- `/api/horoscope.js`
- `/api/panchang.js`
- `/api/matching.js`

through the single gateway.

## Important
Do not keep the old individual `.js` files inside `/api/`.
This ZIP already has the corrected structure.

## Deployment
1. Replace the project files in GitHub with the contents of this ZIP.
2. Keep your Supabase environment variables in Vercel.
3. Deploy again.
4. Vercel should count the API gateway as one Serverless Function rather than one function per feature route.

The astrology calculation still uses the project's internal engine / Swiss Ephemeris integration where available; this fix does not add a third-party astrology calculation API.
