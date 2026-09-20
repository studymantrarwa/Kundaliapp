# Study Mantra Admin Panel — Setup

## 1. Supabase SQL
Run these files in Supabase SQL Editor in this order:
1. `supabase/schema.sql`
2. `supabase/astrologer-dashboard.sql`
3. `supabase/admin-panel.sql`

The third migration is additive. It creates `admin_audit_logs` and adds review moderation fields.

## 2. Make the first admin
Create a normal account from `/auth.html`, then run this in Supabase SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'admin', updated_at = now()
where email = 'YOUR-ADMIN-EMAIL@example.com';
```

Do not expose the Supabase service-role key in browser code.

## 3. Admin URLs
- `/admin-panel-entry.html` — protected entry page
- `/admin-panel.html` — full admin control center
- `/dashboard.html` — normal dashboard; an admin sees an Admin Panel button

## 4. Admin features
- Overview statistics
- User search and role management
- Astrologer application approval/rejection
- Astrologer verification, online status, fee and discount
- Chat monitoring and chat close action
- Review moderation: approve/hide/flag
- Admin audit log

## 5. Vercel environment variables
Keep these server variables configured in Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key is used only by server-side `/api` code.
