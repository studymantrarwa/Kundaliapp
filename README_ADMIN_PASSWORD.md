# Admin Password Setup

Admin password is managed by Supabase Auth. It is intentionally NOT stored in `public.profiles` or any admin table as plain text.

If the admin account already has a Supabase Auth password, use that password on `/admin-login.html`.

If the admin account does not know its password, open `/admin-login.html`, enter the admin email, and press **पहली बार Password Set / Password भूल गए?**. Supabase sends a secure email link to `/admin-password-reset.html`, where the new password can be set.

The profile role must still be `admin`:

```sql
update public.profiles
set role = 'admin', updated_at = now()
where email = 'YOUR_EMAIL@example.com';
```

Do not create or store a plaintext admin password in SQL.
