const {authUser,req:sbreq,json,profile}=require('./_lib');
const enc=v=>encodeURIComponent(String(v));
module.exports=async(req,res)=>{try{
 const u=await authUser(req); if(!u)return json(res,401,{error:'Login required'});
 const p=await profile(u.id); if(p?.role!=='admin')return json(res,403,{error:'Admin only'});
 if(req.method==='GET'){
  const rows=await sbreq('/rest/v1/astrologer_applications?select=*,profile:profiles!astrologer_applications_user_id_fkey(id,full_name,email,phone,role)&order=created_at.desc');
  return json(res,200,{applications:rows});
 }
 if(req.method==='POST'||req.method==='PATCH'){
  const b=req.body||{}; const userId=String(b.user_id||b.userId||'').trim();
  if(!userId)return json(res,400,{error:'user_id required'});
  const status=String(b.status||'').trim();
  if(!['approved','rejected'].includes(status))return json(res,400,{error:'status must be approved or rejected'});
  const apps=await sbreq(`/rest/v1/astrologer_applications?user_id=eq.${enc(userId)}&select=*`); const a=apps[0];
  if(!a)return json(res,404,{error:'Application not found'});
  if(status==='approved'){
   const astro=await sbreq('/rest/v1/astrologers',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({id:userId,bio:String(a.bio||''),experience_years:Math.max(0,Number(a.experience_years)||0),expertise:Array.isArray(a.expertise)?a.expertise:[],languages:Array.isArray(a.languages)?a.languages:[],fee:Math.max(0,Number(a.requested_fee)||0),discount:0,online:false,verified:true,approved_at:new Date().toISOString()})});
   if(!astro?.[0])throw new Error('Astrologer profile could not be created');
   const prof=await sbreq(`/rest/v1/profiles?id=eq.${enc(userId)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({role:'astrologer',updated_at:new Date().toISOString()})});
   if(!prof?.[0])throw new Error('User profile/role could not be updated');
  }
  const rows=await sbreq(`/rest/v1/astrologer_applications?id=eq.${enc(a.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status,admin_note:String(b.admin_note||''),updated_at:new Date().toISOString()})});
  if(!rows?.[0])throw new Error('Application status could not be updated');
  return json(res,200,{ok:true,application:rows[0],message:status==='approved'?'Astrologer approved successfully':'Application rejected'});
 }
 return json(res,405,{error:'Method not allowed'});
}catch(e){return json(res,500,{error:e.message})}};
