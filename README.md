# Study Mantra Astrology V5

V5 is a safer astrology-engine foundation focused on **local Swiss Ephemeris**, a correct North Indian D1/D9 presentation, and transparent accuracy status.

## What changed from V4

- Local Swiss Ephemeris bridge: `ephemeris_bridge.py`
- Uses `pyswisseph` locally; no third-party astrology API
- Lahiri sidereal mode
- Mean lunar node convention is explicit
- Exact birth date/time is passed into the dasha calculation
- Vimshottari MD → AD → PD hierarchy is generated from the birth Moon's nakshatra
- Standard Navamsa (D9) sign calculation
- North Indian D1 and D9 SVG rendering, responsive on mobile
- D2/D3/etc. are intentionally marked unsupported instead of using a mathematically invalid generic divisor formula
- Development fallback is clearly marked as NOT production accurate

## Local Swiss Ephemeris setup

1. Install Python 3.10+.
2. Run:
   `python -m pip install -r requirements.txt`
3. Test:
   `python ephemeris_bridge.py`
4. Set the Node environment variable.

Windows:
`set STUDY_MANTRA_EPHEMERIS_CMD=python ephemeris_bridge.py`

Linux/macOS:
`export STUDY_MANTRA_EPHEMERIS_CMD="python3 ephemeris_bridge.py"`

Then:
`npm start`

The bridge accepts one JSON line and returns one JSON line. It computes locally.

## Important licensing

Swiss Ephemeris has a dual-license model (AGPL or Professional License). Before distributing a public/commercial service, review the current official licensing terms and choose the license path that fits the project.

## Vercel note

The V5 demo still uses a local JSON file for the foundation. Do not use that file as persistent production storage on serverless hosting. The next production step is replacing JSON persistence with Supabase/Postgres and moving the ephemeris bridge to a server environment that can run the local executable/library.

## Accuracy

V5 does not claim that every astrology feature is production-validated. Planetary positions are only as accurate as the configured local Swiss Ephemeris installation and the input/timezone data. Yogas, doshas, Panchang and all divisional charts need individual rule validation before being marketed as an authoritative service.


## V6 production foundation

- Supabase/Postgres schema with profiles, roles, astrologers, kundalis, conversations, messages, reviews and notifications.
- Row Level Security policies included in `supabase/schema.sql`.
- Password hashing/session utility in `lib/security.js` for the legacy Node foundation.
- Role-aware dashboard shell.
- Service-role key is server-only.
- Vercel/serverless production should use Supabase rather than local JSON persistence.


## V7
Role-aware User/Astrologer/Admin dashboard UI, chat UI foundation, browser Supabase client, Realtime message subscription, and deployment environment documentation. Legacy JSON routes remain until the next Supabase backend migration.
