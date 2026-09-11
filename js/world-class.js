(function(){
"use strict";
function safeGet(k,d){try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}}
function safeSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function esc(s){return String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function route(){return (location.hash||"#/").replace(/^#\//,"").split(/[/?]/)[0]||"home"}

function ensureStatus(){
  if(document.getElementById("ethan-status"))return;
  const s=document.createElement("div");s.id="ethan-status";s.className="ethan-status";
  s.innerHTML='<span data-net>Online</span><span class="status-dot">•</span><span>ETHAN Learn</span>';
  document.body.appendChild(s);
  updateNet();
}
function updateNet(){
  const el=document.querySelector("#ethan-status [data-net]");if(el)el.textContent=navigator.onLine?"Online":"Offline";
  document.documentElement.classList.toggle("is-offline",!navigator.onLine);
}
window.addEventListener("online",updateNet);window.addEventListener("offline",updateNet);

function addLessonJourney(){
  const lesson=document.querySelector(".lesson-body");if(!lesson||lesson.querySelector(".learning-journey"))return;
  const j=document.createElement("div");j.className="learning-journey";
  j.innerHTML='<span class="journey-step done">1 Learn</span><span class="journey-step">2 Instructor</span><span class="journey-step">3 Practice</span><span class="journey-step">4 Quiz</span><span class="journey-step">5 Complete</span>';
  lesson.prepend(j);
}
function addFocusButton(){
  if(!document.querySelector(".lesson-body")||document.getElementById("focusModeBtn"))return;
  const btn=document.createElement("button");btn.id="focusModeBtn";btn.className="focus-mode-btn";btn.type="button";btn.textContent="Focus mode";
  btn.onclick=()=>{document.documentElement.classList.toggle("lesson-focus");btn.textContent=document.documentElement.classList.contains("lesson-focus")?"Exit focus":"Focus mode"};
  document.body.appendChild(btn);
}
function enhanceHome(){
  const wrap=document.querySelector(".hero + .wrap");if(!wrap||wrap.querySelector(".world-class-strip"))return;
  const courses=(window.ETHAN_COURSES||[]),lessons=courses.reduce((n,c)=>n+(c.modules||[]).reduce((m,x)=>m+(x.lessons||[]).length,0),0);
  const strip=document.createElement("section");strip.className="world-class-strip";
  strip.innerHTML=`
    <div><strong>${courses.length}+</strong><span>courses</span></div>
    <div><strong>${lessons.toLocaleString()}+</strong><span>guided lessons</span></div>
    <div><strong>Do It Now</strong><span>practice in every lesson</span></div>
    <div><strong>Mastery</strong><span>hints, quizzes & evidence</span></div>
    <div><strong>Learn anywhere</strong><span>PWA & lesson audio</span></div>`;
  wrap.prepend(strip);

  const streams=document.createElement("section");streams.className="section academic-streams";
  streams.innerHTML=`<div class="section-head"><div><span class="eyebrow">ACADEMIC STREAMS</span><h2>Choose your learning pathway</h2></div><a class="btn" href="#/subjects">All subjects</a></div>
  <div class="stream-grid">
    <a href="#/subject/science" class="stream-card"><span>SCI</span><b>Sciences</b><small>Biology · Chemistry · Physics · Earth · Environment</small></a>
    <a href="#/subject/arts" class="stream-card"><span>ART</span><b>Arts & Humanities</b><small>Visual arts · Music · Drama · Film · Culture</small></a>
    <a href="#/subject/commercial" class="stream-card"><span>COM</span><b>Commercial Studies</b><small>Commerce · Accounts · Economics · Banking · Insurance</small></a>
    <a href="#/subject/business" class="stream-card"><span>BUS</span><b>Business</b><small>Management · Strategy · Projects · HR · Operations</small></a>
    <a href="#/subject/literature" class="stream-card"><span>LIT</span><b>Literature</b><small>Prose · Poetry · Drama · African & World Literature</small></a>
  </div>`;
  wrap.insertBefore(streams,wrap.children[1]||null);

  const why=document.createElement("section");why.className="section why-ethan";
  why.innerHTML=`<div class="section-head"><div><span class="eyebrow">WHY ETHAN LEARN</span><h2>Built for learning, not endless scrolling</h2></div></div>
  <div class="why-grid">
    <article><b>Learn it</b><p>Structured lessons and complete topic maps, not scattered search results.</p></article>
    <article><b>Do it now</b><p>Every lesson turns into a practical task, worked problem, studio activity, case or mini investigation.</p></article>
    <article><b>Get unstuck</b><p>Hints, explanations, notes, bookmarks, flashcards and ASK ETHAN support your next step.</p></article>
    <article><b>Prove mastery</b><p>Quizzes, projects, assignments and practical evidence show what you can actually do.</p></article>
    <article><b>Track growth</b><p>Progress, XP, streaks, recent activity and portfolio evidence make learning visible.</p></article>
    <article><b>Learn your way</b><p>Listen to lessons, use focus mode, save courses and continue from your last session.</p></article>
  </div>`;
  wrap.insertBefore(why,wrap.children[2]||null);
}
function enhanceCourse(){
  const course=document.querySelector(".course-page");if(!course||course.querySelector(".world-learning-flow"))return;
  const tabs=course.querySelector(".course-tabs");if(!tabs)return;
  const flow=document.createElement("div");flow.className="world-learning-flow";
  flow.innerHTML='<div><b>Learn</b><span>Understand the idea</span></div><i>→</i><div><b>Practice</b><span>Do the work</span></div><i>→</i><div><b>Assess</b><span>Prove mastery</span></div><i>→</i><div><b>Progress</b><span>Build your record</span></div>';
  tabs.before(flow);
}
function enhanceDashboard(){
  const wrap=document.querySelector("#app > .wrap");if(route()!=="dashboard"||!wrap||wrap.querySelector(".world-dashboard-banner"))return;
  const s=window.StorageService?.get?.();if(!s)return;
  const completed=Object.keys(s.completedLessons||{}).length;
  const quizzes=Object.values(s.quizAttempts||{}).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);
  const practical=window.EthanPracticeLab?.stats?.().completed||0;
  const banner=document.createElement("div");banner.className="world-dashboard-banner";
  banner.innerHTML=`<div><span class="eyebrow">LEARNING INTELLIGENCE</span><h2>Your learning is building up</h2><p>Use lessons, practical work and assessments together rather than only reading content.</p></div><div class="world-mini-stats"><span><b>${completed}</b> lessons</span><span><b>${quizzes}</b> quiz attempts</span><span><b>${s.streak?.count||0}</b> day streak</span><span><b>${practical}</b> practical evidence</span></div>`;
  wrap.prepend(banner);
}
function rememberRoute(){
  const h=location.hash||"#/";if(/^#\/(lesson|course)\//.test(h))safeSet("ethan_last_learning_route",h);
}
function addResume(){
  if(route()!=="home")return;
  const hero=document.querySelector(".hero .wrap");if(!hero||hero.querySelector(".resume-learning"))return;
  const last=safeGet("ethan_last_learning_route","");
  if(!last)return;
  const a=document.createElement("a");a.className="btn resume-learning";a.href=last;a.textContent="Resume your last learning session →";
  hero.appendChild(a);
}
function keyboard(){
  if(window.__ethanKeyboard)return;window.__ethanKeyboard=true;
  document.addEventListener("keydown",e=>{
    if((e.key==="/"||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"))&&!/input|textarea|select/i.test(document.activeElement?.tagName||"")){
      e.preventDefault();
      const q=document.getElementById("header-q")||document.querySelector('#app input[type="search"],#app input[name="q"]');
      if(q){q.focus();q.select?.()}
    }
    if(e.key==="Escape"&&document.documentElement.classList.contains("lesson-focus"))document.documentElement.classList.remove("lesson-focus");
  });
}
function run(){
  ensureStatus();rememberRoute();enhanceHome();addResume();enhanceCourse();addLessonJourney();addFocusButton();enhanceDashboard();
  if(!document.querySelector(".lesson-body")){document.getElementById("focusModeBtn")?.remove();document.documentElement.classList.remove("lesson-focus")}
}
window.addEventListener("ethan:rendered",run);window.addEventListener("hashchange",rememberRoute);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{keyboard();run()});else{keyboard();run()}
})();