window.SM_SUPABASE = {
  client: null,
  async init(){
    if(this.client) return this.client;
    const cfg = await fetch("/api/config").then(r=>r.json());
    if(!cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;
    if(!window.supabase) return null;
    this.client = window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    return this.client;
  }
};
