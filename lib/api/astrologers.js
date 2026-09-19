const {req:sbreq,json}=require('./_lib');
module.exports=async(req,res)=>{try{
 const rows=await sbreq('/rest/v1/astrologers?verified=eq.true&select=*,profile:profiles!astrologers_id_fkey(id,full_name,email,phone)&order=experience_years.desc');
 json(res,200,{astrologers:rows.map(a=>({...a,name:a.profile?.full_name||'Astrologer',email:a.profile?.email||'',phone:a.profile?.phone||''}))});
}catch(e){json(res,500,{error:e.message})}};
