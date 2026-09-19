const {authUser,req:sbreq,json,profile}=require('./_lib');

async function guard(req,res){
  const u=await authUser(req); if(!u){json(res,401,{error:'Login required'});return null;}
  const p=await profile(u.id); if(p?.role!=='admin'){json(res,403,{error:'Admin only'});return null;}
  return u;
}
const esc=v=>encodeURIComponent(String(v));

module.exports=async(req,res)=>{try{
  const u=await guard(req,res); if(!u)return;
  const action=String(req.query?.action||'overview');

  if(req.method==='GET' && action==='overview'){
    const [profiles,apps,astros,convs,reviews,kundalis]=await Promise.all([
      sbreq('/rest/v1/profiles?select=id,role,created_at&limit=5000'),
      sbreq('/rest/v1/astrologer_applications?select=id,status,created_at&limit=5000'),
      sbreq('/rest/v1/astrologers?select=id,verified,online,fee,discount&limit=5000'),
      sbreq('/rest/v1/conversations?select=id,status,created_at&limit=5000'),
      sbreq('/rest/v1/reviews?select=id,rating,moderation_status,created_at&limit=5000'),
      sbreq('/rest/v1/kundalis?select=id,created_at&limit=5000')
    ]);
    return json(res,200,{stats:{users:profiles.filter(x=>x.role==='user').length,astrologers:profiles.filter(x=>x.role==='astrologer').length,admins:profiles.filter(x=>x.role==='admin').length,pendingApplications:apps.filter(x=>x.status==='pending').length,approvedAstrologers:astros.filter(x=>x.verified).length,onlineAstrologers:astros.filter(x=>x.online).length,activeChats:convs.filter(x=>x.status==='accepted').length,totalChats:convs.length,totalReviews:reviews.length,pendingReviews:reviews.filter(x=>x.moderation_status==='pending').length,totalKundalis:kundalis.length}});
  }

  if(req.method==='GET' && action==='users'){
    const q=String(req.query?.q||'').trim();
    let path='/rest/v1/profiles?select=id,full_name,email,phone,role,created_at,updated_at&order=created_at.desc&limit=500';
    if(q) path += `&or=(full_name.ilike.*${esc(q)}*,email.ilike.*${esc(q)}*,phone.ilike.*${esc(q)}*)`;
    const rows=await sbreq(path); return json(res,200,{users:rows});
  }

  if(req.method==='GET' && action==='applications'){
    const rows=await sbreq('/rest/v1/astrologer_applications?select=*,profile:profiles!astrologer_applications_user_id_fkey(id,full_name,email,phone,role)&order=created_at.desc&limit=500');
    return json(res,200,{applications:rows});
  }

  if(req.method==='GET' && action==='astrologers'){
    const rows=await sbreq('/rest/v1/astrologers?select=*,profile:profiles!astrologers_id_fkey(id,full_name,email,phone,role)&order=verified.asc,created_at.desc&limit=500');
    return json(res,200,{astrologers:rows});
  }

  if(req.method==='GET' && action==='conversations'){
    const rows=await sbreq('/rest/v1/conversations?select=*,user:profiles!conversations_user_id_fkey(id,full_name,email),astrologer:profiles!conversations_astrologer_id_fkey(id,full_name,email)&order=created_at.desc&limit=500');
    return json(res,200,{conversations:rows});
  }

  if(req.method==='GET' && action==='reviews'){
    const rows=await sbreq('/rest/v1/reviews?select=*,user:profiles!reviews_user_id_fkey(id,full_name,email),astrologer:profiles!reviews_astrologer_id_fkey(id,full_name,email)&order=created_at.desc&limit=500');
    return json(res,200,{reviews:rows});
  }

  if(req.method==='GET' && action==='audit'){
    const rows=await sbreq('/rest/v1/admin_audit_logs?select=*,admin:profiles!admin_audit_logs_admin_id_fkey(full_name,email)&order=created_at.desc&limit=200');
    return json(res,200,{logs:rows});
  }

  if(req.method==='GET' && action==='messages'){
    const id=String(req.query?.conversation_id||''); if(!id)return json(res,400,{error:'conversation_id required'});
    const rows=await sbreq(`/rest/v1/messages?conversation_id=eq.${esc(id)}&select=*,sender:profiles!messages_sender_id_fkey(full_name,role)&order=created_at.asc&limit=1000`);
    return json(res,200,{messages:rows});
  }

  if(req.method==='PATCH'){
    const b=req.body||{};
    if(action==='user'){
      const id=String(b.user_id||''); if(!id)return json(res,400,{error:'user_id required'});
      const patch={};
      if(['user','astrologer','admin'].includes(b.role)) patch.role=b.role;
      if('full_name' in b) patch.full_name=String(b.full_name||'');
      if('phone' in b) patch.phone=String(b.phone||'');
      if(!Object.keys(patch).length)return json(res,400,{error:'Nothing to update'});
      const rows=await sbreq(`/rest/v1/profiles?id=eq.${esc(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({...patch,updated_at:new Date().toISOString()})});
      await audit(u.id,'user_update',{user_id:id,changes:patch}); return json(res,200,{user:rows[0]||null});
    }
    if(action==='astrologer'){
      const id=String(b.astrologer_id||''); if(!id)return json(res,400,{error:'astrologer_id required'});
      const patch={};
      for(const k of ['bio','experience_years','expertise','languages','online','verified']) if(k in b) patch[k]=b[k];
      if('fee' in b)patch.fee=Math.max(0,Number(b.fee)||0);
      if('discount' in b)patch.discount=Math.min(100,Math.max(0,Number(b.discount)||0));
      if(b.verified===true)patch.approved_at=new Date().toISOString();
      const rows=await sbreq(`/rest/v1/astrologers?id=eq.${esc(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});
      await audit(u.id,'astrologer_update',{astrologer_id:id,changes:patch}); return json(res,200,{astrologer:rows[0]||null});
    }
    if(action==='review'){
      const id=String(b.review_id||''); if(!id)return json(res,400,{error:'review_id required'});
      const status=['pending','approved','hidden','flagged'].includes(b.moderation_status)?b.moderation_status:'pending';
      const rows=await sbreq(`/rest/v1/reviews?id=eq.${esc(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({moderation_status:status,admin_note:String(b.admin_note||'')})});
      await audit(u.id,'review_moderation',{review_id:id,status}); return json(res,200,{review:rows[0]||null});
    }
    if(action==='application'){
      const userId=String(b.user_id||'').trim();
      if(!userId)return json(res,400,{error:'user_id required'});
      const status=String(b.status||'').trim();
      if(!['approved','rejected'].includes(status))return json(res,400,{error:'status must be approved or rejected'});

      const apps=await sbreq(`/rest/v1/astrologer_applications?user_id=eq.${esc(userId)}&select=*`);
      const a=apps[0];
      if(!a)return json(res,404,{error:'Application not found'});

      if(status==='approved'){
        // 1) Create/update the astrologer profile first. The service-role request
        // bypasses RLS, so approval does not depend on browser policies.
        const astroPayload={
          id:userId,
          bio:String(a.bio||''),
          experience_years:Math.max(0,Number(a.experience_years)||0),
          expertise:Array.isArray(a.expertise)?a.expertise:[],
          languages:Array.isArray(a.languages)?a.languages:[],
          fee:Math.max(0,Number(a.requested_fee)||0),
          discount:0,
          online:false,
          verified:true,
          approved_at:new Date().toISOString()
        };
        const astroRows=await sbreq('/rest/v1/astrologers',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(astroPayload)});
        if(!Array.isArray(astroRows)||!astroRows[0]) throw new Error('Astrologer profile could not be created');

        // 2) Change the account role only after the astrologer row exists.
        const profileRows=await sbreq(`/rest/v1/profiles?id=eq.${esc(userId)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({role:'astrologer',updated_at:new Date().toISOString()})});
        if(!Array.isArray(profileRows)||!profileRows[0]) throw new Error('User profile/role could not be updated');

        // 3) Mark the application approved only after both records are confirmed.
        const rows=await sbreq(`/rest/v1/astrologer_applications?id=eq.${esc(a.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:'approved',admin_note:String(b.admin_note||''),updated_at:new Date().toISOString()})});
        if(!Array.isArray(rows)||!rows[0]||rows[0].status!=='approved') throw new Error('Application status could not be updated');

        await audit(u.id,'application_approved',{application_id:a.id,user_id:userId});
        return json(res,200,{ok:true,application:rows[0],message:'Astrologer approved successfully'});
      }

      const rows=await sbreq(`/rest/v1/astrologer_applications?id=eq.${esc(a.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:'rejected',admin_note:String(b.admin_note||''),updated_at:new Date().toISOString()})});
      await audit(u.id,'application_rejected',{application_id:a.id,user_id:userId});
      return json(res,200,{ok:true,application:rows[0]||null,message:'Application rejected'});
    }
    if(action==='conversation'){
      const id=String(b.conversation_id||''); if(!id)return json(res,400,{error:'conversation_id required'});
      const status=['requested','accepted','rejected','closed'].includes(b.status)?b.status:null; if(!status)return json(res,400,{error:'Invalid status'});
      const patch={status}; if(status==='closed')patch.closed_at=new Date().toISOString();
      const rows=await sbreq(`/rest/v1/conversations?id=eq.${esc(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});
      await audit(u.id,'conversation_update',{conversation_id:id,status}); return json(res,200,{conversation:rows[0]||null});
    }
  }
  return json(res,405,{error:'Method not allowed'});
}catch(e){return json(res,500,{error:e.message})}};

async function audit(adminId,action,details){
  try{await sbreq('/rest/v1/admin_audit_logs',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({admin_id:adminId,action,details})});}catch(_e){}
}
