# Swiss Ephemeris integration

The project intentionally avoids a third-party astrology HTTP API.

## Data flow

Browser → Study Mantra Node server → local `ephemeris_bridge.py` → Swiss Ephemeris library → JSON → Node → browser.

## Input contract

The bridge receives:
- `dob`
- `time`
- `latitude`
- `longitude`
- `timezone`

## Output contract

It returns:
- `julianDay`
- `ayanamsa`
- `nodeMode`
- `planets`: longitude, latitude, speed
- `houses`: ascendant, MC, cusps

## Validation checklist

Before production:
- UTC conversion around midnight and DST/timezone edge cases
- Lahiri ayanamsa against trusted reference vectors
- mean vs true node convention
- ascendant/houses at high latitudes
- retrograde speed sign
- Nakshatra/Pada boundaries
- Vimshottari dates
- D1/D9 chart placement
- historical dates and leap years

Do not silently fall back to the development astronomy engine in a production report.
