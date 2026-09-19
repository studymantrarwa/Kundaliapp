# V7 deployment path

## Supabase
Run `supabase/schema.sql` in Supabase SQL Editor.

## Environment variables
Set these on the server:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STUDY_MANTRA_EPHEMERIS_CMD (on a server that can run the local bridge)

Never put the service-role key in browser code.

## Realtime
Enable Realtime for:
- public.messages
- public.conversations
- public.notifications

The dashboard subscribes to message inserts when Supabase is configured.

## Important
The dashboard is a UI foundation; the existing legacy JSON routes are not yet converted to Supabase persistence. That conversion is the next backend migration step before claiming full production readiness.
