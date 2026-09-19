const {authUser,req:sbreq,json,profile}=require("./_lib");
module.exports=async(req,res)=>{try{
 const u=await authUser(req);if(!u)return json(res,401,{error:"Login required"});const p=await profile(u.id);if(p?.role!=="admin")return json(res,403,{error:"Admin only"});
 const b=req.body||{},patch={};for(const k of ["fee","discount","verified","online"])if(k in b)patch[k]=k==="fee"||k==="discount"?Number(b[k]):!!b[k];
 await sbreq(`/rest/v1/astrologers?id=eq.${encodeURIComponent(b.id)}`,{method:"PATCH",headers:{"Prefer":"return=representation"},body:JSON.stringify(patch)});json(res,200,{ok:true})
}catch(e){json(res,500,{error:e.message})}};
