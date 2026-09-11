window.ETHAN_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: ""
};

window.ETHAN_CONFIG.loadSupabase = async function(){
  if(!this.SUPABASE_URL || !this.SUPABASE_ANON_KEY || window.supabase) return !!window.supabase;
  return new Promise(resolve=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.async=true;s.onload=()=>resolve(true);s.onerror=()=>resolve(false);document.head.appendChild(s);});
};
