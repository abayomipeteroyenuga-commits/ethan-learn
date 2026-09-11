(function(){
  "use strict";
  const courses = window.ETHAN_COURSES || [];
  const GUIDE = {"accounting": {"label": "Accounting & Finance", "definition": "Accounting is the systematic process of identifying, recording, classifying, summarising, analysing, interpreting and communicating financial information so users can make informed decisions.", "foundations": ["purpose and users of accounting information", "accounting equation: Assets = Liabilities + Equity", "double-entry principle", "source documents and books of original entry", "ledgers and trial balance", "financial statements", "adjustments and error correction", "internal control, ethics and professional judgement"], "example": "A business owner contributes ₦500,000 cash. Cash (asset) increases by ₦500,000 and owner's equity increases by ₦500,000, so the accounting equation remains balanced.", "practice": "Classify ten everyday business transactions, identify the accounts affected, decide whether each account increases or decreases, and explain the effect on the accounting equation."}, "math": {"label": "Mathematics", "definition": "Mathematics studies numbers, quantities, structures, patterns, space, change and uncertainty using logical reasoning and precise symbolic language.", "foundations": ["definitions and notation", "number sense and operations", "patterns and relationships", "algebraic reasoning", "geometry and measurement", "data, statistics and probability", "problem-solving strategies", "proof, checking and interpretation"], "example": "A strong solution states what is known, chooses a method, shows each step, checks the result and interprets the answer in context.", "practice": "Solve a representative problem in more than one way, compare the methods and verify the answer."}, "english": {"label": "English & Communication", "definition": "English language study develops the ability to listen, speak, read and write accurately, purposefully and appropriately for different audiences and situations.", "foundations": ["vocabulary", "grammar and sentence structure", "reading comprehension", "writing process", "speaking and listening", "purpose, audience and register", "literary and informational texts", "editing and communication ethics"], "example": "Effective writing moves from purpose and audience to planning, drafting, revising, editing and final presentation.", "practice": "Write a short explanation for two different audiences, then compare vocabulary, tone, structure and level of detail."}, "science": {"label": "Science", "definition": "Science is a systematic way of investigating the natural world through observation, measurement, evidence, models, experimentation and reasoned explanation.", "foundations": ["scientific questions", "measurement and units", "variables and fair tests", "evidence and data", "models and theories", "laboratory safety", "analysis and evaluation", "scientific communication"], "example": "A scientific conclusion should be supported by observations or measurements and should distinguish evidence from assumption.", "practice": "Design a safe investigation with a question, hypothesis, variables, method, data table and conclusion criteria."}, "business": {"label": "Business & Entrepreneurship", "definition": "Business studies examines how individuals and organisations create, deliver and exchange value while managing people, money, operations, customers, risk and change.", "foundations": ["needs, wants and value", "business ownership", "customers and markets", "operations", "finance", "people and leadership", "strategy and competition", "ethics and sustainability"], "example": "A business idea becomes stronger when it identifies a real customer problem, a clear value proposition, costs, revenue sources and a workable delivery process.", "practice": "Choose a small business idea and prepare a one-page model covering customer, problem, solution, costs, revenue and key risks."}, "digital": {"label": "Digital Technology", "definition": "Digital technology uses computers, software, networks and data to create, process, store, communicate and automate information and tasks.", "foundations": ["core terminology", "tools and interfaces", "workflow", "data and files", "privacy and security", "practical application", "quality checking", "responsible and ethical use"], "example": "A good digital workflow starts with a goal, selects suitable tools, protects data, produces an output and checks that the output is accurate and usable.", "practice": "Complete a small practical task, document the steps, test the result and identify one improvement."}};

  function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
  function infer(c){
    const s=((c.subject||"")+" "+(c.title||"")).toLowerCase();
    if(/account|finance|bookkeep/.test(s)) return GUIDE.accounting;
    if(/math|algebra|geometry|calculus|statistics|probability/.test(s)) return GUIDE.math;
    if(/english|writing|communication|language/.test(s)) return GUIDE.english;
    if(/biology|chemistry|physics|science|environment|astronomy/.test(s)) return GUIDE.science;
    if(/business|entrepreneur|commerce|marketing|management|sales/.test(s)) return GUIDE.business;
    if(/digital|computer|program|web|data|cyber|cloud|artificial|software|excel|word|powerpoint/.test(s)) return GUIDE.digital;
    return {
      label:"Core Knowledge",
      definition:(c.title||"This subject")+" is studied through its meaning, key concepts, terminology, principles, methods, applications and evaluation.",
      foundations:["Definition and scope","Background and development","Key terminology","Core concepts and principles","Methods and processes","Worked examples","Real-world applications","Common errors, ethics and evaluation"],
      example:"Explain the concept, apply it to a realistic example, check the result and state what the example demonstrates.",
      practice:"Create a concept map, define the major terms, complete one practical example and write a short reflection."
    };
  }

  function lesson(id,title,minutes,body,question,options,answer,explanation){
    return {id,title,minutes,body,quiz:[{id:id+"-q",type:"mcq",question,options,answer,explanation}]};
  }

  for(const c of courses){
    if(!c || !c.id || c.fullContentVersion==="1.7") continue;
    const g=infer(c), title=esc(c.title), def=esc(g.definition);
    const terms=g.foundations.map(x=>"<li>"+esc(x)+"</li>").join("");
    const prefix="full-"+c.id;

    const foundation={
      id:prefix+"-m1",
      title:"Complete Foundation: Meaning, Concepts and Application",
      lessons:[
        lesson(prefix+"-l1","Definition, Meaning, Scope and Purpose",24,
          `<h2>${title}: Definition and Meaning</h2><p>${def}</p><h3>What this course covers</h3><p>This course treats <strong>${title}</strong> as a complete field of study rather than a short overview. You will learn its language, concepts, principles, methods, examples, applications and how to evaluate your own work.</p><h3>Why it matters</h3><p>Understanding the purpose of a subject makes later facts easier to connect. Ask: What problem does this field solve? Who uses it? What decisions does it support? What knowledge or skill should a competent learner demonstrate?</p><h3>Scope</h3><ul>${terms}</ul><div class="kp"><strong>Remember</strong><p>A definition is the starting point, not the whole subject. Mastery requires explanation, application, practice and evaluation.</p></div>`,
          `Which approach best demonstrates real understanding of ${c.title}?`,
          ["Define it, explain the concepts, apply them and evaluate the result","Memorise one sentence only","Skip terminology and examples","Avoid practice"],0,
          "Complete learning combines knowledge, explanation, application and evaluation."
        ),
        lesson(prefix+"-l2","Background, Development and Real-World Importance",24,
          `<h2>Background and Development</h2><p>To understand ${title} deeply, connect present-day practice with the needs that caused the field to develop. Methods, terminology and tools change over time, but the underlying problems and principles provide continuity.</p><h3>Real-world importance</h3><p>Identify where ${title} appears in education, work, organisations, communities and everyday decision-making. Consider how technology, regulation, professional standards and social expectations affect modern practice.</p><h3>Thinking task</h3><p>Create a short timeline or development map showing at least four important stages, ideas or technologies connected with this field. Then explain which development has the greatest impact today and why.</p>`,
          "Why is background knowledge useful when learning a subject?",
          ["It helps explain why current concepts and practices exist","It removes the need for practice","It guarantees every old method is still correct","It replaces evidence"],0,
          "Background helps learners connect present practice with its development and purpose."
        ),
        lesson(prefix+"-l3","Essential Terminology and Core Concepts",28,
          `<h2>Essential Language of ${title}</h2><p>Technical subjects become easier when their vocabulary is understood precisely. Build a glossary as you progress.</p><h3>Core concept checklist</h3><ul>${terms}</ul><h3>How to learn terminology</h3><ol><li>Write the term.</li><li>Define it in clear language.</li><li>Give an example.</li><li>State a related or contrasting term.</li><li>Use the term correctly in a sentence or solution.</li></ol><h3>Practice</h3><p>Select eight important terms from this course and create glossary cards using the five-step method above.</p>`,
          "What is the strongest way to learn technical terminology?",
          ["Define each term and use it in context","Copy terms without meaning","Avoid examples","Memorise spelling only"],0,
          "Meaning plus contextual use builds stronger understanding than isolated memorisation."
        ),
        lesson(prefix+"-l4","Principles, Rules, Methods and Worked Reasoning",32,
          `<h2>From Concepts to Method</h2><p>Most fields have principles or rules that guide correct work. Do not merely memorise procedures: understand why each step is used, what information it requires and how to check the result.</p><h3>Worked reasoning model</h3><ol><li>State the problem or objective.</li><li>Identify relevant facts, concepts and terms.</li><li>Select the appropriate principle or method.</li><li>Work through the steps clearly.</li><li>Check accuracy and assumptions.</li><li>Interpret the result.</li></ol><h3>Illustration</h3><p>${esc(g.example)}</p><div class="kp"><strong>Key habit</strong><p>Always show enough reasoning that another learner can understand how the result was reached.</p></div>`,
          "What should happen after obtaining a result?",
          ["Check and interpret it","Stop immediately without checking","Hide the method","Change the question"],0,
          "Checking and interpretation are part of a complete solution."
        ),
        lesson(prefix+"-l5","Applications, Case Study and Guided Practice",34,
          `<h2>Applying ${title}</h2><p>Knowledge becomes useful when it can be transferred to realistic situations.</p><h3>Guided practice</h3><p>${esc(g.practice)}</p><h3>Case-study method</h3><ol><li>Read the situation carefully.</li><li>Separate facts from assumptions.</li><li>Identify the relevant concepts.</li><li>Apply the appropriate method.</li><li>Explain the outcome.</li><li>Suggest an improvement or alternative.</li></ol><h3>Independent application</h3><p>Choose a school, workplace, business, community or personal scenario where ${title} is relevant. Produce a one-page analysis using the six-step case-study method.</p>`,
          "What makes a case-study answer strong?",
          ["It connects facts to relevant concepts and explains the outcome","It ignores the facts","It gives an answer without reasoning","It copies unrelated material"],0,
          "Application requires selecting relevant concepts and explaining how they fit the facts."
        ),
        lesson(prefix+"-l6","Common Errors, Ethics, Quality and Mastery Review",30,
          `<h2>Common Errors and Quality Control</h2><p>Strong learners study mistakes as well as correct methods. Typical weaknesses include misunderstood terminology, skipped steps, unsupported assumptions, inaccurate data, poor checking and failure to explain conclusions.</p><h3>Ethics and responsibility</h3><p>Use information, tools and methods responsibly. Respect privacy, intellectual property, safety, accuracy and professional standards where relevant.</p><h3>Mastery review</h3><ul><li>Can I define ${title} in my own words?</li><li>Can I explain its purpose and scope?</li><li>Can I use its key terminology correctly?</li><li>Can I apply its principles to a new example?</li><li>Can I identify and correct common errors?</li><li>Can I explain ethical or quality considerations?</li></ul><h3>Final foundation task</h3><p>Prepare a two-page learner note containing a definition, key terms, concept map, worked example, practical application, common mistakes and a short self-test.</p>`,
          "Which is the best evidence of mastery?",
          ["Explaining and applying knowledge accurately in a new situation","Recognising the course title","Opening every lesson without practice","Memorising one definition"],0,
          "Mastery is demonstrated through accurate explanation, transfer and application."
        )
      ]
    };

    c.modules = Array.isArray(c.modules) ? c.modules : [];
    if(!c.modules.some(m=>m && m.id===foundation.id)) c.modules.unshift(foundation);
    c.fullContentVersion="1.7";
    c.contentMethod=["Definition","Meaning","Scope","Background","Importance","Terminology","Concepts","Principles","Methods","Worked reasoning","Applications","Guided practice","Independent practice","Common errors","Ethics","Mastery review"];
  }
})();