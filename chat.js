const {authUser,req:sbreq,json}=require("./_lib");
module.exports=async(req,res)=>{
 try{
  const u=await authUser(req);if(!u)return json(res,401,{error:"Login required"});
  if(req.method==="GET"){
   const rows=await sbreq(`/rest/v1/conversations?or=(user_id.eq.${encodeURIComponent(u.id)},astrologer_id.eq.${encodeURIComponent(u.id)})&select=*&order=created_at.desc`);return json(res,200,{conversations:rows});
  }
  if(req.method==="POST"){
   const b=req.body||{};const row={user_id:b.userId||u.id,astrologer_id:b.astrologerId,status:b.status||"requested"};const rows=await sbreq("/rest/v1/conversations",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(row)});return json(res,201,{conversation:rows[0]});
  }
  json(res,405,{error:"Method not allowed"});
 }catch(e){json(res,500,{error:e.message})}
};
