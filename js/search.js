(function (g) {
  const aliases={
    excel:["spreadsheet","microsoft excel"],word:["microsoft word","document"],
    powerpoint:["presentation","microsoft powerpoint"],ai:["artificial intelligence","generative ai"],
    coding:["programming","software development"],jobs:["career","resume","cv","interview"],
    marketing:["digital marketing","social media","seo"],accounts:["accounting","bookkeeping","finance"]
  };
  function clean(s){ return String(s||"").replace(/<[^>]+>/g," ").toLowerCase().replace(/[^a-z0-9+#.]+/g," "); }
  function courseText(c){
    // Lightweight index: do not ingest every long lesson body. This removes the v1.x search freeze.
    const p=[c.title,c.description,c.subject,c.level,...(c.objectives||[]),...(c.prerequisites||[])];
    (c.modules||[]).forEach(m=>{p.push(m.title);(m.lessons||[]).forEach(l=>p.push(l.title));});
    return clean(p.join(" "));
  }
  const cache=new Map();
  const indexed=c=>{
    if(!cache.has(c.id)) cache.set(c.id,courseText(c));
    return cache.get(c.id);
  };
  function tokens(q){
    const raw=clean(q).trim().split(/\s+/).filter(Boolean);
    const exp=[...raw];
    raw.forEach(w=>(aliases[w]||[]).forEach(a=>exp.push(...clean(a).split(/\s+/))));
    return [...new Set(exp)];
  }
  function score(text,title,words,phrase){
    let n=0,t=clean(title);
    if(t===phrase)n+=100;
    if(t.includes(phrase))n+=45;
    if(text.includes(phrase))n+=20;
    words.forEach(w=>{if(t.includes(w))n+=12;else if(text.includes(w))n+=4;});
    return n;
  }
  g.SearchService={
    query(q){
      const phrase=clean(q).trim();
      if(!phrase) return {
        courses:[...g.ETHAN_COURSES],lessons:[],
        paths:[...g.ETHAN_PATHS],subjects:[...g.ETHAN_SUBJECTS]
      };
      const words=tokens(q);
      const courses=g.ETHAN_COURSES
        .map(c=>({c,n:score(indexed(c),c.title,words,phrase)}))
        .filter(x=>x.n>0).sort((a,b)=>b.n-a.n||a.c.title.localeCompare(b.c.title)).map(x=>x.c);

      // Lesson search stays useful but only inspects title + a small text sample and stops at 80 results.
      const lessons=[];
      outer: for(const c of g.ETHAN_COURSES){
        for(const m of (c.modules||[])){
          for(const l of (m.lessons||[])){
            const tx=clean(l.title+" "+String(l.body||"").replace(/<[^>]+>/g," ").slice(0,700));
            const n=score(tx,l.title,words,phrase);
            if(n>0) lessons.push({course:c,module:m,lesson:l,score:n});
            if(lessons.length>=80) break outer;
          }
        }
      }
      lessons.sort((a,b)=>b.score-a.score);
      const paths=g.ETHAN_PATHS.map(p=>({p,n:score(clean(p.title+" "+p.description+" "+(p.skills||[]).join(" ")),p.title,words,phrase)})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n).map(x=>x.p);
      const subjects=g.ETHAN_SUBJECTS.map(s=>({s,n:score(clean(s.name+" "+(s.topics||[]).join(" ")),s.name,words,phrase)})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n).map(x=>x.s);
      return {courses,lessons,paths,subjects};
    },
    clearCache(){cache.clear();}
  };
})(window);