# Study Mantra V6 — Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste `supabase/schema.sql` and run it.
4. In your server environment set:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser JavaScript.
6. Enable Realtime for `messages`, `conversations`, and `notifications` when the chat UI is connected.
7. Keep RLS enabled.

The V6 SQL is a foundation. Before production, review every policy against the exact UI and business rules.
