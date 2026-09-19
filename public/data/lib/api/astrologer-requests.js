const {authUser,req:sbreq,json,profile}=require('./_lib');
module.exports=async(req,res)=>{try{
 const u=await authUser(req); if(!u)return json(res,401,{error:'Login required'});
 const p=await profile(u.id); if(p?.role!=='astrologer')return json(res,403,{error:'Astrologer only'});
 if(req.method==='GET'){
  const rows=await sbreq(`/rest/v1/conversations?astrologer_id=eq.${encodeURIComponent(u.id)}&select=*,profiles:user_id(id,full_name,phone)&order=created_at.desc`);
  return json(res,200,{requests:rows});
 }
 if(req.method==='PATCH'){
  const b=req.body||{}, id=String(b.conversationId||'');
  if(!id || !['accepted','rejected','closed'].includes(b.status))return json(res,400,{error:'conversationId and valid status required'});
  const check=await sbreq(`/rest/v1/conversations?id=eq.${encodeURIComponent(id)}&astrologer_id=eq.${encodeURIComponent(u.id)}&select=*`);
  if(!check[0])return json(res,404,{error:'Conversation not found'});
  const patch={status:b.status}; if(b.status==='closed')patch.closed_at=new Date().toISOString();
  const rows=await sbreq(`/rest/v1/conversations?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});
  return json(res,200,{conversation:rows[0]||null});
 }
 return json(res,405,{error:'Method not allowed'});
}catch(e){return json(res,500,{error:e.message})}};
