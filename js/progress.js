(function (g) {
  function dayKey(d=new Date()) { return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10); }
  function weekKey(d=new Date()) {
    const x = new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
    const day = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate()+4-day);
    const y0 = new Date(Date.UTC(x.getUTCFullYear(),0,1));
    return x.getUTCFullYear()+"-W"+String(Math.ceil((((x-y0)/86400000)+1)/7)).padStart(2,"0");
  }
  function finalize(s,courseId) {
    if (!g.ProgressService.courseComplete(courseId,s)) return false;
    const add = id => { if (!s.badges.includes(id)) s.badges.push(id); };
    add("course-completed");
    s.enrolled[courseId] = s.enrolled[courseId] || { at: Date.now() };
    s.enrolled[courseId].status = "completed";
    if (!s.enrolled[courseId].completedAt) s.enrolled[courseId].completedAt = Date.now();
    return true;
  }
  g.ProgressService = {
    weekKey,
    enroll(courseId) { StorageService.update(s=>{ if(!s.enrolled[courseId]) s.enrolled[courseId]={at:Date.now(),status:"in-progress"}; }); },
    saveCourse(courseId) { StorageService.update(s=>{ if(!s.savedCourses.includes(courseId)) s.savedCourses.push(courseId); }); },
    unsaveCourse(courseId) { StorageService.update(s=>{ s.savedCourses=s.savedCourses.filter(id=>id!==courseId); }); },
    markLesson(courseId,lessonId,minutes) {
      let newlyCompleted=false;
      StorageService.update(s=>{
        const key=courseId+":"+lessonId;
        if (s.completedLessons[key]) return;
        newlyCompleted=true; s.completedLessons[key]={at:Date.now()};
        const wk=weekKey(); s.weeklyMinutes[wk]=(s.weeklyMinutes[wk]||0)+(Number(minutes)||10);
        const t=dayKey();
        if(s.streak.last!==t){ const y=new Date(); y.setDate(y.getDate()-1); const yd=dayKey(y); s.streak.count=s.streak.last===yd?s.streak.count+1:1; s.streak.last=t; }
        s.xp+=10;
        if(Object.keys(s.completedLessons).length>=1 && !s.badges.includes("first-lesson")) s.badges.push("first-lesson");
        if(s.streak.count>=7 && !s.badges.includes("seven-day")) s.badges.push("seven-day");
        s.recent.unshift({type:"lesson",courseId,lessonId,at:Date.now()}); s.recent=s.recent.slice(0,30);
        finalize(s,courseId);
      });
      return newlyCompleted;
    },
    lessonDone(courseId,lessonId){ return !!StorageService.get().completedLessons[courseId+":"+lessonId]; },
    courseLessons(course){ const a=[]; (course?.modules||[]).forEach(m=>(m.lessons||[]).forEach(l=>a.push(l))); return a; },
    courseProgress(course){ const ls=this.courseLessons(course); if(!ls.length)return 0; const done=StorageService.get().completedLessons; const n=ls.reduce((t,l)=>t+(done[course.id+":"+l.id]?1:0),0); return Math.round(n/ls.length*100); },
    courseComplete(courseId,state){
      const c=(g.ETHAN_COURSES||[]).find(x=>x.id===courseId); if(!c)return false;
      const s=state||StorageService.get(), ls=this.courseLessons(c); if(!ls.length)return false;
      if(!ls.every(l=>s.completedLessons[courseId+":"+l.id]))return false;
      return ls.filter(l=>l.quiz?.length).every(l=>{ const a=s.quizAttempts[courseId+":"+l.id]||[]; return a.some(x=>x.pct>=60); });
    },
    recordQuiz(courseId,lessonId,pct){
      StorageService.update(s=>{
        const k=courseId+":"+lessonId; s.quizAttempts[k]=s.quizAttempts[k]||[]; s.quizAttempts[k].push({at:Date.now(),pct});
        if(s.quizAttempts[k].length>20)s.quizAttempts[k]=s.quizAttempts[k].slice(-20);
        s.xp+=Math.max(1,Math.round(pct/20)); if(pct>=80&&!s.badges.includes("quiz-master"))s.badges.push("quiz-master");
        s.recent.unshift({type:"quiz",courseId,lessonId,pct,at:Date.now()}); s.recent=s.recent.slice(0,30);
        finalize(s,courseId);
      });
    },
    bestScore(courseId,lessonId){ const a=StorageService.get().quizAttempts[courseId+":"+lessonId]||[]; return a.length?Math.max(...a.map(x=>x.pct)):null; },
    canCertificate(courseId){ return this.courseComplete(courseId); }
  };
})(window);
