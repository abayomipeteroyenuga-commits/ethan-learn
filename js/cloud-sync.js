(function(g){
  let timer=null, syncing=false;
  const CLOUD_KEYS=['onboarded','lowData','enrolled','savedCourses','completedLessons','quizAttempts','bookmarks','notes','flashcards','xp','badges','streak','weeklyGoalHours','weeklyMinutes','recent','teacherCourses'];
  function snapshot(){const s=StorageService.exportData();const out={};CLOUD_KEYS.forEach(k=>out[k]=s[k]);out.profile={learnerType:s.profile.learnerType,interests:s.profile.interests,level:s.profile.level,goal:s.profile.goal};return out;}
  async function syncNow(){
    if(syncing||!AuthService?.configured)return false;await AuthService.ready;const sess=AuthService.getSession();if(!sess)return false;syncing=true;
    try{const db=AuthService.client, uid=sess.user.id;const {data,error}=await db.from('learner_state').select('state,updated_at').eq('user_id',uid).maybeSingle();if(error)throw error;
      const localUpdated=Number(localStorage.getItem('ethan-learn-updated')||0);const remoteUpdated=data?.updated_at?Date.parse(data.updated_at):0;
      if(data?.state && remoteUpdated>localUpdated){StorageService.set(data.state);localStorage.setItem('ethan-learn-updated',String(remoteUpdated));}
      else {const {error:upErr}=await db.from('learner_state').upsert({user_id:uid,state:snapshot(),updated_at:new Date().toISOString()},{onConflict:'user_id'});if(upErr)throw upErr;localStorage.setItem('ethan-learn-updated',String(Date.now()));}
      return true;
    }catch(e){console.warn('Cloud sync unavailable',e);return false;}finally{syncing=false;}
  }
  function queue(){localStorage.setItem('ethan-learn-updated',String(Date.now()));clearTimeout(timer);timer=setTimeout(syncNow,1200);}
  g.CloudSyncService={syncNow,queue};
  addEventListener('ethan-storage-change',queue);addEventListener('online',syncNow);
})(window);
