# Study Mantra Astrology — Final 3-Panel + Realtime Chat Build

This ZIP is based on the production Study Mantra Astrology build and keeps the existing V9 astrology systems while adding the requested User / Astrologer / Admin workflow.

## Included panels

### User Panel
- Mobile-first dark/yellow astrology UI
- Approved astrologer list
- Photo, rating, online/offline, expertise, fee and discount
- Chat request and call-request buttons
- 2-minute astrologer acceptance rule
- 2-minute user confirmation rule after astrologer accepts
- Chat only becomes active after both confirmations
- Chat history remains visible for 48 hours after closing/missed/rejected status
- User birth details shown inside an active chat
- Open Kundli button inside chat
- Shared Kundli page with privacy-safe participant details
- Existing Kundli, Matching, Panchang, Numerology and tools remain

### Astrologer Panel
- AstroSage-inspired mobile layout (original Study Mantra styling)
- Profile header, earnings, followers/rating area
- Call / Chat / Video availability toggles
- Boost profile toggle
- Chat Requests section
- 2-minute acceptance countdown
- Accept / Reject
- User 2-minute confirmation countdown
- Live WhatsApp-style chat
- User name + birth details at top of chat
- Open Kundli button
- Users / Kundli history
- Earnings
- Performance
- More / Support
- Profile editor: bio, experience, expertise, languages, rate, discount

### Astrologer Registration
`/astrologer-register.html`
- Name
- Mobile
- Email
- Password
- Profile photo upload/compression
- Experience
- About/Bio
- Astrology expertise
- Languages
- Starting fee
- Application remains pending until Admin approval
- Unapproved astrologer is not shown in User Panel

### Admin Panel
- Admin-only protection
- Overview
- Astrologer approval/rejection
- Astrologer profile/ranking management
- User search and block/unblock
- Payment approval workflow
- Chat monitoring / force close
- Review moderation
- Audit log

## Realtime chat
The browser subscribes to Supabase Realtime for new messages and conversation state changes, with a fallback refresh. Typing status uses Realtime Broadcast.

## Security
- `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- Frontend uses only the Supabase publishable/anon key.
- Supabase RLS policies are included in `supabase/FINAL_SETUP.sql`.
- User mobile/email are not shown to the other participant in chat.
- Kundli access for an astrologer is limited to accepted/closed conversations.

## Setup
1. Keep Vercel variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_REGISTRATION_CODE`
2. In Supabase SQL Editor run `supabase/FINAL_SETUP.sql`.
3. Deploy the complete project to Vercel.
4. Open `/auth.html` for user login.
5. Open `/astrologer-register.html` for new astrologer registration.
6. Open `/admin-login.html` for Admin login.
7. Admin approves the pending astrologer application.
8. Approved astrologer logs in through `/auth.html` and is sent to `/astrologer-dashboard.html`.
9. User logs in and sees approved astrologers in `/dashboard.html`.

## Important about calls
The call request workflow, availability toggle and two-sided confirmation are included. A real PSTN/phone-network call requires a telephony provider or a WebRTC voice service; this ZIP does not pretend to provide a phone network without provider credentials.

## Vercel Hobby
The project keeps a single `/api/index.js` gateway to avoid the Hobby plan's serverless-function-count problem.
