const {authUser,req:sbreq,json}=require("./_lib");
module.exports=async(req,res)=>{
 try{
  const u=await authUser(req);if(!u)return json(res,401,{error:"Login required"});
  if(req.method==="GET"){const id=req.query.conversation_id;if(!id)return json(res,400,{error:"conversation_id required"});const c=await sbreq(`/rest/v1/conversations?id=eq.${encodeURIComponent(id)}&select=*`);if(!c[0]||![c[0].user_id,c[0].astrologer_id].includes(u.id))return json(res,403,{error:"Forbidden"});const rows=await sbreq(`/rest/v1/messages?conversation_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.asc`);return json(res,200,{messages:rows})}
  if(req.method==="POST"){const b=req.body||{},c=await sbreq(`/rest/v1/conversations?id=eq.${encodeURIComponent(b.conversationId)}&select=*`);if(!c[0]||![c[0].user_id,c[0].astrologer_id].includes(u.id))return json(res,403,{error:"Forbidden"});const rows=await sbreq("/rest/v1/messages",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify({conversation_id:b.conversationId,sender_id:u.id,body:String(b.body||""),kundali_id:b.kundaliId||null})});return json(res,201,{message:rows[0]})}
  json(res,405,{error:"Method not allowed"})
 }catch(e){json(res,500,{error:e.message})}
};
