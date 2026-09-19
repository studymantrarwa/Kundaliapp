/*
Production adapter boundary.
Replace calculateFallback() with a locally installed/package-bundled Swiss
Ephemeris binding/executable. No remote astrology API is used.

Expected provider result:
{
  julianDay,
  ayanamsa,
  planets: {Sun:{longitude,speed,latitude}, ...},
  houses: {ascendant, mc, cusps:[...]},
  nodeMode: "true"|"mean"
}
*/
function calculateFallback(input){
  const d=new Date(`${input.dob}T${input.time||"12:00"}:00Z`);
  const days=d.getTime()/86400000+2440587.5-2451545;
  const norm=x=>(x%360+360)%360;
  const seed=[input.name,input.dob,input.time,input.place].join("|").split("")
    .reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
  const ay=23.85+(new Date(input.dob).getUTCFullYear()-2000)*0.01397;
  const t={
    Sun:norm(280.46+.9856474*days),
    Moon:norm(218.316+13.176396*days),
    Mars:norm(19.4+.52402075*days),
    Mercury:norm(174.8+1.607*days),
    Jupiter:norm(238+.0830853*days),
    Venus:norm(50.4+1.60213*days),
    Saturn:norm(266.6+.03345965*days)
  };
  t.Rahu=norm(125-.0529539*days); t.Ketu=norm(t.Rahu+180);
  const local=(Number(input.time?.slice(0,2)||12)+Number(input.time?.slice(3,5)||0)/60);
  const asc=norm((local-(Number(input.tzOffset)||5.5))*15+(Number(input.longitude)||80.3)+90-ay+seed%30);
  return {
    julianDay:days+2451545,ayanamsa:ay,
    planets:Object.fromEntries(Object.entries(t).map(([k,v])=>[k,{longitude:norm(v-ay),speed:0,latitude:0}])),
    houses:{ascendant:asc,mc:norm(asc+270),cusps:Array.from({length:12},(_,i)=>norm(asc+i*30))},
    nodeMode:"mean",fallback:true
  };
}
async function calculateEphemeris(input){
  // This fallback keeps V3 runnable without external services.
  return calculateFallback(input);
}
module.exports={calculateEphemeris,calculateFallback};
