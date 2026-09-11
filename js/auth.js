(function (g) {
  const cfg = g.ETHAN_CONFIG || {};
  const configured = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && g.supabase?.createClient);
  const client = configured ? g.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}) : null;
  let session = null;
  let readyResolve; const ready = new Promise(r=>readyResolve=r);
  function applyUser(user){
    if(!user) return;
    StorageService.update(s=>{s.profile.name=user.user_metadata?.display_name || user.email?.split('@')[0] || 'Learner';s.profile.email=user.email||'';s.profile.userId=user.id;s.profile.local=false;});
  }
  async function init(){
    if(!client){readyResolve();return;}
    try{const {data}=await client.auth.getSession();session=data.session||null;if(session)applyUser(session.user);}catch(e){console.warn('Auth init failed',e);}finally{readyResolve();}
    client.auth.onAuthStateChange((_event,newSession)=>{session=newSession||null;if(session){applyUser(session.user);g.CloudSyncService?.syncNow?.();}else StorageService.update(s=>{s.profile.local=true;delete s.profile.userId;delete s.profile.email;});});
  }
  g.AuthService={
    configured, client, ready, current(){return StorageService.get().profile;}, getSession(){return session;},
    async token(){await ready;return session?.access_token||null;},
    async signIn(email,password){if(!client)throw new Error('Cloud accounts are not configured yet.');const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;session=data.session;applyUser(data.user);return data;},
    async signUp(name,email,password){if(!client)throw new Error('Cloud accounts are not configured yet.');const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name:name}}});if(error)throw error;if(data.user)applyUser(data.user);return data;},
    async forgot(email){if(!client)throw new Error('Cloud accounts are not configured yet.');const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/#/account'});if(error)throw error;},
    async signOut(){if(client)await client.auth.signOut();session=null;StorageService.update(s=>{s.profile={name:'Guest',role:'learner',learnerType:s.profile.learnerType,interests:s.profile.interests,level:s.profile.level,goal:s.profile.goal,local:true};});},
    signInLocal(name,role){StorageService.update(s=>{s.profile.name=name||'Local learner';s.profile.role=role||'learner';s.profile.local=true;});},
    isTeacher(){return this.current().role==='teacher'||this.current().role==='admin';}
  };
  init();
})(window);
