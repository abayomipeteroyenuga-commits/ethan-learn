window.ETHAN_CONFIG = {
  SUPABASE_URL: "https://rdznbszyoybhzmwnmgml.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_RoUATadIWlBsO6BKgESpFA_thXlWrpU",
  SUPABASE_CDN: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
};

window.ETHAN_CONFIG.loadSupabase = async function(){
  if(window.supabase?.createClient) return true;
  if(!this.SUPABASE_URL || !this.SUPABASE_ANON_KEY) return false;
  const existing=document.querySelector('script[data-ethan-supabase]');
  if(existing){
    return new Promise(resolve=>{
      if(window.supabase?.createClient) return resolve(true);
      existing.addEventListener("load",()=>resolve(!!window.supabase?.createClient),{once:true});
      existing.addEventListener("error",()=>resolve(false),{once:true});
      setTimeout(()=>resolve(!!window.supabase?.createClient),8000);
    });
  }
  return new Promise(resolve=>{
    const s=document.createElement("script");
    s.src=this.SUPABASE_CDN;
    s.async=true;
    s.dataset.ethanSupabase="1";
    s.onload=()=>resolve(!!window.supabase?.createClient);
    s.onerror=()=>resolve(false);
    document.head.appendChild(s);
  });
};