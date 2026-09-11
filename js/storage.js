(function (g) {
  const KEY = "ethan-learn-v2";
  const LEGACY_KEY = "ethan-learn-v1";
  const defaultState = () => ({
    version: 2,
    profile: { name: "Local learner", role: "learner", learnerType: "Lifelong Learner", interests: [], level: "Beginner", goal: "Personal development", local: true },
    onboarded: false, lowData: false, enrolled: {}, savedCourses: [], completedLessons: {}, quizAttempts: {},
    bookmarks: [], notes: {}, flashcards: [], xp: 0, badges: [], streak: { last: null, count: 0 },
    weeklyGoalHours: 5, weeklyMinutes: {}, recent: [], teacherCourses: [], voice: { autoSpeak: true, rate: 1, pitch: 1, language: "en-US" }
  });
  function mergeState(raw) {
    const base = defaultState();
    const p = raw && typeof raw === "object" ? raw : {};
    const merged = Object.assign(base, p);
    merged.profile = Object.assign(base.profile, p.profile || {});
    merged.voice = Object.assign(base.voice, p.voice || {});
    ["enrolled","completedLessons","quizAttempts","notes","weeklyMinutes"].forEach(k=>{ if(!merged[k] || typeof merged[k]!=="object" || Array.isArray(merged[k])) merged[k]={}; });
    ["savedCourses","bookmarks","flashcards","badges","recent","teacherCourses"].forEach(k=>{ if(!Array.isArray(merged[k])) merged[k]=[]; });
    merged.version = 2;
    return merged;
  }
  function load() {
    try {
      let raw = localStorage.getItem(KEY);
      if (!raw) raw = localStorage.getItem(LEGACY_KEY);
      return raw ? mergeState(JSON.parse(raw)) : defaultState();
    } catch (e) {
      console.warn("ETHAN Learn storage recovered", e);
      return defaultState();
    }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { g.ETHAN?.toast?.("Storage is full or blocked. Progress may not persist."); }
  }
  save();
  g.StorageService = {
    get: () => state,
    set(patch) { state = mergeState(Object.assign({}, state, patch || {})); save(); try{dispatchEvent(new Event("ethan-storage-change"));}catch(_){} return state; },
    update(fn) { if (typeof fn === "function") fn(state); state = mergeState(state); save(); try{dispatchEvent(new Event("ethan-storage-change"));}catch(_){} return state; },
    reset() { state = defaultState(); save(); },
    compactCatalogRefs() {
      const courses=new Set((g.ETHAN_COURSES||[]).map(c=>c.id));
      if(!courses.size)return state;
      const lessons=new Map((g.ETHAN_COURSES||[]).map(c=>[c.id,new Set((c.modules||[]).flatMap(m=>(m.lessons||[]).map(l=>l.id)))]));
      const validPair=k=>{const i=String(k).indexOf(":");if(i<1)return false;const cid=k.slice(0,i),lid=k.slice(i+1);return courses.has(cid)&&lessons.get(cid)?.has(lid)};
      for(const id of Object.keys(state.enrolled||{}))if(!courses.has(id))delete state.enrolled[id];
      state.savedCourses=(state.savedCourses||[]).filter(id=>courses.has(id));
      for(const k of Object.keys(state.completedLessons||{}))if(!validPair(k))delete state.completedLessons[k];
      for(const k of Object.keys(state.quizAttempts||{}))if(!validPair(k))delete state.quizAttempts[k];
      for(const k of Object.keys(state.notes||{}))if(!validPair(k))delete state.notes[k];
      state.bookmarks=(state.bookmarks||[]).filter(validPair);
      state.flashcards=(state.flashcards||[]).filter(x=>!x.courseId||!x.lessonId||(courses.has(x.courseId)&&lessons.get(x.courseId)?.has(x.lessonId)));
      state.recent=(state.recent||[]).filter(x=>!x.courseId||(courses.has(x.courseId)&&(!x.lessonId||lessons.get(x.courseId)?.has(x.lessonId))));
      save(); return state;
    },
    exportData() { return JSON.parse(JSON.stringify(state)); }
  };
})(window);
