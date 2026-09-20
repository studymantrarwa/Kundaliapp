# Final Setup — User + Astrologer + Admin

## 1. Supabase SQL
Open Supabase → SQL Editor → New query and run:

`supabase/FINAL_SETUP.sql`

Run it once after the existing schema/migrations. It is additive.

## 2. Vercel variables
Project Settings → Environment Variables:

- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_REGISTRATION_CODE

Do not put the service-role key in any HTML or frontend JavaScript.

## 3. Admin
Use `/admin-login.html`. The logged-in Supabase Auth account must have `profiles.role = 'admin'`.

## 4. Astrologer registration
Use `/astrologer-register.html`.

Registration creates a normal Supabase Auth account and a pending `astrologer_applications` row. It does not become public until Admin approves it.

## 5. Approval
Admin Panel → Astrologer Approval → Approve.

Approval:
- changes `profiles.role` to `astrologer`
- creates/updates the verified `astrologers` row
- copies profile photo
- sets `approved_at`

## 6. Chat lifecycle
User sends request → 120 seconds for astrologer → `astrologer_accepted` → 120 seconds for user → `accepted`.

The API rejects late acceptance/confirmation even if a browser countdown is stale. Expired requests are marked `missed` when the next server operation touches them.

Closed/missed/rejected conversations are visible for 48 hours, then hidden from normal chat history.

## 7. Realtime
`messages` and `conversations` are added to the `supabase_realtime` publication by the SQL migration. RLS remains enabled.

## 8. Test order
1. Create User.
2. Create Astrologer from `/astrologer-register.html`.
3. Login Admin and approve the astrologer.
4. Login Astrologer and turn Chat ON + Online.
5. Login User and open Astrologers.
6. Send Chat request.
7. Verify 2-minute countdown on both sides.
8. Astrologer Accept → verify User sees confirmation.
9. User Confirm → verify both enter active chat.
10. Send messages from both devices.
11. Verify realtime delivery and typing indicator.
12. Open Kundli from the chat header.
13. End chat and verify it remains in history for 48 hours.
