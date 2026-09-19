const {authUser,req:sbreq,json,profile}=require('./_lib');
module.exports=async(req,res)=>{try{
 const u=await authUser(req); if(!u)return json(res,401,{error:'Login required'});
 const p=await profile(u.id); if(p?.role!=='astrologer')return json(res,403,{error:'Astrologer only'});
 const rows=await sbreq(`/rest/v1/conversations?astrologer_id=eq.${encodeURIComponent(u.id)}&status=in.(accepted,closed)&select=user_id,users:profiles!conversations_user_id_fkey(id,full_name,phone)`);
 const ids=[...new Set(rows.map(x=>x.user_id).filter(Boolean))];
 if(!ids.length)return json(res,200,{users:[]});
 const users=await sbreq(`/rest/v1/profiles?id=in.(${ids.join(',')})&select=id,full_name,phone,created_at`);
 return json(res,200,{users});
}catch(e){return json(res,500,{error:e.message})}};
