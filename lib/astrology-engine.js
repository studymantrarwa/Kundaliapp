const { calculateEphemeris } = require("./ephemeris-provider");

const SIGNS = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"];
const NAK = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const LORDS = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const YEARS = {Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17};
const PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const norm = x => ((Number(x) % 360) + 360) % 360;
const sign = x => Math.floor(norm(x) / 30) + 1;

function nakshatra(longitude) {
  const span = 360 / 27;
  const q = norm(longitude) / span;
  const index = Math.min(26, Math.floor(q));
  const fraction = q - index;
  return {
    name: NAK[index],
    index: index + 1,
    pada: Math.min(4, Math.floor(fraction * 4) + 1),
    lord: LORDS[index % 9],
    degreesInNakshatra: +(fraction * 13.3333333333).toFixed(6)
  };
}

function houseFromAsc(asc, longitude) {
  return ((sign(longitude) - sign(asc) + 12) % 12) + 1;
}

// Standard Parashari Navamsa sign calculation.
// Movable signs start from themselves; fixed signs from 9th; dual signs from 5th.
function navamsaSign(longitude) {
  const s = sign(longitude) - 1;
  const part = Math.min(8, Math.floor((norm(longitude) % 30) / (30/9)));
  const modality = s % 3; // 0 movable, 1 fixed, 2 dual
  const start = modality === 0 ? s : modality === 1 ? (s + 8) % 12 : (s + 4) % 12;
  return ((start + part) % 12) + 1;
}

function buildD1(asc, planets) {
  const lagna = sign(asc);
  const d1 = Array.from({length:12}, (_, i) => {
    const s = ((lagna - 1 + i) % 12) + 1;
    return {house:i+1, sign:s, signName:SIGNS[s-1], planets:[]};
  });
  for (const p of PLANETS) d1[planets[p].house-1].planets.push(p);
  return d1;
}

function buildD9(planets) {
  const d9 = Array.from({length:12}, (_, i) => ({house:i+1, sign:i+1, signName:SIGNS[i], planets:[]}));
  for (const p of PLANETS) {
    const s = navamsaSign(planets[p].longitude);
    d9[s-1].planets.push(p);
  }
  return d9;
}

function makeUnsupportedVarga(name) {
  return {
    supported:false,
    name,
    note:"V5 keeps this chart slot explicit instead of using an invalid generic divisor formula. Implement the traditional Parashari/Jaimini rule set before marking it production-accurate."
  };
}

function addYears(date, years) {
  return new Date(date.getTime() + Number(years) * 365.2425 * 86400000);
}

function parseBirthDateTime(input) {
  const time = String(input.time || "12:00").trim();
  const safeTime = /^\d{2}:\d{2}(:\d{2})?$/.test(time) ? (time.length === 5 ? time + ":00" : time) : "12:00:00";
  // The ephemeris bridge is responsible for converting local birth time + timezone to UT.
  // Dasha boundaries are represented from the local birth timestamp here.
  return new Date(`${input.dob}T${safeTime}+05:30`);
}

function generateSubPeriods(start, totalYears, parentLord) {
  const result = [];
  let cursor = new Date(start);
  const parentYears = YEARS[parentLord];
  const orderStart = LORDS.indexOf(parentLord);
  for (let j=0; j<9; j++) {
    const lord = LORDS[(orderStart + j) % 9];
    const years = totalYears * YEARS[lord] / 120;
    const end = addYears(cursor, years);
    result.push({lord, start:cursor.toISOString().slice(0,10), end:end.toISOString().slice(0,10), years});
    cursor = end;
  }
  return result;
}

function dashas(moonLongitude, input) {
  const birth = parseBirthDateTime(input);
  const n = nakshatra(moonLongitude);
  const lord = n.lord;
  const span = 360/27;
  const fractionElapsed = (norm(moonLongitude) % span) / span;
  const balanceYears = YEARS[lord] * (1 - fractionElapsed);

  const mahadasha = [];
  let cursor = new Date(birth);
  let index = LORDS.indexOf(lord);
  for (let i=0; i<18; i++) {
    const mdLord = LORDS[(index+i) % 9];
    const years = i === 0 ? balanceYears : YEARS[mdLord];
    const end = addYears(cursor, years);
    const ad = generateSubPeriods(cursor, years, mdLord);
    const pd = ad.flatMap(a => generateSubPeriods(new Date(a.start+"T00:00:00Z"), a.years, a.lord)
      .map(x => ({...x, antardasha:a.lord})));
    mahadasha.push({
      lord:mdLord,
      start:cursor.toISOString().slice(0,10),
      end:end.toISOString().slice(0,10),
      years,
      balanceAtBirth:i===0,
      antardasha:ad,
      pratyantardasha:pd
    });
    cursor = end;
  }
  return {
    birthDate: input.dob,
    birthTime: input.time,
    startingLord: lord,
    balanceYears:+balanceYears.toFixed(8),
    mahadasha
  };
}

function rules(planets) {
  const yogas = [], doshas = [];
  const same = (a,b) => planets[a].sign === planets[b].sign;

  if (same("Sun","Mercury"))
    yogas.push({name:"Budhaditya Yoga", basis:"Sun and Mercury occupy the same sign.", status:"Detected", severity:"Informational"});
  if ([1,4,7,10].includes(planets.Jupiter.house) && [1,4,7,10].includes(planets.Moon.house))
    yogas.push({name:"Gajakesari Yoga (screening)", basis:"Moon and Jupiter are both in angular houses from Lagna in this screening rule.", status:"Detected", severity:"Informational"});
  if ([1,4,7,8,12].includes(planets.Mars.house))
    doshas.push({name:"Mangal Dosha (screening)", basis:"Mars is in one of the configured Manglik houses from Lagna.", status:"Rule match", severity:"Needs full cancellation/context check"});
  if (same("Sun","Rahu") || same("Sun","Ketu"))
    doshas.push({name:"Surya Grahan Yoga", basis:"Sun and a lunar node share a sign.", status:"Rule match", severity:"Context dependent"});
  if (same("Moon","Rahu") || same("Moon","Ketu"))
    doshas.push({name:"Chandra Grahan Yoga", basis:"Moon and a lunar node share a sign.", status:"Rule match", severity:"Context dependent"});
  return {yogas, doshas};
}

async function calculateKundli(input) {
  const provider = await calculateEphemeris(input);
  const asc = Number(provider.houses.ascendant);
  const lagnaSign = sign(asc);
  const planets = {};

  for (const p of PLANETS) {
    const z = provider.planets[p];
    const s = sign(z.longitude);
    planets[p] = {
      name:p,
      longitude:+Number(z.longitude).toFixed(6),
      latitude:+Number(z.latitude || 0).toFixed(6),
      speed:+Number(z.speed || 0).toFixed(8),
      retrograde:Number(z.speed || 0) < 0,
      sign:s,
      signName:SIGNS[s-1],
      house:houseFromAsc(asc, z.longitude),
      nakshatra:nakshatra(z.longitude),
      d9Sign:navamsaSign(z.longitude)
    };
  }

  const d1 = buildD1(asc, planets);
  const d9 = buildD9(planets);
  const charts = {
    D1:d1,
    D9:d9,
    D2:makeUnsupportedVarga("D2"),
    D3:makeUnsupportedVarga("D3"),
    D4:makeUnsupportedVarga("D4"),
    D5:makeUnsupportedVarga("D5"),
    D6:makeUnsupportedVarga("D6"),
    D7:makeUnsupportedVarga("D7"),
    D8:makeUnsupportedVarga("D8"),
    D10:makeUnsupportedVarga("D10"),
    D11:makeUnsupportedVarga("D11"),
    D12:makeUnsupportedVarga("D12"),
    D16:makeUnsupportedVarga("D16"),
    D20:makeUnsupportedVarga("D20"),
    D24:makeUnsupportedVarga("D24"),
    D27:makeUnsupportedVarga("D27"),
    D30:makeUnsupportedVarga("D30"),
    D40:makeUnsupportedVarga("D40"),
    D45:makeUnsupportedVarga("D45"),
    D60:makeUnsupportedVarga("D60")
  };

  const rd = rules(planets);
  return {
    input,
    ayanamsa:"Lahiri",
    lagna:{longitude:+asc.toFixed(6), sign:lagnaSign, signName:SIGNS[lagnaSign-1]},
    planets,
    charts,
    dasha:dashas(provider.planets.Moon.longitude, input),
    ...rd,
    engine:{
      name:"Study Mantra Astrology Engine V5",
      provider:provider.fallback ? "fallback-development" : "local-swiss-ephemeris",
      productionRequired:!!provider.fallback,
      accuracyNote:provider.fallback
        ? "Fallback astronomy is development-only and must not be presented as production-accurate."
        : "Planetary positions come from the configured local ephemeris provider."
    }
  };
}

module.exports = {calculateKundli, SIGNS, NAK, navamsaSign};
