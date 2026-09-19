// Ashtakoota contract. Detailed scoring rules are intentionally isolated so they
// can be validated independently against the selected Jyotisha tradition.
const KUTAS=["Varna","Vashya","Tara","Yoni","Graha Maitri","Gana","Bhakoot","Nadi"];
function match(a,b){
  return {method:"Ashtakoota",maxScore:36,score:null,items:KUTAS.map(name=>({name,score:null,max:null,status:"Needs validated rule tables"})),inputs:{a,b}};
}
module.exports={match};
