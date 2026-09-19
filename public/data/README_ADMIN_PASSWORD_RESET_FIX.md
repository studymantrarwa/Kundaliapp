# Admin Password Reset Fix

1. Deploy this project to Vercel.
2. In Supabase Authentication -> URL Configuration set Site URL to your production URL.
3. Add this exact Redirect URL:
   https://kundaliapp-pzxeofjv9-alfa-1101.vercel.app/admin-password-reset.html
4. Open /admin-login.html, enter the Admin email, and use "Password Set / Forgot Password".
5. Open the email link. It must land on /admin-password-reset.html.
6. Enter a new password (minimum 8 characters) twice and save.
7. Return to /admin-login.html and sign in with the new password.

The password is managed by Supabase Auth; it is not stored as plain text in public.profiles.
