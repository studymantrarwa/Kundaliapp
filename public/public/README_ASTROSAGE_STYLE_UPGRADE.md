# Study Mantra AstroSage-style panel upgrade

This build adds an AstroSage-inspired mobile astrologer experience while keeping Study Mantra branding.

## Included
- Separate User / Astrologer / Admin login roles
- Astrologer registration: name, mobile, email, password, profile photo, education, experience, bio, speciality, languages, starting fee
- Admin approval before public visibility
- Astro Panel home, earnings, performance, support and dedicated Chats section
- Chat list with All / Accepted / Rejected / Missed / Closed filters
- WhatsApp-style one-to-one chat UI
- User name + birth details at top of chat and Kundli button
- Closed/rejected/missed chat is recent for 48 hours, then remains permanently readable in Archive
- User astrologer profile page with education, experience, speciality, languages, bio, fee, discount, rating, online status and Chat/Call
- Admin dashboard with astrologer approval/rejection, users, chat monitor, reviews, payment status and audit
- Supabase Auth + RLS/Realtime foundation

## Important
Run `supabase/FINAL_SETUP.sql` (or the additive SQL files required by your current deployment) after backup. No automatic deletion of chat history is performed by this upgrade.
