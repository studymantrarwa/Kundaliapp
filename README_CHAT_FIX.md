# Study Mantra Chat + Storage Fix

1. Upload the changed public files and `lib/api/chat.js` to GitHub.
2. Run `supabase/CHAT-STORAGE-AND-GRANTS-FIX.sql` in Supabase SQL Editor.
3. Do not run the old `FINAL_SETUP.sql` if it stops at `storage.buckets`; the managed storage schema must not be created or modified.
4. In Supabase Storage, create `astrologer-photos` only if photo uploads are needed.
5. Test: Astrologer Online ON + Chat ON -> User Panel -> Chat.
6. The user now remains on User Panel after creating a request, and the request appears in Active Chats.
7. Chat page keeps polling even if Realtime authorization is temporarily unavailable, so a Realtime failure no longer makes the chat page look broken.
