(function(g){
"use strict";
const cfg=g.ETHAN_CONFIG||{};
let client=null,session=null,initialised=false;
let readyResolve;const ready=new Promise(r=>readyResolve=r);

function profilePatch(user){
  if(!user)return;
  const md=user.user_metadata||{};
  StorageService.update(s=>{
    s.profile=s.profile||{};
    s.profile.name=md.display_name||s.profile.name||user.email?.split("@")[0]||"Learner";
    s.profile.email=user.email||"";
    s.profile.userId=user.id;
    s.profile.local=false;
    if(md.learner_type)s.profile.learnerType=md.learner_type;
    if(md.level)s.profile.level=md.level;
    if(md.goal)s.profile.goal=md.goal;
  });
}
async function ensureClient(){
  if(client)return client;
  if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)return null;
  const ok=await cfg.loadSupabase?.();
  if(!ok||!g.supabase?.createClient)return null;
  client=g.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}
  });
  return client;
}
async function upsertProfile(user,meta={}){
  const db=await ensureClient();if(!db||!user)return;
  const payload={
    id:user.id,
    email:user.email||null,
    display_name:meta.display_name||user.user_metadata?.display_name||user.email?.split("@")[0]||"Learner",
    learner_type:meta.learner_type||user.user_metadata?.learner_type||null,
    level:meta.level||user.user_metadata?.level||null,
    goal:meta.goal||user.user_metadata?.goal||null,
    updated_at:new Date().toISOString()
  };
  const {error}=await db.from("profiles").upsert(payload,{onConflict:"id"});
  if(error)console.warn("Profile sync unavailable",error.message);
}
async function init(){
  try{
    const db=await ensureClient();
    if(!db){initialised=true;readyResolve();return;}
    const {data,error}=await db.auth.getSession();
    if(error)console.warn("Session restore warning",error.message);
    session=data?.session||null;
    if(session){profilePatch(session.user);await upsertProfile(session.user);}
    db.auth.onAuthStateChange(async(event,newSession)=>{
      session=newSession||null;
      if(session){
        profilePatch(session.user);
        if(event==="SIGNED_IN"||event==="USER_UPDATED")await upsertProfile(session.user);
        g.CloudSyncService?.syncNow?.();
      }else if(event==="SIGNED_OUT"){
        StorageService.update(s=>{
          s.profile={name:"Guest",role:"learner",learnerType:s.profile?.learnerType||"Lifelong Learner",interests:s.profile?.interests||[],level:s.profile?.level||"Beginner",goal:s.profile?.goal||"Personal development",local:true};
        });
      }
      try{g.dispatchEvent(new CustomEvent("ethan:auth-change",{detail:{event,session}}))}catch(e){}
    });
  }catch(e){console.warn("Auth init failed",e);}
  finally{initialised=true;readyResolve();}
}
const AuthService={
  get configured(){return !!(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY)},
  get client(){return client},
  ready,
  async ensureClient(){return ensureClient()},
  current(){return StorageService.get().profile},
  getSession(){return session},
  async token(){await ready;return session?.access_token||null},
  async signIn(email,password){
    const db=await ensureClient();if(!db)throw new Error("Unable to connect to account service.");
    const {data,error}=await db.auth.signInWithPassword({email:String(email||"").trim(),password});
    if(error)throw error;
    session=data.session||null;
    if(data.user){profilePatch(data.user);await upsertProfile(data.user);}
    return data;
  },
  async signUp({name,email,password,learnerType,level,goal}){
    const db=await ensureClient();if(!db)throw new Error("Unable to connect to account service.");
    const metadata={display_name:name,learner_type:learnerType,level,goal};
    const {data,error}=await db.auth.signUp({
      email:String(email||"").trim(),password,
      options:{data:metadata,emailRedirectTo:location.origin+"/#/account"}
    });
    if(error)throw error;
    session=data.session||null;
    if(data.user){profilePatch(data.user);if(data.session)await upsertProfile(data.user,metadata);}
    return data;
  },
  async forgot(email){
    const db=await ensureClient();if(!db)throw new Error("Unable to connect to account service.");
    const {error}=await db.auth.resetPasswordForEmail(String(email||"").trim(),{redirectTo:location.origin+"/#/reset-password"});
    if(error)throw error;
  },
  async updatePassword(password){
    const db=await ensureClient();if(!db)throw new Error("Unable to connect to account service.");
    const {data,error}=await db.auth.updateUser({password});
    if(error)throw error;return data;
  },
  async updateProfile(meta={}){
    const db=await ensureClient();if(!db)throw new Error("Unable to connect to account service.");
    const {data,error}=await db.auth.updateUser({data:{
      display_name:meta.name,learner_type:meta.learnerType,level:meta.level,goal:meta.goal
    }});
    if(error)throw error;
    if(data.user){profilePatch(data.user);await upsertProfile(data.user,{
      display_name:meta.name,learner_type:meta.learnerType,level:meta.level,goal:meta.goal
    });}
    return data;
  },
  async signOut(){
    const db=await ensureClient();
    if(db)await db.auth.signOut();
    session=null;
  },
  isTeacher(){const p=this.current();return p.role==="teacher"||p.role==="admin";}
};
g.AuthService=AuthService;
init();
})(window);