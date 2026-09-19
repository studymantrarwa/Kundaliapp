const {req:sbreq,json}=require("./_lib");
module.exports=async(req,res)=>{try{const rows=await sbreq("/rest/v1/astrologers?verified=eq.true&select=*&order=experience_years.desc");json(res,200,{astrologers:rows})}catch(e){json(res,500,{error:e.message})}};
