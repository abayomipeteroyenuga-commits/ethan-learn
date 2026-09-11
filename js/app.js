(function () {
  const app = document.getElementById("app");
  const suggestions = ["Mathematics","Artificial Intelligence","Excel","English","Python","Digital Marketing","Accounting","Cybersecurity","Data Analysis","Web Development"];

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }
  window.ETHAN = { toast };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function courseById(id) {
    return (window.ETHAN_COURSES || []).find((c) => c.id === id);
  }
  function subjectById(id) {
    return (window.ETHAN_SUBJECTS || []).find((s) => s.id === id);
  }

  function setActiveNav(route) {
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const r = a.getAttribute("data-nav");
      a.classList.toggle("active", r === route || (route === "home" && r === "home"));
    });
  }

  function parseHash() {
    const h = (location.hash || "#/").replace(/^#/, "").split("?")[0];
    const parts = h.split("/").filter(Boolean);
    return { parts, path: "/" + parts.join("/") };
  }

  function go(to) {
    location.hash = to.startsWith("#") ? to : "#" + to;
  }

  function courseCard(c) {
    const pct = ProgressService.courseProgress(c);
    const core = (window.ETHAN_CORE_CURRICULUM_IDS||[]).includes(c.id);
    const nigeria = !!c.nigeria;
    const saved = StorageService.get().savedCourses.includes(c.id);
    const sub=(subjectById(c.subject)||{}).name || c.subject;
    return `<article class="card course-card" tabindex="0" data-go="#/course/${esc(c.id)}">
      <div class="course-topline"><span class="course-subject">${esc(sub)}</span><span class="course-hours">${Number(c.durationHours)||0}h</span></div>
      <h3>${esc(c.title)} ${saved ? `<span class="saved-mark" aria-label="Saved">★</span>` : ""}</h3>
      <p class="course-desc">${esc(c.description)}</p>
      <div class="course-tags"><span class="badge">${esc(c.level)}</span>${nigeria?`<span class="badge badge-ng">Nigeria ${esc(c.nigeriaYear||"")}</span>`:""}${core?`<span class="badge">Global Core</span>`:""}</div>
      <div class="course-progress-row"><span>${pct ? pct+"% complete" : "Ready to start"}</span><span>Open →</span></div>
      <div class="progress" aria-label="Progress ${pct}%"><span style="width:${pct}%"></span></div>
    </article>`;
  }

  function bindGo(root) {
    root.querySelectorAll("[data-go]").forEach((el) => {
      const run = () => go(el.getAttribute("data-go"));
      el.addEventListener("click", run);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    });
  }

  function viewHome() {
    const s = StorageService.get();
    const rec = recommend();
    const popular = window.ETHAN_COURSES.slice(0, 6);
    return `<div class="hero"><div class="wrap">
      <p style="font-weight:700;color:var(--accent-2);margin:0">ETHAN Learn</p>
      <h1>WHAT DO YOU WANT TO LEARN TODAY?</h1>
      <p class="lead">Learn academic subjects, technology, business, professional skills and practical life skills at your own pace.</p>
      <form class="search-hero" id="hero-search">
        <label class="skip" for="q">Search</label>
        <input id="q" name="q" placeholder="Search courses, subjects, skills or topics..." autocomplete="off" />
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
      <div class="chips">${suggestions.map((x) => `<button type="button" class="chip" data-suggest="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    </div></div>
    <div class="wrap">
      <section class="section">
        <h2>Continue Learning</h2>
        <div class="grid grid-3" id="continue-grid">${continueCards() || `<div class="empty">No courses in progress yet. Explore a subject to begin.</div>`}</div>
      </section>
      <section class="section">
        <h2>Recommended for You</h2>
        <p class="meta">Based on learner type: ${esc(s.profile.learnerType)} · ${esc(s.profile.level)}</p>
        <div class="grid grid-3">${rec.map(courseCard).join("")}</div>
      </section>
      <section class="section">
        <h2>Popular Subjects</h2>
        <div class="grid grid-4">${window.ETHAN_SUBJECTS.slice(0,12).map((sub) => `<article class="card course-card" data-go="#/subject/${sub.id}"><h3>${esc(sub.name)}</h3><p>${esc((sub.topics||[]).slice(0,4).join(" · "))}</p></article>`).join("")}</div>
      </section>
      <section class="section nigeria-feature">
        <div class="card"><span class="badge">Nigeria Curriculum</span><h2>Primary 1 → SS3 structured learning</h2><p>Class-by-class Mathematics, English, Science, Digital Technologies, Business Studies and senior Biology, Chemistry, Physics, Commerce and current compulsory subjects.</p><p><button class="btn btn-primary" data-go="#/nigeria">Open Nigeria Curriculum</button></p></div>
      </section>
      <section class="section">
        <h2>New Skills</h2>
        <div class="chips">${["Prompt Engineering","Power BI","PivotTables","Responsive Web Design","Financial Literacy"].map((x)=>`<button class="chip" data-suggest="${esc(x)}">${esc(x)}</button>`).join("")}</div>
      </section>
      <section class="section">
        <h2>Learning Paths</h2>
        <div class="grid grid-3">${window.ETHAN_PATHS.map((p)=>`<article class="card course-card" data-go="#/path/${p.id}"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></article>`).join("")}</div>
      </section>
      <section class="section">
        <h2>Featured Courses</h2>
        <div class="grid grid-3">${popular.map(courseCard).join("")}</div>
      </section>
    </div>`;
  }

  function continueCards() {
    const ids = Object.keys(StorageService.get().enrolled);
    const cards = ids.map(courseById).filter(Boolean).filter((c) => ProgressService.courseProgress(c) < 100).map(courseCard);
    return cards.join("");
  }

  function recommend() {
    const s = StorageService.get();
    const type = s.profile.learnerType;
    const list = window.ETHAN_COURSES.filter((c) => !c.learnerTypes || c.learnerTypes.includes(type));
    return (list.length ? list : window.ETHAN_COURSES).slice(0, 6);
  }

  function viewExplore(query) {
    const res = SearchService.query(query || "");
    return `<div class="wrap">
      <h1>Explore</h1>
      <form class="search-hero" id="exp-search" style="margin:12px 0 20px">
        <input name="q" value="${esc(query||"")}" placeholder="Search the library..." />
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
      <div class="filters">
        <select id="f-subject"><option value="">All subjects</option>${window.ETHAN_SUBJECTS.map((s)=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select>
        <select id="f-level"><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
        <select id="f-sort"><option value="az">A-Z</option><option value="new">Newest</option><option value="pop">Popular</option></select>
      </div>
      <h2>Courses <span class="count-pill">${res.courses.length}</span></h2>
      <div class="grid grid-3" id="explore-grid">${res.courses.slice(0,48).map(courseCard).join("") || emptyExplore()}</div>${res.courses.length>48?`<div class="load-more-wrap"><button class="btn" id="load-more-courses" data-total="${res.courses.length}">Show more courses</button></div>`:""}
      ${query ? `<h2>Lessons</h2><div class="grid">${res.lessons.slice(0,12).map((x)=>`<article class="card course-card" data-go="#/lesson/${x.course.id}/${x.lesson.id}"><h3>${esc(x.lesson.title)}</h3><p>${esc(x.course.title)}</p></article>`).join("")}</div>
      <h2>Paths & subjects</h2><div class="grid grid-3">${res.paths.map((p)=>`<article class="card" data-go="#/path/${p.id}"><h3>${esc(p.title)}</h3></article>`).join("")}${res.subjects.map((s)=>`<article class="card" data-go="#/subject/${s.id}"><h3>${esc(s.name)}</h3></article>`).join("")}</div>` : ""}
    </div>`;
  }

  function emptyExplore() {
    return `<div class="empty">No matches. Try Excel, Python, or Mathematics.<p><button class="btn" data-go="#/explore">Clear search</button></p></div>`;
  }

  function viewSubject(id) {
    const sub = subjectById(id);
    if (!sub) return `<div class="wrap"><p>Subject not found.</p></div>`;
    const courses = window.ETHAN_COURSES.filter((c) => c.subject === id);
    return `<div class="wrap"><h1>${esc(sub.name)}</h1><p>${esc((sub.topics||[]).join(" · "))}</p><p class="meta">${courses.length} courses available</p>
      <div class="grid grid-3">${courses.map(courseCard).join("") || `<div class="empty">Starter catalog for this subject is growing. Related topics are listed above for future courses.</div>`}</div></div>`;
  }

  function viewCourse(id) {
    const c = courseById(id);
    if (!c) return `<div class="wrap"><div class="empty">Course not found.<p><a class="btn" href="#/explore">Back to Courses</a></p></div></div>`;
    const pct = ProgressService.courseProgress(c);
    const enrolled = !!StorageService.get().enrolled[id];
    const saved = StorageService.get().savedCourses.includes(id);
    const lessons=ProgressService.courseLessons(c);
    const done=lessons.filter(l=>ProgressService.lessonDone(c.id,l.id)).length;
    return `<div class="wrap course-page">
      <div class="breadcrumbs"><a href="#/explore">Courses</a><span>›</span><a href="#/subject/${esc(c.subject)}">${esc((subjectById(c.subject)||{}).name||"Subject")}</a></div>
      <section class="course-overview" data-course-narration>
        <div class="course-overview-main">
          <div class="course-kicker">${c.nigeria?`Nigeria ${esc(c.nigeriaYear||"")} · `:""}${esc((subjectById(c.subject)||{}).name||c.subject)}</div>
          <h1>${esc(c.title)}</h1>
          <p class="course-lead">${esc(c.description)}</p>
          ${c.curriculumNote?`<div class="curriculum-note"><strong>Curriculum alignment:</strong> ${esc(c.curriculumNote)}</div>`:""}
          <div class="course-tags"><span class="badge">${esc(c.level)}</span><span class="badge">${c.durationHours} hours</span><span class="badge">${lessons.length} lessons</span></div>
          <div class="course-actions">
            <button class="btn btn-primary" id="start-course">${enrolled ? "Continue Learning" : "Start Course"}</button>
            <button class="btn" id="save-course">${saved ? "Saved ★" : "Save Course"}</button>
            ${ProgressService.canCertificate(id) ? `<a class="btn" href="#/certificate/${id}">Certificate</a>` : ""}
          </div>
        </div>
        <aside class="course-progress-card">
          <div class="progress-ring" style="--pct:${pct}"><strong>${pct}%</strong><span>complete</span></div>
          <p><strong>${done}</strong> of ${lessons.length} lessons completed</p>
          <div class="progress"><span style="width:${pct}%"></span></div>
        </aside>
      </section>

      <div class="course-tabs" role="tablist" aria-label="Course sections">
        <button class="tab-btn active" data-tab-target="overview">Overview</button>
        <button class="tab-btn" data-tab-target="curriculum">Curriculum</button>
        <button class="tab-btn" data-tab-target="assessment">Practical & Assessment</button>
      </div>
      <section class="tab-panel active" data-tab-panel="overview">
        <div class="content-grid">
          <div class="card"><h2>What you will learn</h2><ul class="check-list">${(c.objectives||[]).map(o=>`<li>${esc(o)}</li>`).join("")}</ul></div>
          <div class="card"><h2>How you will learn</h2><p>Lessons combine explanation, examples, guided practice, independent work, quizzes, projects and assessment evidence.</p></div>
        </div>
      </section>
      <section class="tab-panel" data-tab-panel="curriculum">
        <div class="module-list">${(c.modules||[]).map((m,mi)=>`<details class="module-accordion" ${mi===0?"open":""}>
          <summary><span><b>Module ${mi+1}</b> ${esc(m.title)}</span><small>${(m.lessons||[]).length} lessons</small></summary>
          <div class="module-lessons">${(m.lessons||[]).map((l,li)=>`<a class="lesson-row" href="#/lesson/${c.id}/${l.id}">
            <span class="lesson-number">${ProgressService.lessonDone(c.id,l.id)?"✓":li+1}</span>
            <span><strong>${esc(l.title)}</strong><small>${l.minutes||0} min${l.quiz?.length?" · Quiz":""}</small></span>
            <span>→</span></a>`).join("")}</div>
        </details>`).join("")}</div>
      </section>
      <section class="tab-panel" data-tab-panel="assessment">
        <div class="content-grid">
          <div class="card"><h2>Practical standard</h2><p>Complete the practical workshop, independent assignment, case study and mini project. Keep evidence of your own work.</p></div>
          <div class="card"><h2>Assessment standard</h2><p>Use the knowledge + application assessments to prove understanding. A suggested mastery target is 70% plus completed practical evidence.</p></div>
        </div>
      </section>
    </div>`;
  }

  function findLesson(course, lid) {
    for (const m of course.modules || []) {
      const l = (m.lessons || []).find((x) => x.id === lid);
      if (l) return { module: m, lesson: l };
    }
    return null;
  }

  function viewLesson(cid, lid) {
    const c = courseById(cid);
    if (!c) return `<div class="wrap">Course missing.</div>`;
    const found = findLesson(c, lid);
    if (!found) return `<div class="wrap">Lesson missing.</div>`;
    const { lesson } = found;
    const all = ProgressService.courseLessons(c);
    const idx = all.findIndex((x) => x.id === lid);
    const prev = all[idx - 1];
    const next = all[idx + 1];
    const notes = StorageService.get().notes[cid + ":" + lid] || "";
    const bookmarked = StorageService.get().bookmarks.includes(cid + ":" + lid);
    const pct = ProgressService.courseProgress(c);
    return `<div class="wrap lesson-layout">
      <aside class="curriculum" aria-label="Curriculum">
        <strong>${esc(c.title)}</strong>
        <div class="progress" style="margin:8px 0"><span style="width:${pct}%"></span></div>
        ${(c.modules||[]).map((m)=>`<div><p class="meta">${esc(m.title)}</p>${m.lessons.map((l)=>`<a class="${l.id===lid?"active":""}" href="#/lesson/${c.id}/${l.id}">${esc(l.title)}</a>`).join("")}</div>`).join("")}
      </aside>
      <article class="lesson-body">
        <h1>${esc(lesson.title)}</h1>
        <p class="meta">${lesson.minutes} min · ${esc(found.module.title)}</p>
        <div class="lesson-html">${lesson.body}</div>
        ${window.EthanPracticeLab?.render?.(c,lesson)||""}
        <div class="nav-lesson">
          ${prev ? `<a class="btn" href="#/lesson/${c.id}/${prev.id}">← Previous Lesson</a>` : ""}
          ${next ? `<a class="btn" href="#/lesson/${c.id}/${next.id}">Next Lesson →</a>` : ""}
          <button class="btn btn-primary" id="mark-complete" ${ProgressService.lessonDone(c.id,lid)?"disabled":""}>${ProgressService.lessonDone(c.id,lid)?"Completed ✓":"Mark Complete"}</button>
          <button class="btn" id="take-quiz" ${lesson.quiz ? "" : "disabled"}>Quick Quiz${ProgressService.bestScore(c.id,lid)!=null?` · Best ${ProgressService.bestScore(c.id,lid)}%`:""}</button>
        </div>
        <div id="quiz-box"></div>
      </article>
      <aside class="side-panel">
        <section class="lesson-listen-panel" aria-label="Lesson audio">
          <div class="listen-head"><strong>🔊 Listen to Lesson</strong><span data-listen-status>Ready</span></div>
          <div class="listen-progress"><span data-listen-progress></span></div>
          <div class="voice-controls">
            <button class="btn btn-primary" type="button" data-listen-play>▶ Listen to Lesson</button>
            <button class="btn" type="button" data-listen-stop>■ Stop</button>
          </div>
          <div class="field"><label>Reading speed
            <select data-listen-rate>
              <option value="0.82">Slow</option><option value="0.95" selected>Normal</option><option value="1.08">Fast</option><option value="1.2">Faster</option>
            </select>
          </label></div>
          <div class="field"><label>Voice
            <select data-listen-voice><option value="">Automatic best voice</option></select>
          </label></div>
          <p class="voice-help">Audio uses your browser/device speech voices. No microphone permission is needed to listen.</p>
        </section>
        <button class="btn btn-primary" id="ask-ethan" style="width:100%">ASK ETHAN</button>

        <div id="tutor-box" class="tutor-log" hidden></div>
        <form id="tutor-form" hidden>
          <label class="field">Question
            <textarea name="prompt" rows="3" placeholder="Explain this more simply."></textarea>
          </label>
          <button class="btn" type="submit">Send</button>
        </form>
        <h3>Notes</h3>
        <textarea id="note-area" rows="6" placeholder="Write a note…">${esc(notes)}</textarea>
        <button class="btn" id="save-note">Save note</button>
        <p><button class="btn" id="bookmark">${bookmarked ? "Remove bookmark" : "Bookmark lesson"}</button> <button class="btn" id="make-flashcard">Make flashcard</button></p>
      </aside>
    </div>`;
  }

  function renderQuiz(container, course, lesson) {
    const questions = lesson.quiz || [];
    let i = 0;
    let score = 0;
    const answers = [];
    function show() {
      if (i >= questions.length) {
        const pct = Math.round((score / questions.length) * 100);
        ProgressService.recordQuiz(course.id, lesson.id, pct);
        container.innerHTML = `<div class="card"><h3>Score: ${pct}%</h3>
          <p>${score} of ${questions.length} correct.</p>
          <p><strong>${pct>=80?"Mastery level: Strong":pct>=60?"Mastery level: Developing":"Mastery level: Foundation practice needed"}</strong></p>
          <p>${pct < 60 ? "Review the lesson, use the hint and Do It Now task, then retry." : pct < 80 ? "Good start. Retry until you can explain why each answer is correct." : "Strong recall. Complete the practical evidence before moving on."}</p>
          <button class="btn" id="retry-q">Retry</button></div>`;
        container.querySelector("#retry-q").onclick = () => { i = 0; score = 0; answers.length = 0; show(); };
        return;
      }
      const q = questions[i];
      container.innerHTML = `<div class="card mastery-question"><p><strong>Question ${i+1} of ${questions.length}</strong></p>
        <p>${esc(q.question)}</p>
        <button class="btn btn-ghost quiz-hint" type="button" id="qhint">Need a hint?</button>
        <div id="qhintbox" class="hint-box" hidden></div>
        ${(q.options||[]).map((o, idx) => `<button class="quiz-opt" data-i="${idx}">${esc(o)}</button>`).join("")}
        <div id="qexp"></div></div>`;
      const hintBtn=container.querySelector("#qhint");
      if(hintBtn)hintBtn.onclick=()=>{
        const hb=container.querySelector("#qhintbox");
        hb.hidden=false;
        hb.textContent=q.hint||"Look for the option that best matches the main concept or method from this lesson. Eliminate choices that contradict the definition, rule or evidence.";
        hintBtn.disabled=true;
      };
      container.querySelectorAll(".quiz-opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pick = Number(btn.getAttribute("data-i"));
          const ok = pick === q.answer;
          if (ok) score++;
          answers.push(ok);
          btn.classList.add(ok ? "correct" : "wrong");
          container.querySelectorAll(".quiz-opt").forEach((b) => b.disabled = true);
          container.querySelector("#qexp").innerHTML = `<p>${ok ? "Correct." : "Not quite."} ${esc(q.explanation||"")}</p><button class="btn btn-primary" id="nq">Next</button>`;
          container.querySelector("#nq").onclick = () => { i++; show(); };
        });
      });
    }
    show();
  }


  function recentActivity() {
    const items=StorageService.get().recent.slice(0,8);
    if(!items.length)return `<p class="meta">Your lesson and quiz activity will appear here.</p>`;
    return items.map(x=>{const c=courseById(x.courseId);const f=c&&findLesson(c,x.lessonId);const when=new Date(x.at).toLocaleString();if(x.type==="quiz")return `<p><strong>Quiz ${x.pct}%</strong> · ${esc(f?.lesson?.title||"Lesson")} · ${esc(c?.title||"")} <span class="meta">${esc(when)}</span></p>`;return `<p><strong>Completed</strong> · ${esc(f?.lesson?.title||"Lesson")} · ${esc(c?.title||"")} <span class="meta">${esc(when)}</span></p>`;}).join("");
  }
  function viewDashboard() {
    const s = StorageService.get();
    const name = s.profile.name;
    const hours = s.weeklyMinutes[ProgressService.weekKey()] || 0;
    const goal = (s.weeklyGoalHours || 5) * 60;
    return `<div class="wrap">
      <h1>Welcome, ${esc(name)}</h1>
      <p class="meta">${s.profile.local ? "Local development profile — not a secure cloud account." : ""}</p>
      <div class="stat-row">
        <div class="card"><h3>${Object.keys(s.enrolled).length}</h3><p>Courses</p></div>
        <div class="card"><h3>${Object.keys(s.completedLessons).length}</h3><p>Lessons completed</p></div>
        <div class="card"><h3>${s.streak.count}</h3><p>Day streak</p></div>
        <div class="card"><h3>${s.xp}</h3><p>XP</p></div>
      </div>
      <section class="section"><h2>Weekly learning goal</h2>
        <p>${hours} of ${goal} minutes logged this week.</p>
        <div class="progress"><span style="width:${Math.min(100, Math.round(hours/goal*100))}%"></span></div>
      </section>
      <section class="section"><h2>Continue Learning</h2><div class="grid grid-3">${continueCards() || `<div class="empty">Nothing in progress. <button class="btn" data-go="#/explore">Explore Courses</button></div>`}</div></section>
      <section class="section"><h2>Recent activity</h2><div class="activity-list">${recentActivity()}</div></section>
      <section class="section"><h2>Badges</h2><p>${s.badges.length ? s.badges.map((b)=>`<span class="badge">${esc(b)}</span>`).join(" ") : "Earn badges by completing lessons and quizzes."}</p></section>
    </div>`;
  }

  function viewMyLearning() {
    const s = StorageService.get();
    const enrolled = Object.keys(s.enrolled).map(courseById).filter(Boolean);
    const inProg = enrolled.filter(c=>ProgressService.courseProgress(c)<100 || !ProgressService.canCertificate(c.id));
    const completed = enrolled.filter(c=>ProgressService.canCertificate(c.id));
    const savedCourses = s.savedCourses.map(courseById).filter(Boolean);
    const savedLessons = s.bookmarks.map((b) => { const [cid,lid]=b.split(":"); const c=courseById(cid); const f=c&&findLesson(c,lid); return c&&f?`<article class="card course-card" data-go="#/lesson/${cid}/${lid}"><h3>${esc(f.lesson.title)}</h3><p>${esc(c.title)}</p></article>`:""; }).join("");
    const notes = Object.entries(s.notes).filter(([,v])=>String(v).trim()).map(([k,v])=>{const [cid,lid]=k.split(":");const c=courseById(cid);const f=c&&findLesson(c,lid);return c&&f?`<article class="card"><h3>${esc(f.lesson.title)}</h3><p>${esc(String(v).slice(0,180))}</p><p><a href="#/lesson/${cid}/${lid}">Open lesson</a></p></article>`:"";}).join("");
    const cards=s.flashcards.map((x,i)=>`<article class="card"><h3>${esc(x.front)}</h3><p>${esc(x.back)}</p><button class="btn flash-delete" data-i="${i}">Delete</button></article>`).join("");
    return `<div class="wrap">
      <div class="page-head"><div><span class="eyebrow">YOUR WORKSPACE</span><h1>My Learning</h1><p>Track courses, saved work, notes, flashcards and certificates.</p></div></div>
      <div class="course-tabs" role="tablist">
        <button class="tab-btn active" data-tab-target="progress">In Progress <span class="count-pill">${inProg.length}</span></button>
        <button class="tab-btn" data-tab-target="completed">Completed <span class="count-pill">${completed.length}</span></button>
        <button class="tab-btn" data-tab-target="saved">Saved</button>
        <button class="tab-btn" data-tab-target="study-tools">Study Tools</button>
        <button class="tab-btn" data-tab-target="certificates">Certificates</button>
      </div>
      <section class="tab-panel active" data-tab-panel="progress"><div class="grid grid-3">${inProg.map(courseCard).join("") || `<div class="empty">No courses in progress.<p><button class="btn btn-primary" data-go="#/explore">Explore Courses</button></p></div>`}</div></section>
      <section class="tab-panel" data-tab-panel="completed"><div class="grid grid-3">${completed.map(courseCard).join("") || "<p class='meta'>No completed courses yet.</p>"}</div></section>
      <section class="tab-panel" data-tab-panel="saved"><h2>Saved courses</h2><div class="grid grid-3">${savedCourses.map(courseCard).join("") || "<p class='meta'>No saved courses yet.</p>"}</div><h2>Bookmarked lessons</h2><div class="grid grid-3">${savedLessons || "<p class='meta'>No bookmarked lessons.</p>"}</div></section>
      <section class="tab-panel" data-tab-panel="study-tools"><h2>Notes</h2><div class="grid grid-3">${notes || "<p class='meta'>No lesson notes yet.</p>"}</div><h2>Flashcards</h2><div class="grid grid-3">${cards || "<p class='meta'>Create flashcards from lesson pages.</p>"}</div></section>
      <section class="tab-panel" data-tab-panel="certificates"><div>${completed.map(c=>`<p><a class="btn" href="#/certificate/${c.id}">${esc(c.title)}</a></p>`).join("") || "<p class='meta'>Certificates appear after required lessons and quizzes are completed.</p>"}</div></section>
    </div>`;
  }

  function viewPractice() {
    const enrolled=Object.keys(StorageService.get().enrolled).map(courseById).filter(Boolean);
    const focus=(enrolled.length?enrolled:window.ETHAN_COURSES).slice(0,24);
    return `<div class="wrap">
      <div class="page-head"><div><span class="eyebrow">ACTIVE LEARNING</span><h1>Practice & Assessment</h1><p>Use quizzes, assignments, projects and applied work to prove what you know.</p></div></div>
      <div class="course-tabs" role="tablist">
        <button class="tab-btn active" data-tab-target="quiz-practice">Quizzes</button>
        <button class="tab-btn" data-tab-target="assignments">Assignments</button>
        <button class="tab-btn" data-tab-target="projects">Projects</button>
        <button class="tab-btn" data-tab-target="mastery">Mastery</button>
      </div>
      <section class="tab-panel active" data-tab-panel="quiz-practice"><div class="grid grid-3">${focus.map(courseCard).join("")}</div></section>
      <section class="tab-panel" data-tab-panel="assignments"><div class="card"><h2>Independent assignments</h2><p>Open any course and choose its <strong>Practical & Assessment</strong> module. Each course includes an independent assignment with a 20-mark self-assessment rubric.</p><p><a class="btn btn-primary" href="#/explore">Choose a course</a></p></div></section>
      <section class="tab-panel" data-tab-panel="projects"><div class="card"><h2>Portfolio projects</h2><p>Every course includes a mini project that requires planning, building, testing, improving and presenting evidence of your work.</p><p><a class="btn btn-primary" href="#/learn">Open My Learning</a></p></div></section>
      <section class="tab-panel" data-tab-panel="mastery"><div class="card"><h2>Mastery standard</h2><p>Use course assessments to combine definitions, explanation, application and evaluation. Aim for at least 70% plus completed practical work before treating the course as mastered.</p></div></section>
    </div>`;
  }

  function viewLibrary() {
    return `<div class="wrap"><h1>Library</h1>
      <div class="grid grid-4">${window.ETHAN_SUBJECTS.map((s)=>`<article class="card course-card" data-go="#/subject/${s.id}"><h3>${esc(s.name)}</h3><p>${esc((s.topics||[]).slice(0,3).join(" · "))}</p></article>`).join("")}</div>
    </div>`;
  }

  function viewNigeriaCurriculum() {
    const all = window.ETHAN_NIGERIA_COURSES || [];
    const stages = [
      {key:"Primary", label:"Primary School 1–6", note:"English Studies, Mathematics and Basic Science; Basic Science & Technology and Basic Digital Literacy are added in the upper-primary pathway."},
      {key:"JSS", label:"Junior Secondary School 1–3", note:"English Studies, Mathematics, Intermediate Science, Digital Technologies and Business Studies."},
      {key:"SS", label:"Senior Secondary School 1–3", note:"English Language and General Mathematics plus Citizenship & Heritage Studies and Digital Technologies, with detailed Biology, Chemistry, Physics and Commerce pathways."}
    ];
    const lessonCount = all.reduce((n,c)=>n+(c.modules||[]).reduce((m,x)=>m+(x.lessons||[]).length,0),0);
    return `<div class="wrap">
      <section class="curriculum-hero nigeria-hero"><span class="badge">Nigeria First</span><h1>Nigerian Curriculum Pathway — Primary 1 to SS3</h1>
      <p>A class-by-class learning route designed around current NERDC curriculum offerings, the 9-year Basic Education progression and senior-secondary preparation. Every course contains taught lessons, guided practice, quizzes and progression to the next class.</p>
      <div class="curriculum-stats"><strong>${all.length}</strong> Nigerian class/subject courses · <strong>${lessonCount}</strong> taught/practice lessons · Primary 1 → SS3</div></section>
      <div class="card nigeria-notice"><strong>Current curriculum structure:</strong> NERDC's current offering names Basic Science in Primary 1–3, Basic Science & Technology plus Basic Digital Literacy in Primary 4–6, Intermediate Science and Digital Technologies at JSS, and English Language, General Mathematics, Citizenship & Heritage Studies and Digital Technologies among senior compulsory subjects. Biology, Chemistry and Physics sit in the Science field; Commerce sits in Business.</div>
      ${stages.map(s=>{const cs=all.filter(c=>c.nigeriaStage===s.key);return `<section class="section"><h2>${s.label}</h2><p>${s.note}</p><div class="class-jump">${[...new Set(cs.map(c=>c.nigeriaYear))].map(y=>`<a class="chip" href="#ng-${y.replace(/\s+/g,'-').toLowerCase()}">${y}</a>`).join("")}</div>${[...new Set(cs.map(c=>c.nigeriaYear))].map(y=>`<div id="ng-${y.replace(/\s+/g,'-').toLowerCase()}" class="nigeria-class-block"><h3>${y}</h3><div class="grid grid-3">${cs.filter(c=>c.nigeriaYear===y).map(courseCard).join("")}</div></div>`).join("")}</section>`}).join("")}
      <section class="section"><div class="card"><h2>Assessment and examination use</h2><p>ETHAN Learn teaches the knowledge and reasoning behind the curriculum. For BECE, WAEC, NECO or any specific school examination, learners should also check the latest official examination specification and school scheme of work for their examination year.</p></div></section>
    </div>`;
  }

  function viewCurriculum() {
    const frameworks = window.ETHAN_CURRICULUM_FRAMEWORKS || [];
    const coreIds = window.ETHAN_CORE_CURRICULUM_IDS || [];
    const core = coreIds.map(courseById).filter(Boolean);
    const totalLessons = core.reduce((n,c)=>n+(c.modules||[]).reduce((m,x)=>m+(x.lessons||[]).length,0),0);
    return `<div class="wrap">
      <section class="curriculum-hero">
        <span class="badge">Global Curriculum</span>
        <h1>Core subjects taught in depth</h1>
        <p>ETHAN Learn combines the shared concepts found across major secondary-school systems while keeping each lesson focused on understanding, worked reasoning, guided practice and mastery.</p>
        <div class="curriculum-stats"><strong>${core.length}</strong> comprehensive core courses · <strong>${totalLessons}</strong> taught lessons · <strong>${frameworks.length}</strong> regional/international framework groups</div>
      </section>
      <section class="section"><h2>Curriculum coverage</h2><div class="grid grid-3">${frameworks.map(f=>`<article class="card"><h3>${esc(f.name)}</h3><p>${esc((f.regions||[]).join(" · "))}</p><p class="meta">${esc((f.standards||[]).join(" · "))}</p></article>`).join("")}</div></section>
      <section class="section"><h2>Comprehensive core subjects</h2><div class="grid grid-3">${core.map(courseCard).join("")}</div></section>
      <section class="section"><div class="card"><h2>How alignment works</h2><p>These courses are comparative learning pathways, not copies of any single syllabus. They cover common concepts and skills appearing across West African, South African, Cambridge, IB, North American, Asian, Oceanian, South American and UK/European secondary education. Schools and examination candidates should still check the latest official specification for their exact board and examination year.</p></div></section>
    </div>`;
  }

  function viewPaths() {
    return `<div class="wrap"><h1>Learning Paths</h1>
      <div class="grid grid-3">${window.ETHAN_PATHS.map((p)=>`<article class="card course-card" data-go="#/path/${p.id}"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></article>`).join("")}</div>
    </div>`;
  }

  function viewPath(id) {
    const p = window.ETHAN_PATHS.find((x) => x.id === id);
    if (!p) return `<div class="wrap">Path not found.</div>`;
    const courses = p.courses.map(courseById).filter(Boolean);
    return `<div class="wrap"><h1>${esc(p.title)}</h1><p>${esc(p.description)}</p>
      <p class="meta">${(p.skills||[]).join(" · ")}</p>
      <div class="grid grid-3">${courses.map(courseCard).join("")}</div></div>`;
  }

  function viewCertificate(id) {
    const c = courseById(id);
    if (!c) return `<div class="wrap">Missing course.</div>`;
    if (!ProgressService.canCertificate(id)) {
      return `<div class="wrap"><h1>Certificate not available</h1><p>Complete every lesson and score at least 60% on lesson quizzes. Refreshing the page does not grant completion.</p><a href="#/course/${id}">Back to course</a></div>`;
    }
    const s = StorageService.get();
    const certId = "EL-" + id.slice(0, 4).toUpperCase() + "-" + String(s.enrolled[id].completedAt || Date.now()).slice(-6);
    return `<div class="wrap"><div class="cert">
      <p>ETHAN Learn · Ethan Digital Academy</p>
      <h1>Certificate of Completion</h1>
      <p>This is to recognize</p>
      <h2>${esc(s.profile.name)}</h2>
      <p>for completing</p>
      <h3>${esc(c.title)}</h3>
      <p>Date: ${new Date(s.enrolled[id].completedAt || Date.now()).toLocaleDateString()}</p>
      <p>Certificate ID: ${esc(certId)}</p>
      <p class="meta">Verification placeholder — connect a registry later.</p>
    </div></div>`;
  }

  function viewTeachers() {
    const s = StorageService.get();
    const list = s.teacherCourses || [];
    return `<div class="wrap"><h1>For Teachers</h1>
      <p>Local course drafts. Cloud class enrollment requires a future backend.</p>
      <form id="t-form" class="card">
        <div class="field"><label>Title <input name="title" required></label></div>
        <div class="field"><label>Description <textarea name="desc" required></textarea></label></div>
        <button class="btn btn-primary" type="submit">Create draft course</button>
      </form>
      <div class="grid" style="margin-top:16px">${list.map((x)=>`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><button class="btn teacher-delete" data-id="${esc(x.id)}">Delete draft</button></article>`).join("") || "<p class='meta'>No drafts yet.</p>"}</div>
    </div>`;
  }

  function viewProfile() {
    const p = StorageService.get().profile;
    return `<div class="wrap"><h1>Profile</h1>
      <form id="prof-form" class="card">
        <div class="field"><label>Display name <input name="name" value="${esc(p.name)}"></label></div>
        <div class="field"><label>Learner type
          <select name="learnerType">${["Kids","Primary School","Secondary School","College/University","Professional","Entrepreneur","Teacher","Lifelong Learner"].map((t)=>`<option ${t===p.learnerType?"selected":""}>${t}</option>`).join("")}</select>
        </label></div>
        <div class="field"><label>Role (local only)
          <select name="role"><option value="learner">Learner</option><option value="teacher" ${p.role==="teacher"?"selected":""}>Teacher</option></select>
        </label></div>
        <div class="field"><label>Level <select name="level">${["Beginner","Intermediate","Advanced"].map(x=>`<option ${x===p.level?"selected":""}>${x}</option>`).join("")}</select></label></div>
        <div class="field"><label>Goal <select name="goal">${["School","Career","Business","Certification","Personal development"].map(x=>`<option ${x===p.goal?"selected":""}>${x}</option>`).join("")}</select></label></div>
        <p class="meta">${p.local ? "Local profile — cloud sync is not active." : "Cloud account — learning progress sync is enabled."}</p>
        <button class="btn btn-primary" type="submit">Save</button> <button class="btn" type="button" id="signout-local">Sign Out</button>
      </form>
    </div>`;
  }

  function viewSettings() {
    const s = StorageService.get();
    return `<div class="wrap"><h1>Settings</h1>
      <div class="card">
        <label><input type="checkbox" id="lowdata" ${s.lowData?"checked":""}> Low Data Mode</label>
        <div class="field"><label>Weekly learning goal (hours)<input id="weekly-goal" type="number" min="1" max="40" value="${s.weeklyGoalHours||5}"></label></div>
        <hr style="border:0;border-top:1px solid var(--border);margin:18px 0">
        <h2>Optional Voice Commands</h2>

        <p class="meta">Use lesson audio to hear course content aloud. Voice commands are optional and only request microphone access when you activate them.</p>
        <div class="voice-panel">
          <div class="voice-status" data-voice-status>Voice off</div>
          <div class="voice-transcript" data-voice-transcript>Your spoken command will appear here.</div>
          <div class="voice-controls">
            <button class="btn btn-primary" type="button" id="settings-voice-toggle">Activate Voice</button>
            <button class="btn" type="button" id="voice-help-btn">Voice Help</button>
            <button class="btn" type="button" id="voice-stop-speaking">Stop Speaking</button>
          </div>
          <label style="display:block;margin-top:12px"><input type="checkbox" id="voice-auto-speak" ${(s.voice?.autoSpeak ?? true)?"checked":""}> Speak ETHAN Tutor answers aloud</label>
          <div class="field"><label>Voice language
            <select id="voice-language">
              <option value="en-US" ${(s.voice?.language||"en-US")==="en-US"?"selected":""}>English (US)</option>
              <option value="en-GB" ${s.voice?.language==="en-GB"?"selected":""}>English (UK)</option>
              <option value="en-NG" ${s.voice?.language==="en-NG"?"selected":""}>English (Nigeria)</option>
            </select>
          </label></div>
          <div class="field"><label>Lesson reading voice
            <select data-listen-voice><option value="">Automatic best voice</option></select>
          </label></div>
          <div class="field"><label>Lesson reading speed
            <select data-listen-rate><option value="0.82">Slow</option><option value="0.95">Normal</option><option value="1.08">Fast</option><option value="1.2">Faster</option></select>
          </label></div>
        </div>
        <p class="meta">Reduces extra visuals and motion.</p>
        <p><a href="#/profile">Profile</a> · <a href="#/about">About ETHAN Learn</a></p>
        <p><button class="btn" id="install-btn">Install ETHAN Learn</button></p>
        <p><button class="btn" id="reset-btn">Reset local data</button></p>
      </div>
    </div>`;
  }

  function viewAbout() {
    return `<div class="wrap"><h1>About ETHAN Learn</h1>
      <p>ETHAN Learn is a global learning platform built around a simple standard: learners should understand, practise, apply and prove what they know — not merely search for information.</p>
      <p>Its learning experience combines structured courses, curriculum pathways, practical work, assignments, projects, quizzes, progress tracking, study tools and offline-ready PWA access.</p>
      <p><strong>Learn. Practice. Grow.</strong> Knowledge and Skills for Everyone.</p>
      <p>A Product of Ethan Digital Academy.</p>
    </div>`;
  }

  function viewOnboard() {
    return `<div class="wrap"><div class="card" style="max-width:560px;margin:40px auto;text-align:center">
      <img src="assets/icons/icon-96.png" width="72" height="72" alt="">
      <h1>Welcome to ETHAN Learn</h1>
      <p>Learn. Practice. Grow.</p>
      <p><button class="btn btn-primary" data-go="#/onboarding">Start Learning</button>
      <button class="btn" id="skip-on">Explore Courses</button></p>
    </div></div>`;
  }

  function viewOnboardingForm() {
    return `<div class="wrap"><h1>What do you want to learn?</h1>
      <form id="on-form" class="card">
        <p>Select interests</p>
        ${["Technology","Business","Science","Mathematics","Languages","Marketing","Creative Skills","Career Skills"].map((i)=>`<label style="display:block"><input type="checkbox" name="int" value="${i}"> ${i}</label>`).join("")}
        <div class="field"><label>Current level
          <select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
        </label></div>
        <div class="field"><label>Learning goal
          <select name="goal"><option>School</option><option>Career</option><option>Business</option><option>Certification</option><option>Personal development</option></select>
        </label></div>
        <button class="btn btn-primary" type="submit">See recommendations</button>
        <button class="btn" type="button" id="skip-on">Skip</button>
      </form>
    </div>`;
  }

  function viewAuth() {
    const cloud = AuthService.configured;
    return `<div class="wrap"><div class="card" style="max-width:460px;margin:20px auto">
      <h1>${cloud ? "ETHAN Learn Account" : "Local Learning Profile"}</h1>
      <p class="meta">${cloud ? "Sign in to sync learning progress securely across your devices." : "Cloud accounts are ready in the code but need your Supabase project URL and publishable key in config.js."}</p>
      ${cloud ? `<form id="auth-form">
        <div class="field"><label>Display name <input name="name" placeholder="Your name"></label></div>
        <div class="field"><label>Email <input name="email" type="email" required autocomplete="email"></label></div>
        <div class="field"><label>Password <input name="password" type="password" required minlength="8" autocomplete="current-password"></label></div>
        <p><button class="btn btn-primary" name="action" value="signin" type="submit">Sign In</button> <button class="btn" name="action" value="signup" type="submit">Create Account</button></p>
        <button class="btn btn-ghost" type="button" id="forgot-password">Forgot password?</button>
      </form>` : `<form id="auth-form"><div class="field"><label>Name <input name="name" required placeholder="Your name"></label></div><button class="btn btn-primary" type="submit">Continue locally</button></form>`}
      <p><a href="#/">Back home</a></p>
    </div></div>`;
  }

  function afterRender(route, parts) {
    bindGo(app);
    window.EthanPracticeLab?.attach?.(app);
    // Functional tabs used across Course, My Learning and Practice.
    app.querySelectorAll("[data-tab-target]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const target=btn.getAttribute("data-tab-target");
        const wrap=btn.closest(".course-page,.wrap") || app;
        wrap.querySelectorAll("[data-tab-target]").forEach(b=>{
          const on=b===btn; b.classList.toggle("active",on); b.setAttribute("aria-selected",on?"true":"false");
        });
        wrap.querySelectorAll("[data-tab-panel]").forEach(p=>p.classList.toggle("active",p.getAttribute("data-tab-panel")===target));
      });
    });
    const more=app.querySelector("#load-more-courses");
    if(more){
      let shown=48;
      more.addEventListener("click",()=>{
        const all=SearchService.query(searchQueryFromUrl()).courses;
        const fSub=app.querySelector("#f-subject"), fLvl=app.querySelector("#f-level");
        let list=all.slice();
        if(fSub?.value) list=list.filter(c=>c.subject===fSub.value);
        if(fLvl?.value) list=list.filter(c=>c.level===fLvl.value);
        shown+=48;
        const grid=app.querySelector("#explore-grid");
        grid.innerHTML=list.slice(0,shown).map(courseCard).join("")||emptyExplore();
        bindGo(grid);
        if(shown>=list.length) more.parentElement.remove();
      });
    }
    const hero = app.querySelector("#hero-search");
    if (hero) {
      hero.addEventListener("submit", (e) => {
        e.preventDefault();
        go("/explore?q=" + encodeURIComponent(hero.q.value || ""));
      });
    }
    app.querySelectorAll("[data-suggest]").forEach((b) => b.addEventListener("click", () => go("/explore?q=" + encodeURIComponent(b.getAttribute("data-suggest")))));
    const exp = app.querySelector("#exp-search");
    if (exp) {
      exp.addEventListener("submit", (e) => {
        e.preventDefault();
        go("/explore?q=" + encodeURIComponent(exp.q.value || ""));
      });
    }
    const fSub = app.querySelector("#f-subject");
    const fLvl = app.querySelector("#f-level");
    const fSort = app.querySelector("#f-sort");
    if (fSub) {
      const apply = () => {
        let list = SearchService.query(searchQueryFromUrl()).courses.slice();
        if (fSub.value) list = list.filter((c) => c.subject === fSub.value);
        if (fLvl.value) list = list.filter((c) => c.level === fLvl.value);
        if (fSort.value === "az") list.sort((a,b)=>a.title.localeCompare(b.title));
        if (fSort.value === "new") list = list.slice().reverse();
        app.querySelector("#explore-grid").innerHTML = list.slice(0,48).map(courseCard).join("") || emptyExplore();
        bindGo(app.querySelector("#explore-grid"));
      };
      fSub.onchange = fLvl.onchange = fSort.onchange = apply;
    }
    const start = app.querySelector("#start-course");
    if (start) {
      start.onclick = () => {
        const id = parts[1];
        ProgressService.enroll(id);
        const c = courseById(id);
        const first = ProgressService.courseLessons(c)[0];
        toast("Enrolled");
        if (first) go("/lesson/" + id + "/" + first.id);
      };
    }
    const saveC = app.querySelector("#save-course");
    if (saveC) saveC.onclick = () => { const id=parts[1], s=StorageService.get(); if(s.savedCourses.includes(id)){ProgressService.unsaveCourse(id);toast("Removed from saved courses");}else{ProgressService.saveCourse(id);toast("Saved for later");} render(); };
    const mark = app.querySelector("#mark-complete");
    if (mark) {
      mark.onclick = () => {
        const c = courseById(parts[1]);
        const found = findLesson(c, parts[2]);
        ProgressService.enroll(c.id);
        const fresh=ProgressService.markLesson(c.id, parts[2], found.lesson.minutes);
        toast(fresh ? "Lesson marked complete" : "Lesson was already completed");
        render();
      };
    }
    const tq = app.querySelector("#take-quiz");
    if (tq) tq.onclick = () => {
      const c = courseById(parts[1]);
      const found = findLesson(c, parts[2]);
      const box = app.querySelector("#quiz-box");
      if (!found.lesson.quiz) { toast("No quiz on this lesson"); return; }
      renderQuiz(box, c, found.lesson);
    };
    const ask = app.querySelector("#ask-ethan");
    if (ask) {
      ask.onclick = () => {
        app.querySelector("#tutor-form").hidden = false;
        app.querySelector("#tutor-box").hidden = false;
      };
    }
    const tf = app.querySelector("#tutor-form");
    if (tf) {
      tf.addEventListener("submit", async (e) => {
        e.preventDefault();
        const prompt = tf.prompt.value;
        const box = app.querySelector("#tutor-box");
        box.innerHTML += `<div class="tutor-msg user">${esc(prompt)}</div>`;
        try {
          const c = courseById(parts[1]);
          const found = findLesson(c, parts[2]);
          const voiceOrigin = tf.dataset.voiceOrigin === "1";
          tf.dataset.voiceOrigin = "0";
          const res = await AIProvider.complete([{ role: "user", content: prompt }], { lessonTitle: found.lesson.title, courseTitle: c.title, level: c.level || StorageService.get().profile.level });
          box.innerHTML += `<div class="tutor-msg">${esc(res.text)}</div>`;
          box.scrollTop = box.scrollHeight;
          window.dispatchEvent(new CustomEvent("ethan:tutor-response", { detail: { text: res.text, voiceOrigin } }));
        } catch (err) {
          box.innerHTML += `<div class="tutor-msg">We couldn't reach the tutor right now. Please try again.</div>`;
        }
        tf.reset();
      });
    }
    const voiceToggle = app.querySelector("#lesson-voice-toggle") || app.querySelector("#settings-voice-toggle");
    if (voiceToggle && window.VoiceService) voiceToggle.onclick = () => { window.VoiceService.toggle(); voiceToggle.textContent = window.VoiceService.active ? "Deactivate Voice" : "Activate Voice"; };
    const stopVoiceBtn = app.querySelector("#stop-voice");
    if (stopVoiceBtn && window.VoiceService) stopVoiceBtn.onclick = () => window.VoiceService.stopSpeaking?.();
    const voiceHelpBtn = app.querySelector("#voice-help-btn");
    if (voiceHelpBtn && window.VoiceService) voiceHelpBtn.onclick = () => window.VoiceService.speak("You can say read lesson, pause voice, resume voice, next lesson, previous lesson, mark complete, take quiz, search mathematics, or voice off.");
    const voiceStopSpeaking = app.querySelector("#voice-stop-speaking");
    if (voiceStopSpeaking && window.VoiceService) voiceStopSpeaking.onclick = () => window.VoiceService.stopSpeaking();
    const voiceAutoSpeak = app.querySelector("#voice-auto-speak");
    if (voiceAutoSpeak && window.VoiceService) voiceAutoSpeak.onchange = () => window.VoiceService.setPrefs({ autoSpeak: voiceAutoSpeak.checked });
    const voiceLanguage = app.querySelector("#voice-language");
    if (voiceLanguage && window.VoiceService) voiceLanguage.onchange = () => window.VoiceService.setPrefs({ language: voiceLanguage.value });
    window.VoiceService?.attachUI?.();
    const sn = app.querySelector("#save-note");
    if (sn) sn.onclick = () => {
      const text = app.querySelector("#note-area").value;
      StorageService.update((st) => { st.notes[parts[1] + ":" + parts[2]] = text; });
      toast("Note saved on this device");
    };
    const bm = app.querySelector("#bookmark");
    if (bm) bm.onclick = () => {
      const key = parts[1] + ":" + parts[2];
      StorageService.update((st) => {
        const i = st.bookmarks.indexOf(key);
        if (i >= 0) st.bookmarks.splice(i, 1); else st.bookmarks.push(key);
      });
      render();
    };
    const fc = app.querySelector("#make-flashcard");
    if (fc) fc.onclick = () => { const c=courseById(parts[1]), f=findLesson(c,parts[2]); const front=prompt("Flashcard question or prompt:",f.lesson.title); if(!front)return; const back=prompt("Flashcard answer:","Write the key idea in your own words."); if(!back)return; StorageService.update(s=>s.flashcards.push({front:front.slice(0,180),back:back.slice(0,400),courseId:c.id,lessonId:f.lesson.id,at:Date.now()})); toast("Flashcard saved"); };
    app.querySelectorAll(".flash-delete").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);StorageService.update(s=>s.flashcards.splice(i,1));render();});
    app.querySelectorAll(".teacher-delete").forEach(b=>b.onclick=()=>{if(confirm("Delete this local draft?")){StorageService.update(s=>{s.teacherCourses=s.teacherCourses.filter(x=>x.id!==b.dataset.id);});render();}});
    const tform = app.querySelector("#t-form");
    if (tform) tform.addEventListener("submit", (e) => {
      e.preventDefault();
      StorageService.update((st) => {
        st.teacherCourses.push({ id: "t-" + Date.now(), title: tform.title.value, desc: tform.desc.value });
      });
      toast("Draft saved locally");
      render();
    });
    const pf = app.querySelector("#prof-form");
    if (pf) pf.addEventListener("submit", (e) => {
      e.preventDefault();
      StorageService.update((st) => {
        st.profile.name = pf.name.value;
        st.profile.learnerType = pf.learnerType.value;
        st.profile.role = pf.role.value;
        st.profile.level = pf.level.value;
        st.profile.goal = pf.goal.value;
      });
      toast("Profile updated (local)");
      render();
    });
    const so=app.querySelector("#signout-local"); if(so) so.onclick=async()=>{await AuthService.signOut();toast("Signed out");render();};
    const wg=app.querySelector("#weekly-goal"); if(wg) wg.onchange=()=>{const n=Math.max(1,Math.min(40,Number(wg.value)||5));StorageService.update(s=>s.weeklyGoalHours=n);wg.value=n;toast("Weekly goal updated");};
    const ld = app.querySelector("#lowdata");
    if (ld) ld.onchange = () => {
      StorageService.update((st) => { st.lowData = ld.checked; });
      document.documentElement.classList.toggle("low-data", ld.checked);
    };
    const ib = app.querySelector("#install-btn");
    if (ib) ib.onclick = () => InstallService.prompt();
    const rb = app.querySelector("#reset-btn");
    if (rb) rb.onclick = () => { if (confirm("Reset all local progress?")) { StorageService.reset(); render(); } };
    const skip = app.querySelector("#skip-on");
    if (skip) skip.onclick = () => { StorageService.update((st) => { st.onboarded = true; }); go("/explore"); };
    const onf = app.querySelector("#on-form");
    if (onf) onf.addEventListener("submit", (e) => {
      e.preventDefault();
      const ints = [...onf.querySelectorAll("input[name=int]:checked")].map((x) => x.value);
      StorageService.update((st) => {
        st.onboarded = true;
        st.profile.interests = ints;
        st.profile.level = onf.level.value;
        st.profile.goal = onf.goal.value;
      });
      go("/");
    });
    const af = app.querySelector("#auth-form");
    if (af) af.addEventListener("submit", async (e) => {
      e.preventDefault();
      if(!AuthService.configured){ AuthService.signInLocal(af.name.value,"learner"); toast("Local profile ready"); go("/learn"); return; }
      const action=e.submitter?.value||"signin";
      try{
        if(action==="signup"){const r=await AuthService.signUp(af.name.value,af.email.value,af.password.value);toast(r.session?"Account created and signed in":"Account created. Check your email if confirmation is required.");}
        else {await AuthService.signIn(af.email.value,af.password.value);toast("Signed in. Syncing your learning progress.");}
        await CloudSyncService.syncNow(); go("/learn");
      }catch(err){toast(err.message||"Account request failed");}
    });
    const fp=app.querySelector("#forgot-password"); if(fp) fp.onclick=async()=>{const email=af?.email?.value;if(!email){toast("Enter your email first");return;}try{await AuthService.forgot(email);toast("Password reset email sent");}catch(err){toast(err.message||"Could not send reset email");}};
  }

  function searchQueryFromUrl() {
    const raw = location.hash.split("?")[1] || "";
    const params = new URLSearchParams(raw);
    return params.get("q") || "";
  }

  function render() {
    const { parts } = parseHash();
    const route = parts[0] || "home";
    setActiveNav(route === "learn" ? "learn" : route);
    document.documentElement.classList.toggle("low-data", !!StorageService.get().lowData);
    let html = "";
    switch (route) {
      case "explore": html = viewExplore(searchQueryFromUrl()); break;
      case "subjects": html = viewLibrary(); break;
      case "nigeria": html = viewNigeriaCurriculum(); break;
      case "curriculum": html = viewCurriculum(); break;
      case "subject": html = viewSubject(parts[1]); break;
      case "course": html = viewCourse(parts[1]); break;
      case "lesson": html = viewLesson(parts[1], parts[2]); break;
      case "practice": html = viewPractice(); break;
      case "paths": html = viewPaths(); break;
      case "path": html = viewPath(parts[1]); break;
      case "learn":
      case "my-learning": html = viewMyLearning(); break;
      case "dashboard": html = viewDashboard(); break;
      case "library": html = viewLibrary(); break;
      case "teachers": html = viewTeachers(); break;
      case "profile": html = viewProfile(); break;
      case "settings": html = viewSettings(); break;
      case "about": html = viewAbout(); break;
      case "welcome": html = viewOnboard(); break;
      case "onboarding": html = viewOnboardingForm(); break;
      case "signin":
      case "account": html = viewAuth(); break;
      case "certificate": html = viewCertificate(parts[1]); break;
      default: html = viewHome();
    }
    try{
      app.innerHTML = html;
      afterRender(route, parts);
      window.dispatchEvent(new CustomEvent("ethan:rendered",{detail:{route,parts}}));
    }catch(err){
      console.error("ETHAN Learn render error",err);
      app.innerHTML=`<div class="wrap"><div class="error-state"><h1>We recovered this page</h1><p>A page component failed to load, but your saved progress is safe.</p><p><a class="btn btn-primary" href="#/">Go Home</a> <a class="btn" href="#/explore">Courses</a></p></div></div>`;
    }
    const profile=StorageService.get().profile;
    const signin=document.querySelector('.header-actions a[href="#/signin"]');
    const account=document.querySelector('.header-actions a[href="#/account"]');
    if(signin) signin.textContent=profile.name&&profile.name!=="Local learner"&&profile.name!=="Guest"?profile.name:"Sign In";
    if(account){account.textContent=profile.name&&profile.name!=="Local learner"&&profile.name!=="Guest"?"Profile":"Create Account";account.href=profile.name&&profile.name!=="Local learner"&&profile.name!=="Guest"?"#/profile":"#/account";}
    try{window.scrollTo(0,0);}catch(_){}
  }

  window.addEventListener("hashchange", render);
  if (!location.hash) {
    if (!StorageService.get().onboarded) location.hash = "#/welcome";
    else location.hash = "#/";
  }
  render();

  document.getElementById("header-search-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = document.getElementById("header-q").value;
    go("/explore?q=" + encodeURIComponent(v));
  });
  document.getElementById("install-banner-btn")?.addEventListener("click", () => InstallService.prompt());
  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    const d=document.getElementById("mobile-drawer"); d.classList.add("open"); d.setAttribute("aria-hidden","false");
    document.getElementById("drawer-close")?.focus();
  });
  document.getElementById("drawer-close")?.addEventListener("click", () => {
    const d=document.getElementById("mobile-drawer"); d.classList.remove("open"); d.setAttribute("aria-hidden","true");
  });
  document.querySelectorAll("#mobile-drawer a").forEach(a=>a.addEventListener("click",()=>{const d=document.getElementById("mobile-drawer");d.classList.remove("open");d.setAttribute("aria-hidden","true");}));
  document.addEventListener("keydown",(e)=>{if(e.key==="Escape"){const d=document.getElementById("mobile-drawer");d?.classList.remove("open");d?.setAttribute("aria-hidden","true");}});
  document.getElementById("mobile-drawer")?.addEventListener("click", (e) => {
    if (e.target.id === "mobile-drawer") e.target.classList.remove("open");
  });
})();
