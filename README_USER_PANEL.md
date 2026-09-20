# Study Mantra User Panel

## User login
Use `/user-login.html` for a dedicated User-only login.

After a successful User login, the app opens `/user-panel.html`.

## User panel
The dedicated User Panel includes:
- Approved astrologer list
- Online/offline status
- Rating, fee, discount, education and expertise
- Profile button
- Chat button for available astrologers
- Call button when enabled
- Active/recent/permanent chat history
- Direct Kundli access from chat
- Mobile responsive layout

## Chat test
1. Login with a `user` account at `/user-login.html`.
2. Open an approved astrologer.
3. The astrologer must be `online` and have chat enabled.
4. Tap `Chat`.
5. The request is created through `/api/chat`.
6. Login as the approved astrologer at `/astrologer-login.html` and accept the request.
7. Confirm on the user side when prompted, then chat becomes active.
