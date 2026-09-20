# Study Mantra Astrology — Production Chat + Astrologer + Admin Upgrade

This is an additive upgrade of the current Study Mantra Astrology V9 base.

## Included

### Astrologer Panel
- Overview / status
- Profile, expertise, languages, fee, discount
- Online/offline availability
- Ranked astrologer score
- Chat Requests
- User names only in request list (no email/mobile)
- Strict 2-minute astrologer acceptance window
- Strict 2-minute user confirmation window after astrologer accepts
- Automatic `missed by astrologer` / `missed by user` status
- Live chat section with 2.5-second refresh fallback
- Users / Kundli history
- Reviews
- Earnings & payment records

### Chat workflow
1. User selects an approved online astrologer.
2. Chat request is created with a server timestamp.
3. Astrologer has 120 seconds to accept.
4. If not accepted, the server changes the request to `missed` + `missed_by=astrologer`.
5. If accepted, the user gets a fresh 120-second confirmation deadline.
6. If the user does not confirm in time, the server changes it to `missed` + `missed_by=user`.
7. Only `accepted` chats can send messages.
8. Either participant can close an active chat.

The server enforces these deadlines; the browser countdown is only the visual timer.

### Ranking
The rank score is calculated from:
- rating average
- completed chats
- request acceptance rate
- response speed
- astrologer-side missed-request reliability

The score is normalized to 0–100 and stored with rank position and supporting metrics.

### Admin Panel
- Overview dashboard
- Astrologer application approval/rejection
- Verified astrologer management
- Ranking recalculation
- Fee/discount/online controls
- User search
- User block/unblock
- Payment approval/rejection/refund status
- Chat monitoring and force-close
- Message monitoring
- Review moderation
- Audit log

### Payment module
The included payment module is a working manual/transaction-reference approval workflow. It does not pretend to be a payment gateway. A real gateway requires its own merchant credentials/webhooks.

## Supabase setup
Run the existing SQL files in order, then run:

`supabase/production-chat-admin.sql`

This migration is additive and preserves the existing Kundli, Dasha, Numerology, Panchang, Matching and other systems.

## Environment variables
Keep the existing Vercel variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_REGISTRATION_CODE` (for the existing protected admin-registration flow)

Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

## Vercel
This project uses one API gateway (`api/index.js`) so the Hobby deployment does not create one Serverless Function per API route. The gateway dispatches `/api/*` routes internally.

## Important
- This upgrade does not remove the existing astrology engine or the existing feature pages.
- Swiss Ephemeris/local calculation and the existing V9 astrology features remain in the project.
- Chat authorization should remain protected by Supabase RLS in addition to server checks.
