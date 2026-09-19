# Study Mantra Astrology V8 — Vercel Ready

## Deployment
1. Upload the contents of this folder to a GitHub repository (do not upload the ZIP itself as the project root).
2. Import the repository into Vercel.
3. Set these Vercel Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy.

## Important
- The Vercel API files in `/api` use Supabase Auth/PostgREST.
- The service-role key is server-only and is never returned by `/api/config`.
- Do not put `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- The local `server.js` is retained for local development, but Vercel uses `/api/*.js`.
- The local Swiss Ephemeris bridge is not invoked by Vercel automatically. For accurate Swiss Ephemeris calculations in production, deploy the calculation engine on infrastructure that can run Python + pyswisseph and connect it through a controlled internal service. This project does not use a third-party astrology calculation API.
- The included place list is a small offline seed, not a worldwide geocoder.
