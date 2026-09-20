# Study Mantra — Login & Storage Stability Fix

This patch fixes two recurring issues:

1. `Could not find public.storage schema` during the main database setup.
2. Repeated logout caused by stale/expired access tokens in browser localStorage.

## What changed
- Supabase browser client restores the persisted Supabase session on every page load.
- Access tokens are refreshed/read from the current Supabase session before protected API calls.
- User/Astrologer/Dashboard/Chat/Call/Shared-Kundli pages no longer treat every API/network error as a logout.
- A real 401 or missing session still sends the user to the appropriate login page.
- `FINAL_SETUP.sql` no longer directly references the managed `storage` schema.
- Astrologer registration already treats profile-photo upload as optional; if Storage is unavailable, account registration continues and the UI can show initials.

## Important
After replacing the files in GitHub, redeploy Vercel.
Then run the updated `supabase/FINAL_SETUP.sql` in the correct Supabase project's SQL Editor.

Do NOT delete existing users, profiles, chats, Kundlis, or other data.

For astrologer photo uploads, optionally create a public Supabase Storage bucket named `astrologer-photos` from Dashboard -> Storage. The application does not require that bucket for login/chat/User Panel operation.

## Vercel environment variables
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Never expose the service-role key in browser code.
