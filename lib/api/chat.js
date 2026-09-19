const {authUser,req:sbreq,json}=require('./_lib');
module.exports=async(req,res)=>{try{
 const u=await authUser(req); if(!u)return json(res,401,{error:'Login required'});
 if(req.method==='GET'){
  const id=String(req.query?.conversation_id||req.query?.id||'');
  if(id){
   const c=await sbreq(`/rest/v1/conversations?id=eq.${encodeURIComponent(id)}&select=*`);
   if(!c[0]||![c[0].user_id,c[0].astrologer_id].includes(u.id))return json(res,403,{error:'Forbidden'});
   const messages=await sbreq(`/rest/v1/messages?conversation_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.asc`);
   return json(res,200,{conversation:c[0],messages});
  }
  const rows=await sbreq(`/rest/v1/conversations?or=(user_id.eq.${encodeURIComponent(u.id)},astrologer_id.eq.${encodeURIComponent(u.id)})&select=*&order=created_at.desc`);
  return json(res,200,{conversations:rows});
 }
 if(req.method==='POST'){
  const b=req.body||{};
  const astrologerId=b.astrologerId||b.astrologer_id;
  if(astrologerId){
   const existing=await sbreq(`/rest/v1/conversations?user_id=eq.${encodeURIComponent(u.id)}&astrologer_id=eq.${encodeURIComponent(astrologerId)}&status=in.(requested,accepted)&select=*`);
   if(existing[0])return json(res,200,{conversation:existing[0],existing:true});
   const rows=await sbreq('/rest/v1/conversations',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:u.id,astrologer_id:astrologerId,status:'requested'})});
   return json(res,201,{conversation:rows[0]});
  }
  const id=b.conversationId||b.conversation_id;
  if(id && b.status){
   const c=await sbreq(`/rest/v1/conversations?id=eq.${encodeURIComponent(id)}&select=*`);
   if(!c[0]||![c[0].user_id,c[0].astrologer_id].includes(u.id))return json(res,403,{error:'Forbidden'});
   const patch={status:b.status}; if(b.status==='closed')patch.closed_at=new Date().toISOString();
   const rows=await sbreq(`/rest/v1/conversations?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});
   return json(res,200,{conversation:rows[0]});
  }
  return json(res,400,{error:'astrologerId required'});
 }
 return json(res,405,{error:'Method not allowed'});
}catch(e){return json(res,500,{error:e.message})}};
