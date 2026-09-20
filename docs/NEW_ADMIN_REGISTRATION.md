# New Admin Registration

The project now includes `/admin-register.html` and `/api/admin-register`.

## Recommended setup
Set this Vercel environment variable:

`ADMIN_REGISTRATION_CODE`

Use a long random value and keep it private. Redeploy after adding it.

## Registration methods
1. Public registration page: `/admin-register.html` + the registration code.
2. If an existing Admin is already logged in, that Admin can create another Admin without the code.

## Admin-only protection
- `/admin-panel.html` checks the current Supabase session and the server-side `profiles.role`.
- `/api/admin` checks the bearer token and `profiles.role = admin` on every request.
- Non-admin users are redirected away from the admin panel and receive HTTP 403 from admin APIs.
- The Supabase service-role key is server-side only.

## Important
The Admin login password is the password of the website's Admin Auth account. It is separate from the password used to sign in to the Supabase dashboard itself.
