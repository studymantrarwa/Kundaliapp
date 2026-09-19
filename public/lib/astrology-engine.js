const { calculateEphemeris } = require("./ephemeris-provider");
const SIGNS=["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"];
const SIGN_EN=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_LORD=["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
const NAK=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const LORDS=["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const YEARS={Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
const PLANETS=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const norm=x=>((Number(x)%360)+360)%360;
const sign=x=>Math.floor(norm(x)/30)+1;
const relHouse=(fromSign,toSign)=>((toSign-fromSign+12)%12)+1;
function nakshatra(longitude){const span=360/27,q=norm(longitude)/span,index=Math.min(26,Math.floor(q)),f=q-index;return{name:NAK[index],index:index+1,pada:Math.min(4,Math.floor(f*4)+1),lord:LORDS[index%9],degreesInNakshatra:+(f*13.3333333333).toFixed(6)}}
function houseFromAsc(asc,longitude){return relHouse(sign(asc),sign(longitude))}
function navamsaSign(longitude){const s=sign(longitude)-1,part=Math.min(8,Math.floor((norm(longitude)%30)/(30/9))),mod=s%3,start=mod===0?s:mod===1?(s+8)%12:(s+4)%12;return((start+part)%12)+1}
function buildD1(asc,planets){const lagna=sign(asc),d1=Array.from({length:12},(_,i)=>{const s=((lagna-1+i)%12)+1;return{house:i+1,sign:s,signName:SIGNS[s-1],signEnglish:SIGN_EN[s-1],planets:[]}});for(const p of PLANETS)d1[planets[p].house-1].planets.push(p);return d1}
function buildD9(asc,planets){const lagna=navamsaSign(asc),d9=Array.from({length:12},(_,i)=>{const s=((lagna-1+i)%12)+1;return{house:i+1,sign:s,signName:SIGNS[s-1],signEnglish:SIGN_EN[s-1],planets:[]}});for(const p of PLANETS){const ds=planets[p].d9Sign;const h=relHouse(lagna,ds);d9[h-1].planets.push(p)}return d9}
function addYears(date,years){return new Date(date.getTime()+Number(years)*365.2425*86400000)}
function parseBirthDateTime(input){const [y,m,d]=String(input.dob).split('-').map(Number);const [hh,mm,ss]=String(input.time||'12:00').split(':').map(Number);const off=Number(input.timezone??input.tzOffset??5.5);return new Date(Date.UTC(y,m-1,d,hh||0,mm||0,ss||0)-off*3600000)}
function generateSubPeriods(start,totalYears,parentLord){const result=[];let cursor=new Date(start),orderStart=LORDS.indexOf(parentLord);for(let j=0;j<9;j++){const lord=LORDS[(orderStart+j)%9],years=totalYears*YEARS[lord]/120,end=addYears(cursor,years);result.push({lord,start:cursor.toISOString().slice(0,10),end:end.toISOString().slice(0,10),years});cursor=end}return result}
function dashas(moonLongitude,input){const birth=parseBirthDateTime(input),n=nakshatra(moonLongitude),lord=n.lord,span=360/27,elapsed=(norm(moonLongitude)%span)/span,balance=YEARS[lord]*(1-elapsed),maha=[];let cursor=new Date(birth),index=LORDS.indexOf(lord);for(let i=0;i<18;i++){const md=LORDS[(index+i)%9],years=i===0?balance:YEARS[md],end=addYears(cursor,years),ad=generateSubPeriods(cursor,years,md),pd=ad.flatMap(a=>generateSubPeriods(new Date(a.start+"T00:00:00Z"),a.years,a.lord).map(x=>({...x,antardasha:a.lord})));maha.push({lord:md,start:cursor.toISOString().slice(0,10),end:end.toISOString().slice(0,10),years,balanceAtBirth:i===0,antardasha:ad,pratyantardasha:pd});cursor=end}return{birthDate:input.dob,birthTime:input.time,startingLord:lord,balanceYears:+balance.toFixed(8),mahadasha:maha}}
function lordOf(house,lagna){const s=((lagna-1+house-1)%12)+1;return SIGN_LORD[s-1]}
function occupiedHouse(planets,p){return planets[p]?.house||0}
function conjunction(planets,a,b){return planets[a].sign===planets[b].sign}
function kendraFrom(h1,h2){return [1,4,7,10].includes(relHouse(h1,h2))}
function aspectHouses(planet,from,to){const diff=relHouse(from,to);if(diff===7)return true;if(planet==='Mars'&&[4,8].includes(diff))return true;if(planet==='Jupiter'&&[5,9].includes(diff))return true;if(planet==='Saturn'&&[3,10].includes(diff))return true;return false}
function yogaRules(planets,lagna){const yogas=[],doshas=[],addY=(name,basis,strength='Rule match')=>yogas.push({name,basis,status:'Detected',strength}),addD=(name,basis,severity='Context dependent')=>doshas.push({name,basis,status:'Rule match',severity});
  if(conjunction(planets,'Sun','Mercury')) addY('Budhaditya Yoga','Sun and Mercury occupy the same sign. Classical strength depends on combustion, dignity and house context.');
  if(kendraFrom(planets.Moon.sign,planets.Jupiter.sign)) addY('Gajakesari Yoga','Jupiter is in a kendra (1/4/7/10) from the Moon.');
  if(conjunction(planets,'Moon','Mars')) addY('Chandra-Mangala Yoga','Moon and Mars occupy the same sign.');
  if(occupiedHouse(planets,'Mercury')===1||occupiedHouse(planets,'Mercury')===4||occupiedHouse(planets,'Mercury')===7||occupiedHouse(planets,'Mercury')===10){if([1,4,7,10].includes(planets.Mercury.house)&&[3,6].includes(planets.Mercury.sign%3+1)){} }
  const maha=[['Mars','Ruchaka', [1,4,7,10],[1,8]],['Mercury','Bhadra',[1,4,7,10],[3,6]],['Jupiter','Hamsa',[1,4,7,10],[4,9]],['Venus','Malavya',[1,4,7,10],[2,7]],['Saturn','Sasa',[1,4,7,10],[10,11]]];
  for(const [p,name,hs,ss] of maha) if(hs.includes(planets[p].house)&&ss.includes(planets[p].sign)) addY(name+' Mahapurusha Yoga',`${p} is in a kendra and in its own/exaltation sign under the configured Parashari screening rule.`);
  const ninth=lordOf(9,lagna),tenth=lordOf(10,lagna); if(planets[ninth]&&planets[tenth]&&(planets[ninth].sign===planets[tenth].sign||aspectHouses(ninth,planets[ninth].house,planets[tenth].house)||aspectHouses(tenth,planets[tenth].house,planets[ninth].house))) addY('Dharma-Karmadhipati Yoga',`9th lord ${ninth} and 10th lord ${tenth} are connected by conjunction/aspect under the configured rule.`);
  const second=lordOf(2,lagna),fifth=lordOf(5,lagna),ninthLord=lordOf(9,lagna); if([second,fifth,ninthLord].some(p=>planets[p]&&[1,2,5,9,11].includes(planets[p].house))) addY('Dhana Yoga Screening',`A wealth-house lord (2/5/9) occupies a configured wealth-supporting house.`);
  if([1,4,7,8,12].includes(planets.Mars.house)||[1,4,7,8,12].includes(relHouse(planets.Moon.sign,planets.Mars.sign))||[1,4,7,8,12].includes(relHouse(planets.Venus.sign,planets.Mars.sign))) addD('Mangal Dosha','Mars occupies a configured Manglik house from Lagna/Moon/Venus screening.','Cancellation and partner comparison required');
  if(conjunction(planets,'Sun','Rahu')||conjunction(planets,'Sun','Ketu')) addD('Surya Grahan Dosha','Sun is conjunct a lunar node.');
  if(conjunction(planets,'Moon','Rahu')||conjunction(planets,'Moon','Ketu')) addD('Chandra Grahan Dosha','Moon is conjunct a lunar node.');
  const malefics=['Sun','Mars','Saturn','Rahu','Ketu']; if(malefics.some(p=>conjunction(planets,'Moon',p))) addD('Papakartari/Chandra Affliction Screening','Moon is conjunct a configured natural malefic; full Papakartari requires adjacent-house checks.');
  if(planets.Mars.sign===4) addD('Mars Debilitation','Mars is in Cancer, its traditional debilitation sign.');
  if(planets.Saturn.sign===1) addD('Saturn Debilitation','Saturn is in Aries, its traditional debilitation sign.');
  if(planets.Jupiter.sign===10) addD('Jupiter Debilitation','Jupiter is in Capricorn, its traditional debilitation sign.');
  if(planets.Venus.sign===6) addD('Venus Debilitation','Venus is in Virgo, its traditional debilitation sign.');
  return{yogas,doshas,ruleSummary:{yogaRulesChecked:10,doshaRulesChecked:9}};
}

const SIGN_HI=["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"];
const NAK_HI=["अश्विनी","भरणी","कृत्तिका","रोहिणी","मृगशिरा","आर्द्रा","पुनर्वसु","पुष्य","आश्लेषा","मघा","पूर्वाफाल्गुनी","उत्तराफाल्गुनी","हस्त","चित्रा","स्वाती","विशाखा","अनुराधा","ज्येष्ठा","मूल","पूर्वाषाढ़ा","उत्तराषाढ़ा","श्रवण","धनिष्ठा","शतभिषा","पूर्वाभाद्रपद","उत्तराभाद्रपद","रेवती"];
const TITHI_HI=["प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी","षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी","एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी"];
const YOGA_HI=["विष्कम्भ","प्रीति","आयुष्मान","सौभाग्य","शोभन","अतिगण्ड","सुकर्मा","धृति","शूल","गण्ड","वृद्धि","ध्रुव","व्याघात","हर्षण","वज्र","सिद्धि","व्यतीपात","वरीयान","परिघ","शिव","सिद्ध","साध्य","शुभ","शुक्ल","ब्रह्म","इन्द्र","वैधृति"];
const KARANA_MOVING=["बव","बालव","कौलव","तैतिल","गर","वणिज","विष्टि"];
const NAK_NADI=["आदि","मध्य","अन्त्य"];
const NAK_GANA={
  Ashwini:"देव",Bharani:"मनुष्य",Krittika:"राक्षस",Rohini:"मनुष्य",Mrigashira:"देव",Ardra:"मनुष्य",Punarvasu:"देव",Pushya:"देव",Ashlesha:"राक्षस",Magha:"राक्षस",["Purva Phalguni"]:"मनुष्य",["Uttara Phalguni"]:"मनुष्य",Hasta:"देव",Chitra:"राक्षस",Swati:"देव",Vishakha:"राक्षस",Anuradha:"देव",Jyeshtha:"राक्षस",Mula:"राक्षस",["Purva Ashadha"]:"मनुष्य",["Uttara Ashadha"]:"मनुष्य",Shravana:"देव",Dhanishtha:"मनुष्य",Shatabhisha:"राक्षस",["Purva Bhadrapada"]:"मनुष्य",["Uttara Bhadrapada"]:"मनुष्य",Revati:"देव"
};
const NAK_YONI={Ashwini:"अश्व",Bharani:"गज",Krittika:"मेष",Rohini:"सर्प",Mrigashira:"सर्प",Ardra:"श्वान",Punarvasu:"मार्जार",Pushya:"मेष",Ashlesha:"मार्जार",Magha:"मूषक",["Purva Phalguni"]:"मूषक",["Uttara Phalguni"]:"गो",Hasta:"महिष",Swati:"महिष",Chitra:"व्याघ्र",Vishakha:"व्याघ्र",Anuradha:"मृग",Jyeshtha:"मृग",Mula:"श्वान",["Purva Ashadha"]:"वानर",Shravana:"वानर",Dhanishtha:"सिंह",["Purva Bhadrapada"]:"सिंह",["Uttara Bhadrapada"]:"गो",["Uttara Ashadha"]:"नकुल",Shatabhisha:"अश्व",Revati:"गज"
};
const PAYA_BY_NAK={
  "Ardra":"रजत (चाँदी)","Punarvasu":"रजत (चाँदी)","Pushya":"रजत (चाँदी)","Ashlesha":"रजत (चाँदी)","Magha":"रजत (चाँदी)","Purva Phalguni":"रजत (चाँदी)","Uttara Phalguni":"रजत (चाँदी)","Hasta":"रजत (चाँदी)","Chitra":"रजत (चाँदी)","Swati":"रजत (चाँदी)","Vishakha":"रजत (चाँदी)","Anuradha":"रजत (चाँदी)",
  "Jyeshtha":"ताम्र (ताँबा)","Mula":"ताम्र (ताँबा)","Purva Ashadha":"ताम्र (ताँबा)","Uttara Ashadha":"ताम्र (ताँबा)","Shravana":"ताम्र (ताँबा)","Dhanishtha":"ताम्र (ताँबा)","Shatabhisha":"ताम्र (ताँबा)","Purva Bhadrapada":"ताम्र (ताँबा)","Uttara Bhadrapada":"ताम्र (ताँबा)",
  "Revati":"स्वर्ण (सोना)","Ashwini":"स्वर्ण (सोना)","Bharani":"स्वर्ण (सोना)",
  "Krittika":"लोह (लोहा)","Rohini":"लोह (लोहा)","Mrigashira":"लोह (लोहा)"
};
function weekdayHi(y,m,d){return ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"][new Date(Date.UTC(y,m-1,d)).getUTCDay()]}
function degToDms(x){const a=Math.abs(Number(x)||0),d=Math.floor(a),mf=(a-d)*60,m=Math.floor(mf),s=Math.round((mf-m)*60);return `${String(d).padStart(2,"0")}° ${String(m).padStart(2,"0")}′ ${String(s%60).padStart(2,"0")}″`}
function clockParts(totalMinutes){let t=((Number(totalMinutes)||0)%1440+1440)%1440,h=Math.floor(t/60),m=Math.floor(t%60),s=Math.round((t-Math.floor(t))*60);if(s===60){s=0;m++;}if(m===60){m=0;h=(h+1)%24;}return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
function noaaSunTimes(y,m,d,lat,lon,tz){
  const N=Math.floor((Date.UTC(y,m-1,d)-Date.UTC(y,0,0))/86400000);
  const gamma=2*Math.PI/365*(N-1),eq=229.18*(0.000075+0.001868*Math.cos(gamma)-0.032077*Math.sin(gamma)-0.014615*Math.cos(2*gamma)-0.040849*Math.sin(2*gamma));
  const dec=0.006918-0.399912*Math.cos(gamma)+0.070257*Math.sin(gamma)-0.006758*Math.cos(2*gamma)+0.000907*Math.sin(2*gamma)-0.002697*Math.cos(3*gamma)+0.00148*Math.sin(3*gamma);
  const phi=Number(lat)*Math.PI/180, zen=90.833*Math.PI/180, cosH=(Math.cos(zen)/(Math.cos(phi)*Math.cos(dec))-Math.tan(phi)*Math.tan(dec));
  if(cosH<=-1||cosH>=1)return{sunrise:null,sunset:null,equationOfTime:Math.round(eq*100)/100};
  const H=Math.acos(cosH)*180/Math.PI, solarNoon=720-4*Number(lon)-eq+60*Number(tz||0);
  return{sunrise:clockParts(solarNoon-H*4),sunset:clockParts(solarNoon+H*4),equationOfTime:Math.round(eq*100)/100};
}
function clockToMinutes(s){const a=String(s||"00:00:00").split(":").map(Number);return (a[0]||0)*60+(a[1]||0)+(a[2]||0)/60}
function ishtakal(localTime,sunrise){let diff=clockToMinutes(localTime)-clockToMinutes(sunrise);if(diff<0)diff+=1440;const gh=Math.floor(diff/24),rem=diff-gh*24,vg=Math.floor(rem/0.4),pal=Math.round((rem-vg*0.4)/0.0066666667);return `${String(gh).padStart(3,"0")}-${String(vg).padStart(2,"0")}-${String(pal%60).padStart(2,"0")}`}
function varnaForSign(s){return [1,5,9].includes(s)?"क्षत्रिय":[2,6,10].includes(s)?"वैश्य":[3,7,11].includes(s)?"शूद्र":"ब्राह्मण"}
function vashyaForSign(s){if([1,2,9,10].includes(s))return s===9||s===10?"वनचर/चतुष्पद":"चतुष्पद";if([4,12].includes(s))return"जलचर";if(s===5)return"वनचर";if(s===8)return"कीट";return"मानव"}
function navamshaName(p){return SIGN_HI[p.d9Sign-1]}
function dateDigits(s){return String(s||"").replace(/\D/g,"").split("").reduce((a,b)=>a+Number(b),0)}
function reduceNumber(n){let x=Math.abs(Number(n)||0);while(x>9)x=String(x).split("").reduce((a,b)=>a+Number(b),0);return x||0}
function traditionalLuckyNumbers(birthNumber){const map={1:[1,2,3,9],2:[2,1,5],3:[3,1,2,9],4:[4,1,7],5:[5,1,3,7],6:[6,3,9],7:[7,2,1],8:[8,5,6],9:[9,3,6]};return map[birthNumber]||[]}
function shubhYears(birthNumber){return Array.from({length:6},(_,i)=>birthNumber+9*i).filter(x=>x>=1&&x<=90)}
function monthHi(m){return ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"][m-1]}
function praharFromTime(time){const h=Number(String(time).split(":")[0]||0);return h<6?4:h<12?1:h<18?2:3}
function luckyFromChart(lagna,moonSign,planets){const signs=[lagna,moonSign,planets.Jupiter?.sign,planets.Venus?.sign].filter(Boolean);return{luckySigns:[...new Set(signs)].map(x=>SIGN_HI[x-1]),luckyPlanets:[planets.Jupiter?.sign,planets.Mars?.sign,planets.Moon?.sign].filter(Boolean).map(x=>SIGN_LORD[x-1])}}
const GHATAK_BY_RASHI={
1:{masa:"कार्तिक",tithi:"नन्दा (1, 6, 11)",day:"रविवार",nakshatra:"मघा",yoga:"विष्कम्भ",karana:"बव",prahar:1,moonRashi:"मेष",lagna:"मेष / तुला"},
2:{masa:"मार्गशीर्ष",tithi:"पूर्णा (5, 10, 15)",day:"शनिवार",nakshatra:"हस्त",yoga:"सुकर्मा",karana:"शकुनि",prahar:4,moonRashi:"कन्या",lagna:"वृषभ / वृश्चिक"},
3:{masa:"आषाढ़",tithi:"भद्रा (2, 7, 12)",day:"सोमवार",nakshatra:"स्वाती",yoga:"परिघ",karana:"चतुष्पद",prahar:3,moonRashi:"कुंभ",lagna:"कर्क / मकर"},
4:{masa:"पौष",tithi:"भद्रा (2, 7, 12)",day:"बुधवार",nakshatra:"अनुराधा",yoga:"व्याघात",karana:"नाग",prahar:1,moonRashi:"सिंह",lagna:"तुला / मेष"},
5:{masa:"ज्येष्ठ",tithi:"जया (3, 8, 13)",day:"शनिवार",nakshatra:"मूल",yoga:"धृति",karana:"बव",prahar:1,moonRashi:"मकर",lagna:"मकर / कर्क"},
6:{masa:"भाद्रपद",tithi:"पूर्णा (5, 10, 15)",day:"शनिवार",nakshatra:"श्रवण",yoga:"शुभ",karana:"कौलव",prahar:1,moonRashi:"मिथुन",lagna:"मीन / कन्या"},
7:{masa:"माघ",tithi:"रिक्ता (4, 9, 14)",day:"गुरुवार",nakshatra:"शतभिषा",yoga:"शुक्ल",karana:"तैतिल",prahar:4,moonRashi:"धनु",lagna:"कन्या / मीन"},
8:{masa:"आश्विन",tithi:"नन्दा (1, 6, 11)",day:"शुक्रवार",nakshatra:"रेवती",yoga:"व्यतीपात",karana:"गर",prahar:1,moonRashi:"वृषभ",lagna:"वृश्चिक / वृषभ"},
9:{masa:"श्रावण",tithi:"जया (3, 8, 13)",day:"शुक्रवार",nakshatra:"भरणी",yoga:"वज्र",karana:"तैतिल",prahar:1,moonRashi:"मीन",lagna:"धनु / मिथुन"},
10:{masa:"वैशाख",tithi:"रिक्ता (4, 9, 14)",day:"मंगलवार",nakshatra:"रोहिणी",yoga:"वैधृति",karana:"शकुनि",prahar:4,moonRashi:"सिंह",lagna:"कुंभ / सिंह"},
11:{masa:"चैत्र",tithi:"जया (3, 8, 13)",day:"गुरुवार",nakshatra:"आर्द्रा",yoga:"गण्ड",karana:"वणिज",prahar:3,moonRashi:"धनु",lagna:"मिथुन / धनु"},
12:{masa:"फाल्गुन",tithi:"पूर्णा (5, 10, 15)",day:"शुक्रवार",nakshatra:"आश्लेषा",yoga:"वज्र",karana:"विष्टि",prahar:6,moonRashi:"कुंभ",lagna:"सिंह / कुंभ"}
};
const PLANET_METAL={Sun:"तांबा",Moon:"चाँदी",Mars:"ताँबा",Mercury:"कांसा",Jupiter:"सोना",Venus:"चाँदी",Saturn:"लोहा",Rahu:"लोहा",Ketu:"मिश्र धातु"};
const PLANET_STONE={Sun:"माणिक",Moon:"मोती",Mars:"मूंगा",Mercury:"पन्ना",Jupiter:"पुखराज",Venus:"हीरा",Saturn:"नीलम",Rahu:"गोमेद",Ketu:"लहसुनिया"};
const WEEKDAY_PLANET={"रविवार":"Sun","सोमवार":"Moon","मंगलवार":"Mars","बुधवार":"Mercury","गुरुवार":"Jupiter","शुक्रवार":"Venus","शनिवार":"Saturn"};
function favorableDetails(lagna,moonSign,planets,birthNumber){
  const lagnaLord=SIGN_LORD[lagna-1], fifthLord=lordOf(5,lagna), ninthLord=lordOf(9,lagna), sixthLord=lordOf(6,lagna), eighthLord=lordOf(8,lagna), twelfthLord=lordOf(12,lagna);
  const goodPlanets=[lagnaLord,fifthLord,ninthLord].filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i), evilPlanets=[sixthLord,eighthLord,twelfthLord].filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i);
  const luckyDays=goodPlanets.map(x=>Object.entries(WEEKDAY_PLANET).find(([,p])=>p===x)?.[0]).filter(Boolean);
  const goodSigns=goodPlanets.map(x=>{const i=SIGN_LORD.indexOf(x);return SIGN_HI[i]||null}).filter(Boolean);
  const goodLagnas=[lagna,((lagna+4-1)%12)+1,((lagna+8-1)%12)+1].map(x=>SIGN_HI[x-1]);
  return{luckyNumber:birthNumber,goodNumbers:traditionalLuckyNumbers(birthNumber),evilNumbers:[4,5,8].filter(x=>x!==birthNumber),goodYears:shubhYears(birthNumber),luckyDays:[...new Set(luckyDays)],goodPlanets:[...new Set(goodPlanets)],evilPlanets:[...new Set(evilPlanets)],friendlySigns:[...new Set(goodSigns)],goodLagna:[...new Set(goodLagnas)],luckyMetal:PLANET_METAL[lagnaLord]||"—",luckyStone:PLANET_STONE[lagnaLord]||"—",basis:"लग्न स्वामी, पंचम/नवम स्वामी और जन्मांक पर आधारित पारंपरिक सहायक नियम"};
}
function birthDetails(input,provider,asc,lagna,planets){
  const [y,m,d]=String(input.dob).split("-").map(Number), [hh,mm,ss]=String(input.time||"12:00").split(":").map(Number), tz=Number(input.timezone??input.tzOffset??5.5), lon=Number(input.longitude), lat=Number(input.latitude);
  const moon=planets.Moon, sun=planets.Sun, sunTropical=norm(sun.longitude+Number(provider.ayanamsa||0)), elong=norm(moon.longitude-sun.longitude), tithiNo=Math.floor(elong/12)+1, paksha=tithiNo<=15?"शुक्ल":"कृष्ण", tithiIndex=(tithiNo-1)%15;
  const tithiName=tithiNo===15?(paksha==="शुक्ल"?"पूर्णिमा":"अमावस्या"):TITHI_HI[tithiIndex];
  const yogaNo=Math.floor(norm(moon.longitude+sun.longitude)/(360/27))+1;
  const halfIndex=Math.floor(elong/6); let karana;
  if(halfIndex===0)karana="किंस्तुघ्न"; else if(halfIndex>=57)karana=["शकुनि","चतुष्पद","नाग"][halfIndex-57]; else karana=KARANA_MOVING[(halfIndex-1)%7];
  const n=moon.nakshatra, nadi=NAK_NADI[(n.index-1)%3], gana=NAK_GANA[n.name]||"—", yoni=NAK_YONI[n.name]||"—", paya=PAYA_BY_NAK[n.name]||"—";
  const sunTimes=noaaSunTimes(y,m,d,lat,lon,tz), birthLocal=String(input.time||"12:00")+(String(input.time||"").split(":").length===2?":00":""), lmtCorrection=(lon-(tz*15))*4, lmt=clockParts(clockToMinutes(birthLocal)+lmtCorrection), utc=clockParts(clockToMinutes(birthLocal)-tz*60);
  const jd=Number(provider.julianDay||0), obliquity=23.439291-0.0130042*((jd-2451545)/36525), lifePath=reduceNumber(dateDigits(input.dob)), birthNumber=reduceNumber(d), lucky=traditionalLuckyNumbers(birthNumber), nakSpan=360/27, elapsed=(norm(moon.longitude)%nakSpan)/nakSpan, dashaBalanceYears=YEARS[n.lord]*(1-elapsed), dashaYears=Math.floor(dashaBalanceYears), dashaMonths=Math.floor((dashaBalanceYears-dashaYears)*12), dashaDays=Math.round((((dashaBalanceYears-dashaYears)*12)-dashaMonths)*30.4375), luckySigns=luckyFromChart(lagna,moon.sign,planets);
  const ascLord=SIGN_LORD[lagna-1], rashiLord=SIGN_LORD[moon.sign-1], favorable=favorableDetails(lagna,moon.sign,planets,birthNumber), ghatak=GHATAK_BY_RASHI[moon.sign]||null;
  return {person:{name:input.name||"",gender:input.gender||"",genderHi:{male:"पुरुष",female:"महिला",other:"अन्य"}[String(input.gender||"").toLowerCase()]||input.gender||"—",dob:input.dob,time:birthLocal,weekday:weekdayHi(y,m,d),place:input.place||"",latitude:lat,longitude:lon,timezone:tz},panchangAtBirth:{tithi:{number:tithiNo,name:tithiName,paksha},nakshatra:{name:n.name,nameHi:NAK_HI[n.index-1],pada:n.pada,lord:n.lord},nadi,gana,yoni,paya,varna:varnaForSign(moon.sign),vashya:vashyaForSign(moon.sign),yoga:{number:yogaNo,name:YOGA_HI[yogaNo-1]},karana},birthChart:{lagna:SIGNS[lagna-1],lagnaHi:SIGN_HI[lagna-1],lagnaLord:ascLord,rashi:SIGNS[moon.sign-1],rashiHi:SIGN_HI[moon.sign-1],rashiLord,nakshatra:n.name,nakshatraHi:NAK_HI[n.index-1],pada:n.pada,nakshatraLord:n.lord},dashaBhogya:{lord:n.lord,years:dashaYears,months:dashaMonths,days:dashaDays,totalYears:+dashaBalanceYears.toFixed(6),display:`${dashaYears} वर्ष ${dashaMonths} माह ${dashaDays} दिन`},timeDetails:{ishtakaal:sunTimes.sunrise?ishtakal(birthLocal,sunTimes.sunrise):null,localMeanTime:lmt,timezone:tz,gmtBirthTime:utc,julianDay:+jd.toFixed(5),localMeanTimeCorrection:`${lmtCorrection>=0?"+":""}${lmtCorrection.toFixed(2)} min`,equationOfTime:sunTimes.equationOfTime==null?null:`${sunTimes.equationOfTime.toFixed(2)} min`},astronomy:{ayanamsa:+Number(provider.ayanamsa||0).toFixed(6),ayanamsaName:"लाहिरी (Chitrapaksha)",obliquity:+obliquity.toFixed(6),sunSignHindu:SIGNS[sun.sign-1],sunSignHinduHi:SIGN_HI[sun.sign-1],sunSignWestern:SIGN_EN[Math.floor(sunTropical/30)],sunLongitudeTropical:+sunTropical.toFixed(6),sunrise:sunTimes.sunrise,sunset:sunTimes.sunset,dayDuration:(sunTimes.sunrise&&sunTimes.sunset)?clockParts(clockToMinutes(sunTimes.sunset)-clockToMinutes(sunTimes.sunrise)):null},numerology:{birthNumber,lifePath,luckyNumbers:lucky,unluckyNumbers:[4,8].filter(x=>x!==birthNumber),luckyDays:["गुरुवार","मंगलवार"],luckyYears:shubhYears(birthNumber),luckySigns:luckySigns.luckySigns,luckyPlanets:luckySigns.luckyPlanets,month:monthHi(m),prahar:praharFromTime(birthLocal),note:"पारंपरिक अंक-ज्योतिष आधारित सहायक विवरण; वैज्ञानिक माप नहीं।"},favourablePoints:favorable,ghatak:ghatak,planetSummary:Object.fromEntries(PLANETS.map(p=>[p,{sign:planets[p].signName,signHi:SIGN_HI[planets[p].sign-1],house:planets[p].house,nakshatra:planets[p].nakshatra.name,pada:planets[p].nakshatra.pada,retrograde:planets[p].retrograde}]))};
}
function phalaDesh(data,planets,lagna){
  const moon=planets.Moon, sun=planets.Sun, jup=planets.Jupiter, sat=planets.Saturn, mars=planets.Mars, tenthLord=lordOf(10,lagna), ninthLord=lordOf(9,lagna);
  const items=[];
  items.push(`लग्न ${SIGN_HI[lagna-1]} और लग्न स्वामी ${SIGN_LORD[lagna-1]} के आधार पर यह जन्म-फलादेश तैयार किया गया है।`);
  items.push(`चंद्र राशि ${SIGN_HI[moon.sign-1]} तथा नक्षत्र ${NAK_HI[moon.nakshatra.index-1]} पाद ${moon.nakshatra.pada} मन और व्यवहार से जुड़े पारंपरिक संकेतों के लिए आधार हैं।`);
  if([1,5,9,10].includes(jup.house))items.push(`गुरु ${SIGN_HI[jup.sign-1]} में भाव ${jup.house} में है; पारंपरिक ज्योतिष में शिक्षा, मार्गदर्शन और विस्तार से जुड़े विषयों को महत्व दिया जाता है।`);
  if([1,4,7,10].includes(sat.house))items.push(`शनि भाव ${sat.house} में होने से जिम्मेदारी, अनुशासन और दीर्घकालिक प्रयास पर जोर देने वाला पारंपरिक संकेत माना जाता है।`);
  if(mars.house===10||mars.house===11)items.push(`मंगल भाव ${mars.house} में होने से पहल, प्रतिस्पर्धा और कार्य-ऊर्जा पर जोर देने वाला पारंपरिक संकेत माना जाता है।`);
  items.push(`दशम भाव के स्वामी ${tenthLord} और नवम भाव के स्वामी ${ninthLord} की स्थिति को करियर, धर्म/भाग्य और उपलब्धि के पारंपरिक विश्लेषण में साथ देखा जाता है।`);
  return {summary:items[0],points:items,note:"यह पारंपरिक ज्योतिषीय व्याख्या है; इसे निश्चित या वैज्ञानिक भविष्यवाणी न माना जाए।"};
}

function makeUnsupportedVarga(name){return{supported:false,name,note:'Traditional Parashari/Jaimini rule set for this varga is not enabled yet.'}}
async function calculateKundli(input){const provider=await calculateEphemeris(input),asc=Number(provider.houses.ascendant),lagna=sign(asc),planets={};for(const p of PLANETS){const z=provider.planets[p],s=sign(z.longitude);planets[p]={name:p,longitude:+Number(z.longitude).toFixed(6),latitude:+Number(z.latitude||0).toFixed(6),speed:+Number(z.speed||0).toFixed(8),retrograde:Number(z.speed||0)<0,sign:s,signName:SIGNS[s-1],signEnglish:SIGN_EN[s-1],house:houseFromAsc(asc,z.longitude),nakshatra:nakshatra(z.longitude),d9Sign:navamsaSign(z.longitude)}}const d1=buildD1(asc,planets),d9=buildD9(asc,planets),charts={D1:d1,D9:d9};for(const n of ['D2','D3','D4','D5','D6','D7','D8','D10','D11','D12','D16','D20','D24','D27','D30','D40','D45','D60'])charts[n]=makeUnsupportedVarga(n);const rules=yogaRules(planets,lagna);const details=birthDetails(input,provider,asc,lagna,planets);const phala=phalaDesh(details,planets,lagna);return{input,ayanamsa:'Lahiri',lagna:{longitude:+asc.toFixed(6),sign:lagna,signName:SIGNS[lagna-1],signEnglish:SIGN_EN[lagna-1]},planets,charts,dasha:dashas(provider.planets.Moon.longitude,input),birthDetails:details,phalaDesh:phala,...rules,engine:{name:'Study Mantra Astrology Engine V9',provider:provider.provider|| (provider.fallback?'built-in-sidereal-astronomy':'local-swiss-ephemeris'),productionRequired:false,accuracyNote:'Sidereal Lahiri positions are calculated from the configured local ephemeris provider. The Vercel-safe fallback uses published astronomical orbital-element formulas; a local Swiss Ephemeris bridge can be used for higher-fidelity verification.'}}}
module.exports={calculateKundli,SIGNS,NAK,navamsaSign};
