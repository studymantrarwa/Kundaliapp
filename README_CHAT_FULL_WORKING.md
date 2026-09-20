# Study Mantra — Chat Full Working + Availability Fix

This is a small additive patch. Upload/replace only the listed files in the existing project.

## What it fixes
- Astrologer Chat ON + Online => User sees **green Chat Available** and Chat button enabled.
- Chat OFF OR Offline => User sees **red Chat Off** and Chat button disabled.
- User panel refreshes availability periodically so status changes appear without rebuilding the page.
- Server chat request checks both `online` and `chat_enabled`; UI alone cannot bypass it.
- Clear request state/error handling.
- Astrologer can accept/reject requests.
- User confirmation window remains 2 minutes.
- Active chat opens only after both sides confirm.
- Messages are saved in Supabase and can be read from history.
- Chat page has Realtime plus polling fallback.
- Private Realtime channel authorization is restricted to conversation participants.

## Files to replace/add
- public/user-panel.html
- public/astrologer-dashboard.html
- public/chat.html
- lib/api/chat.js
- lib/api/astrologers.js
- lib/api/astrologer-profile.js
- lib/api/astrologer-requests.js
- lib/api/follow.js
- supabase/CHAT-FULL-WORKING-FIX.sql

## Supabase
Run `supabase/CHAT-FULL-WORKING-FIX.sql` in SQL Editor once. It is additive and does not delete existing application data.

## Test
1. Astrologer login -> Online ON -> Chat ON -> save.
2. User login -> User Panel -> Astrologer card should show green **Chat Available**.
3. Tap Chat -> request appears as **Request Sent**.
4. Astrologer -> Chat Requests -> Accept.
5. User -> Confirm Chat.
6. Both sides -> `/chat.html?conversation_id=...` and send messages.
7. Turn Chat OFF or Offline. User card should become red and Chat button disabled after refresh/poll.
