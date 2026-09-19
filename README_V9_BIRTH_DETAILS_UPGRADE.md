# Study Mantra Astrology — Birth Details Upgrade

This upgrade adds a dynamic birth-summary section to the Kundli result page.

## Calculated from the entered Kundli
- Tithi + Paksha
- Janma Nakshatra + Pada + Nakshatra lord
- Nadi, Gana, Yoni, Varna, Vashya
- Nakshatra-based Paya (Rajat/Swarna/Tamra/Loha)
- Lagna, Lagna lord, Moon Rashi, Rashi lord
- Dasha balance at birth
- Weekday, Ishtkaal, local mean time, GMT birth time, Julian day
- Lahiri ayanamsa, obliquity, Hindu/Western Sun sign
- Approximate sunrise, sunset and day duration from the birth coordinates
- Yoga and Karana at birth
- Traditional numerology helper values
- Traditional Ghatak (malefic) table keyed to Moon Rashi
- Traditional favourable-point helper values
- A chart-derived traditional birth phala section

## Important calculation notes
- Paya is explicitly **Nakshatra-based** in this build. Paya tables vary across traditions, so the report labels the method instead of treating it as universal.
- Ghatak Chakra is a traditional lookup table based on Janma Rashi; published tables can differ. The UI labels this clearly.
- Sunrise/sunset uses a Vercel-safe astronomical approximation. For a production-grade Panchang, a validated solar/Panchang implementation should be used.
- Numerology, favourable points and phala are traditional/interpretive helpers, not scientific measurements or guaranteed predictions.
- The core planetary chart still uses the existing local Swiss Ephemeris bridge when configured, with the built-in astronomical fallback otherwise.
