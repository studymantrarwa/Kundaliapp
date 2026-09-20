# Study Mantra — Professional Admin + Approval Upgrade

This upgrade keeps the existing Study Mantra systems and replaces only the Admin Control Center UI with a professional responsive dashboard inspired by modern astrology/admin apps.

## Included
- Professional dark blue/purple admin dashboard
- Dashboard KPI cards
- Astrologer Approval with search and status filters
- Applicant profile/details modal
- Approve / Reject actions with saving state and error toast
- Hardened server-side approval flow
- Astrologer ranking/performance
- Users / block-unblock
- Payment approval
- Chat monitor and message viewer
- Review moderation
- Audit log
- Mobile responsive sidebar and tables

## Approval fix
The API now:
1. Verifies the logged-in admin role server-side.
2. Promotes the selected profile to `astrologer`.
3. Creates/updates the `astrologers` record.
4. Saves application status as `approved` or `rejected`.
5. Returns a clear error if any step fails.
6. Retries with core columns for older databases that have not yet added the optional education/avatar columns.

## Supabase
Run:
- `supabase/FINAL_SETUP.sql`
- If your existing database was created before the latest astrologer fields, also run `supabase/ADMIN_APPROVAL_FIX.sql`.

Do not put the Supabase service-role key in frontend code.
