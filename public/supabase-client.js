window.SM_SUPABASE = {
  client: null,
  async init(){
    if(this.client) return this.client;
    const cfg = await fetch("/api/config").then(r=>r.json());
    if(!cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;
    if(!window.supabase) return null;
    this.client = window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    this.client.auth.onAuthStateChange((_event,session)=>{
      try{
        if(session?.access_token) localStorage.setItem("studyMantraToken",session.access_token);
        else localStorage.removeItem("studyMantraToken");
      }catch(e){}
    });
    return this.client;
  }
};
