# V9 Final Fix

Fixed the Free Kundli calculation error:
`fallback.calculate is not a function`

The fallback provider exports `calculateFallback`, and the ephemeris provider now calls that correct function.

The Vercel Hobby single-function gateway and the Free Kundli birth-details form are retained.
