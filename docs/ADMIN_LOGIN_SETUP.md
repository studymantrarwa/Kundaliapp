# Admin Login Setup

1. Supabase Auth में सामान्य account बनाएं।
2. `supabase/admin-panel.sql` run करें।
3. SQL Editor में अपने account को admin करें:

```sql
UPDATE public.profiles SET role = 'admin', updated_at = now() WHERE email = 'YOUR-EMAIL@example.com';
```

4. Vercel पर `/admin-login.html` खोलें।
5. Admin email + password से login करें।
6. Server `/api/me` से role=admin verify होने पर ही panel खुलेगा।

Direct `/admin-panel.html` access भी admin role के बिना panel data नहीं खोलता। Password इस project में hard-code नहीं किया गया है।
