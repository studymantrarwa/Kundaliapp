// Study Mantra Numerology Engine — traditional helper, not scientific prediction.
const PYTH={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const CHAL={A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7};
const VOWELS=new Set(["A","E","I","O","U"]);
function reduceNum(n, keepMaster=true){let x=Math.abs(Number(n)||0); if(x===0)return 0; while(x>9 && !(keepMaster&&[11,22,33].includes(x))) x=String(x).split("").reduce((a,b)=>a+Number(b),0); return x;}
function cleanName(name){return String(name||"").toUpperCase().replace(/[^A-Z]/g,"");}
function digitSum(s){return String(s||"").replace(/\D/g,"").split("").reduce((a,b)=>a+Number(b),0);}
const MEANINGS={
  1:{hi:"नेतृत्व, स्वतंत्रता और पहल",text:"स्वतंत्र निर्णय, शुरुआत और नेतृत्व की प्रवृत्ति से जोड़ा जाता है।"},
  2:{hi:"सहयोग, संवेदनशीलता और संतुलन",text:"साझेदारी, कूटनीति और भावनात्मक संतुलन से जोड़ा जाता है।"},
  3:{hi:"रचनात्मकता, अभिव्यक्ति और सीखना",text:"अभिव्यक्ति, कला, संचार और सामाजिकता से जोड़ा जाता है।"},
  4:{hi:"व्यवस्था, अनुशासन और व्यावहारिकता",text:"मेहनत, संरचना, नियम और स्थिर प्रगति से जोड़ा जाता है।"},
  5:{hi:"परिवर्तन, स्वतंत्रता और संचार",text:"गतिशीलता, विविध अनुभव और संचार से जोड़ा जाता है।"},
  6:{hi:"जिम्मेदारी, परिवार और सौंदर्य",text:"परिवार, देखभाल, जिम्मेदारी और सामंजस्य से जोड़ा जाता है।"},
  7:{hi:"अनुसंधान, अंतर्दृष्टि और आत्मचिंतन",text:"अध्ययन, विश्लेषण, आध्यात्मिक खोज और निजी चिंतन से जोड़ा जाता है।"},
  8:{hi:"प्रबंधन, महत्वाकांक्षा और परिणाम",text:"संगठन, प्रबंधन, उपलब्धि और भौतिक जिम्मेदारियों से जोड़ा जाता है।"},
  9:{hi:"मानवता, आदर्श और व्यापक दृष्टि",text:"सेवा, आदर्शवाद, करुणा और व्यापक दृष्टिकोण से जोड़ा जाता है।"},
  11:{hi:"अंतर्ज्ञान और प्रेरणा",text:"अंक-ज्योतिष में 11 को मास्टर नंबर माना जाता है; इसे अंतर्ज्ञान और प्रेरणा से जोड़ा जाता है।"},
  22:{hi:"बड़े निर्माण और व्यावहारिक दृष्टि",text:"22 को मास्टर नंबर माना जाता है; इसे बड़े लक्ष्यों को संरचना देने से जोड़ा जाता है।"},
  33:{hi:"सेवा, करुणा और मार्गदर्शन",text:"33 को मास्टर नंबर माना जाता है; इसे सेवा और मार्गदर्शन से जोड़ा जाता है।"}
};
function numberMeaning(n){return MEANINGS[n]||MEANINGS[reduceNum(n,false)]||{hi:"सामान्य अंक प्रभाव",text:"पारंपरिक अंक-ज्योतिष व्याख्या।"};}
function numerology(x={}){
  const name=String(x.name||""), clean=cleanName(name), dob=String(x.dob||""), digits=String(dob).replace(/\D/g,"");
  const parts=dob.split("-").map(Number); const day=Number.isFinite(parts[2])?parts[2]:0, month=Number.isFinite(parts[1])?parts[1]:0, year=Number.isFinite(parts[0])?parts[0]:0;
  const birthNumber=reduceNum(day,false), lifePath=reduceNum(digitSum(digits),true), attitude=reduceNum(day+month,true);
  const pTotal=[...clean].reduce((a,c)=>a+(PYTH[c]||0),0), cTotal=[...clean].reduce((a,c)=>a+(CHAL[c]||0),0);
  const pVowels=[...clean].filter(c=>VOWELS.has(c)).reduce((a,c)=>a+(PYTH[c]||0),0), pCons=[...clean].filter(c=>!VOWELS.has(c)).reduce((a,c)=>a+(PYTH[c]||0),0);
  const currentYear=Number(x.year)||new Date().getFullYear(), personalYear=reduceNum(day+month+digitSum(currentYear),true), personalMonth=reduceNum(personalYear+month,true), personalDay=reduceNum(personalMonth+day,true);
  const maturity=clean?reduceNum(lifePath+reduceNum(pTotal,true),true):null;
  const luckyMap={1:[1,2,3,9],2:[1,2,5],3:[1,2,3,9],4:[1,4,7],5:[1,3,5,7],6:[3,6,9],7:[1,2,7],8:[5,6,8],9:[3,6,9],11:[2,11],22:[4,22],33:[3,6,9]};
  const luckyNumbers=luckyMap[birthNumber]||luckyMap[reduceNum(birthNumber,false)]||[];
  const unlucky=[4,8].filter(n=>n!==reduceNum(birthNumber,false));
  return {
    name,dob,enteredName:name,cleanName,
    birthNumber,lifePath,attitudeNumber:attitude,
    nameNumberPythagorean:clean?reduceNum(pTotal,true):null,nameNumberChaldean:clean?reduceNum(cTotal,true):null,
    soulNumber:clean?reduceNum(pVowels,true):null,personalityNumber:clean?reduceNum(pCons,true):null,
    maturityNumber:maturity,
    personalYear,personalMonth,personalDay,yearUsed:currentYear,
    compound:{day:day||null,lifePathTotal:digitSum(digits)||null,pythagoreanNameTotal:clean?pTotal:null,chaldeanNameTotal:clean?cTotal:null},
    luckyNumbers,unluckyNumbers:unlucky,
    meanings:{birthNumber:numberMeaning(birthNumber),lifePath:numberMeaning(lifePath),nameNumber:clean?numberMeaning(reduceNum(cTotal,true)):null,personalYear:numberMeaning(personalYear)},
    system:{dateNumbers:"जन्मांक/भाग्यांक: जन्मतिथि के अंकों का योग",nameNumber:"नामांक: Chaldean + Pythagorean दोनों संदर्भ",masterNumbers:"11, 22, 33 को जहाँ लागू हो संरक्षित किया गया है"},
    note:"पारंपरिक अंक-ज्योतिष आधारित सहायक विवरण; यह वैज्ञानिक माप या निश्चित भविष्यवाणी नहीं है। नामांक के लिए Latin/English spelling का उपयोग किया गया है।"
  };
}
const signs=["Mesha (Aries)","Vrishabha (Taurus)","Mithuna (Gemini)","Karka (Cancer)","Simha (Leo)","Kanya (Virgo)","Tula (Libra)","Vrishchika (Scorpio)","Dhanu (Sagittarius)","Makara (Capricorn)","Kumbha (Aquarius)","Meena (Pisces)"];
const texts=["Focus on one priority and finish it.","Review details before making commitments.","A clear routine can improve productivity.","Keep communication direct and respectful.","Creative work benefits from a simple plan.","Organize pending tasks before adding new ones.","Collaboration may help if expectations are clear.","Take a measured approach to finances.","Learning plans benefit from careful scheduling.","Steady progress is preferable to rushing.","Ideas and networking may support learning.","Use reflection to prepare the next step."];
function horoscope(sign=1,date){sign=Math.max(1,Math.min(12,+sign||1));let n=(new Date(date||Date.now()).getUTCDate()+sign)%texts.length;return {date:date||new Date().toISOString().slice(0,10),sign,signName:signs[sign-1],text:texts[n],career:"Plan tasks clearly.",finance:"Review spending.",relationships:"Communicate respectfully.",health:"Maintain regular sleep, food and movement.",note:"Traditional daily horoscope; not a factual prediction."}}
function panchang(x={}){let date=x.date||new Date().toISOString().slice(0,10),d=new Date(date+"T00:00:00Z"),day=d.getUTCDay(),i=(d.getUTCDate()+d.getUTCMonth()+d.getUTCFullYear())%30;return {date,vara:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day],tithi:["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima"][i%15],nakshatra:["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Shravana","Dhanishtha","Shatabhisha","Revati"][i%21],yoga:["Vishkumbha","Preeti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti"][i%8],karana:["Bava","Balava","Kaulava","Taitila","Garaja","Vanija","Vishti"][i%7],sunrise:"06:00 local framework",sunset:"18:00 local framework",note:"Exact Panchang times require the production Swiss Ephemeris plus timezone/location dataset."}}
function matching(a={},b={}){let A=numerology(a),B=numerology(b);return {ashtakoota:{varna:null,vashya:null,tara:null,yoni:null,grahaMaitri:null,bhakoot:null,nadi:null,total:null,max:36},personA:A,personB:B,note:"Full Ashtakoota requires Moon Nakshatra/Pada from exact birth calculations; no compatibility points are fabricated."}}
module.exports={numerology,horoscope,panchang,matching};
