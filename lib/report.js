function buildReport(k){
  const p=k.planets;
  return {
    title:"Study Mantra Kundli Report",
    summary:{
      lagna:k.lagna.signName,
      moonSign:p.Moon.signName,
      sunSign:p.Sun.signName,
      moonNakshatra:p.Moon.nakshatra.name,
      moonPada:p.Moon.nakshatra.pada
    },
    sections:[
      {id:"personality",title:"Lagna & Personality",status:"calculation-backed interpretation layer"},
      {id:"education",title:"Education",status:"rule engine extension point"},
      {id:"career",title:"Career",status:"rule engine extension point"},
      {id:"finance",title:"Finance",status:"rule engine extension point"},
      {id:"marriage",title:"Marriage & Relationships",status:"rule engine extension point"},
      {id:"family",title:"Family & Children",status:"rule engine extension point"},
      {id:"travel",title:"Travel / Foreign",status:"rule engine extension point"},
      {id:"yoga",title:"Shubh Yog",items:k.yogas},
      {id:"dosha",title:"Ashubh Yog / Dosha",items:k.doshas}
    ],
    disclaimer:"Astrological interpretations are traditional/entertainment-oriented and should not be treated as medical, legal, financial or other professional advice."
  };
}
module.exports={buildReport};
