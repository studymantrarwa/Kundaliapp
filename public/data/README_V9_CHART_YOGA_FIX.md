# V9 Chart + Yoga Fix

Fixed the main Kundli display problems:
- Vercel-safe astronomical fallback no longer uses the seeded/random fake planet placement.
- Sidereal Lahiri positions are calculated from local astronomical formulas.
- Whole-sign houses are counted from the real sidereal Lagna.
- North Indian D1 sign/house placement is corrected.
- D9 Navamsa now calculates the Navamsa Lagna and places planets into D9 houses correctly.
- Planet labels are rendered one per line to reduce overlap.
- Shubh Yoga and Ashubh Yoga/Dosha rule screening now includes multiple configured rules and a rule-count message instead of a misleading empty registry.

The local Swiss Ephemeris bridge remains supported for verification/high-fidelity calculation when configured. No remote astrology calculation API is added.
