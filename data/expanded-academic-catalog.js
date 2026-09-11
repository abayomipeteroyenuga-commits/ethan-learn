(function(){
"use strict";
window.ETHAN_SUBJECTS=window.ETHAN_SUBJECTS||[];
window.ETHAN_COURSES=window.ETHAN_COURSES||[];

const SUBJECTS=[
 {id:"arts",name:"Arts & Humanities",group:"AA",topics:["Visual Arts","Drawing","Painting","Sculpture","Ceramics","Textile Arts","Art History","Music","Drama","Film","Photography","Creative Writing","Cultural Studies","Philosophy"]},
 {id:"commercial",name:"Commercial Studies",group:"AB",topics:["Commerce","Accounting","Bookkeeping","Economics","Business Mathematics","Office Practice","Marketing","Banking","Insurance","Entrepreneurship","Taxation","Auditing","Retail","Logistics"]},
 {id:"literature",name:"Literature",group:"AC",topics:["Literature in English","Prose","Poetry","Drama","African Literature","Nigerian Literature","World Literature","Oral Literature","Literary Criticism","Comparative Literature","Literary Essay Writing"]}
];
for(const s of SUBJECTS)if(!window.ETHAN_SUBJECTS.some(x=>x.id===s.id))window.ETHAN_SUBJECTS.push(s);

const DATA={"science": ["Integrated Science", "General Biology", "Cell Biology", "Human Biology", "Genetics", "Ecology", "Botany", "Zoology", "Microbiology Fundamentals", "Biotechnology Foundations", "Anatomy & Physiology Foundations", "Health Science Foundations", "Nutrition Science Foundations", "General Chemistry", "Inorganic Chemistry Foundations", "Organic Chemistry Foundations", "Physical Chemistry Foundations", "Analytical Chemistry Foundations", "General Physics", "Mechanics", "Electricity & Magnetism", "Waves & Optics", "Thermal Physics", "Modern Physics Foundations", "Earth Science", "Geology Foundations", "Meteorology & Climate", "Astronomy", "Agricultural Science", "Environmental Science", "Scientific Research & Laboratory Skills"], "arts": ["Visual Arts", "Drawing Fundamentals", "Painting Fundamentals", "Sculpture Fundamentals", "Ceramics Fundamentals", "Textile & Fashion Arts", "Graphic Arts", "Art History", "African Art & Culture", "Nigerian Art & Heritage", "Music Theory", "Music Appreciation", "Drama & Theatre", "Theatre Production", "Film Studies", "Photography Fundamentals", "Creative Writing", "Cultural Studies", "Philosophy Foundations", "Performing Arts", "Media Arts", "Art Criticism & Appreciation"], "commercial": ["Commerce", "Principles of Accounts", "Bookkeeping", "Economics", "Business Mathematics", "Office Practice", "Secretarial Studies", "Marketing", "Sales Management", "Banking", "Insurance", "Entrepreneurship", "Business Law Foundations", "Taxation Foundations", "Auditing Foundations", "Cost Accounting", "Management Accounting", "Financial Accounting", "Public Sector Accounting Foundations", "Business Finance", "E-commerce", "Retail Management", "Logistics & Distribution", "Consumer Education"], "business": ["Business Administration", "Principles of Management", "Leadership & Team Management", "Human Resource Management", "Organizational Behaviour", "Operations Management", "Project Management", "Product Management", "Business Strategy", "Business Analytics", "International Business", "Small Business Management", "Startup Management", "Innovation & Entrepreneurship", "Procurement Management", "Supply Chain Management", "Customer Experience Management", "Service Management", "Negotiation Skills", "Corporate Governance", "Business Ethics", "Business Communication", "Business Development", "Sales & CRM"], "literature": ["Literature in English", "Prose Studies", "Poetry Studies", "Drama Studies", "African Literature", "Nigerian Literature", "World Literature", "Oral Literature", "Literary Terms & Devices", "Literary Criticism", "Comparative Literature", "Shakespeare Studies", "Modern Drama", "Novel Studies", "Short Story Studies", "Poetry Analysis", "Drama Analysis", "Creative Reading", "Literature & Society", "Postcolonial Literature Foundations", "Children's Literature", "Literary Essay Writing"]};

function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
function slug(s){return String(s||"course").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70)}
function Q(id,q,opts,ans,ex){return {id,type:"mcq",question:q,options:opts,answer:ans,explanation:ex}}
function L(id,title,minutes,body,quiz){return {id,title,minutes,body,quiz}}
function streamText(stream,title){
 const safeTitle=esc(title);
 if(stream==="science")return {
  overview:`${safeTitle} is studied through evidence, observation, models, measurement, explanation and safe investigation.`,
  practical:`Use teacher-approved observations, supplied data, diagrams or a safe virtual simulation. Record a question, variables, observations, results and conclusion. Do not handle unknown chemicals or unsafe equipment.`,
  apply:`Connect ${safeTitle} to a real phenomenon, explain the evidence and identify what would make the conclusion stronger.`,
  project:`Create a mini investigation report, model, labelled diagram, data display or science communication poster based on ${safeTitle}.`
 };
 if(stream==="arts")return {
  overview:`${safeTitle} develops observation, interpretation, technique, creativity, cultural understanding and reflective judgement.`,
  practical:`Create a small original study, sketch, performance plan, visual analysis, storyboard, composition or critique connected to ${safeTitle}.`,
  apply:`Compare two approaches, explain the choices you notice and produce your own response using at least two principles from the lesson.`,
  project:`Build a portfolio piece with a brief, first draft, revision, final output and a short reflection on your choices.`
 };
 if(stream==="commercial")return {
  overview:`${safeTitle} develops commercial judgement through records, calculations, documents, markets, institutions and business decisions.`,
  practical:`Complete a realistic commercial task such as a source document, ledger entry, calculation, comparison table, pricing decision, customer scenario or transaction analysis.`,
  apply:`Use ${safeTitle} to solve a practical business situation, show your working and explain the decision.`,
  project:`Prepare a portfolio-ready business document, analysis sheet, calculation model or case response and check it for accuracy.`
 };
 if(stream==="business")return {
  overview:`${safeTitle} develops decision-making, planning, communication, analysis and execution in real organisations.`,
  practical:`Work through a realistic organisation or small-business scenario. Define the objective, evidence, options, decision, risks and measures of success.`,
  apply:`Apply ${safeTitle} to a new case and justify your recommendation with evidence.`,
  project:`Create a one-page professional plan, dashboard, process map, proposal or decision memo connected to ${safeTitle}.`
 };
 return {
  overview:`${safeTitle} develops close reading, interpretation, evidence-based argument, context and clear written response.`,
  practical:`Analyse a short original or public-domain-friendly example by identifying form, language, structure, theme, tone and effect. Support every claim with evidence.`,
  apply:`Compare interpretations, explain which evidence supports each view and write your own short analytical response.`,
  project:`Create a literature portfolio entry: reading notes, quotation-free evidence summary, analytical paragraph, alternative interpretation and reflection.`
 };
}
function makeCourse(stream,subject,title,index){
 const id=`${subject}-expanded-${slug(title)}`;
 const T=streamText(stream,title),st=esc(title);
 const prefix=id;
 return {
  id,title,subject,level:index%4===0?"Intermediate":"Beginner",durationHours:9+(index%4)*2,
  learnerTypes:["Secondary School","College/University","Professional","Teacher","Lifelong Learner"],
  language:"English",premium:false,academicExpansion:true,
  description:`A structured ${stream==="literature"?"literature":stream} course covering foundations, core methods, practical work, independent tasks and mastery assessment in ${title}.`,
  objectives:[
   `Explain the major concepts and terminology in ${title}`,
   `Apply standard methods or analytical approaches used in ${title}`,
   `Complete practical or independent work connected to ${title}`,
   `Evaluate work, correct errors and present evidence of learning`
  ],
  prerequisites:["Curiosity and willingness to practise"],
  modules:[
   {id:prefix+"-m1",title:"Foundations & Core Ideas",lessons:[
    L(prefix+"-l1",`What ${title} Means`,22,`<h2>${st}: Meaning and Scope</h2><p>${T.overview}</p><h3>Study questions</h3><ul><li>What is the field trying to understand or achieve?</li><li>What vocabulary must a learner know?</li><li>Where is this knowledge used?</li></ul><div class="kp"><strong>Do it now</strong><p>Write a three-sentence explanation of ${st} in your own words and list five important terms.</p></div>`,
      [Q(prefix+"-q1",`Which action best starts real learning in ${title}?`,["Understand the meaning and key terms","Memorise a title only","Skip examples","Avoid practice"],0,"Understanding the field and its language gives later work a strong foundation.")]),
    L(prefix+"-l2","Core Concepts and Vocabulary",24,`<h2>Core concepts</h2><p>Build a concept map for ${st}. Group ideas into definitions, principles, methods, applications and common errors.</p><h3>Work it out</h3><p>Choose six terms. Define each one, connect it to another term and give a short example.</p>`,
      [Q(prefix+"-q2","A strong concept map should:",["Show relationships between ideas","List random words only","Avoid examples","Remove key terms"],0,"Concept maps are useful because they show how ideas relate.")]),
    L(prefix+"-l3","History, Context and Importance",22,`<h2>Context</h2><p>Study how ${st} developed, why it matters today and how technology, culture, regulation or professional practice can influence it.</p><div class="kp"><strong>Do it yourself</strong><p>Create a simple timeline or context map with at least four stages, influences or important changes.</p></div>`,
      [Q(prefix+"-q3","Why study context?",["It explains why present ideas and practices developed","It replaces practical work","It makes evidence unnecessary","It means old methods are always correct"],0,"Context helps learners understand why ideas and methods exist.")])
   ]},
   {id:prefix+"-m2",title:"Methods, Reasoning & Worked Practice",lessons:[
    L(prefix+"-l4","Standard Methods and Reasoning",30,`<h2>How competent work is done</h2><p>Good work in ${st} follows a repeatable method: understand the task, select the right concepts, work carefully, check the result and explain the reasoning.</p><h3>Worked-practice routine</h3><ol><li>Restate the problem or brief.</li><li>Identify relevant ideas.</li><li>Choose a method.</li><li>Complete the steps.</li><li>Check accuracy or quality.</li><li>Explain the result.</li></ol>`,
      [Q(prefix+"-q4","What should happen before accepting a result?",["Check accuracy or quality","Submit immediately without review","Hide the method","Ignore the objective"],0,"Checking is part of competent work.")]),
    L(prefix+"-l5","Worked Example / Model Analysis",32,`<h2>Worked example</h2><p>Study a model task in ${st}. Separate the task into evidence, method, result and evaluation.</p><p>${T.apply}</p><div class="kp"><strong>Your turn</strong><p>Create a different example using the same reasoning pattern.</p></div>`,
      [Q(prefix+"-q5","What proves transfer of learning?",["Using the method on a new example","Copying the same words","Reading without doing","Skipping the check"],0,"Transfer means applying knowledge to a new task.")]),
    L(prefix+"-l6","Common Errors and How to Improve",24,`<h2>Common errors</h2><p>Errors may come from weak definitions, skipped steps, poor evidence, inaccurate calculation, unsupported interpretation, weak checking or unclear presentation.</p><h3>Error clinic</h3><p>Invent or identify three likely mistakes in ${st}. For each one, explain the consequence and the correction.</p>`,
      [Q(prefix+"-q6","The best response to an error is to:",["Find the cause, correct it and learn from it","Hide it","Repeat it","Delete all evidence"],0,"Error analysis improves mastery.")])
   ]},
   {id:prefix+"-m3",title:"Practical Studio / Lab / Casework",lessons:[
    L(prefix+"-l7","Do It Now — Guided Practical",35,`<h2>Do It Now</h2><p>${T.practical}</p><h3>Evidence checklist</h3><ul><li>Objective</li><li>Method or process</li><li>Working / observations / draft</li><li>Final result</li><li>Self-check</li></ul>`,
      [Q(prefix+"-q7","Strong practical evidence includes:",["Process and checked result","Only the lesson title","A copied sentence","No record of work"],0,"Practical evidence shows both the process and the result.")]),
    L(prefix+"-l8","Independent Work",45,`<h2>Independent Work</h2><p>${T.apply}</p><p>Complete the task without following the lesson word-for-word. Keep your working and write a short note about what you changed or improved.</p>`,
      [Q(prefix+"-q8","Independent work should:",["Use learning in a new task","Copy the model exactly","Avoid decisions","Skip reflection"],0,"Independence means making and justifying your own decisions.")]),
    L(prefix+"-l9","Mini Project / Portfolio Evidence",60,`<h2>Mini Project</h2><p>${T.project}</p><h3>Portfolio standard</h3><ol><li>Plan.</li><li>Create.</li><li>Check or test.</li><li>Improve at least twice.</li><li>Present the final work.</li><li>Reflect on what you learned.</li></ol>`,
      [Q(prefix+"-q9","What makes a portfolio piece stronger?",["Documented testing and improvement","No revision","No objective","No evidence"],0,"Revision and evidence demonstrate genuine development.")])
   ]},
   {id:prefix+"-m4",title:"Mastery, Assessment & Extension",lessons:[
    L(prefix+"-l10","Knowledge Check",25,`<h2>Knowledge Check</h2><p>Define five important terms from ${st}. Explain three major principles and give one example for each.</p><div class="kp"><strong>Mastery rule</strong><p>If you cannot explain it without copying, return to the relevant lesson and try again.</p></div>`,
      [Q(prefix+"-q10","A good knowledge check asks you to:",["Explain concepts in your own words","Copy without understanding","Skip definitions","Avoid examples"],0,"Explanation is stronger evidence than recognition alone.")]),
    L(prefix+"-l11","Application Challenge",40,`<h2>Application Challenge</h2><p>Use ${st} in a new situation. State the problem, select the method, complete the work, check it and justify your conclusion.</p><h3>Stretch</h3><p>Give a second possible approach and compare the strengths and limitations.</p>`,
      [Q(prefix+"-q11","A strong application answer should:",["Justify the method and conclusion","Give an unexplained answer","Ignore alternatives","Hide working"],0,"Reasoning and justification show understanding.")]),
    L(prefix+"-l12","Final Reflection and Next Step",20,`<h2>Final Reflection</h2><p>Review your notes, practical work, quiz results and project evidence for ${st}.</p><ul><li>What can you now do independently?</li><li>Which topic needs more practice?</li><li>What evidence best proves your learning?</li><li>What should you study next?</li></ul>`,
      [Q(prefix+"-q12","The best next step after a course is to:",["Use performance evidence to choose what to practise next","Forget the results","Repeat only easy tasks","Avoid feedback"],0,"Reflection helps direct further practice.")])
   ]}
  ]
 };
}
const MAP=[
 ["science","science",DATA.science],
 ["arts","arts",DATA.arts],
 ["commercial","commercial",DATA.commercial],
 ["business","business",DATA.business],
 ["literature","literature",DATA.literature]
];
for(const [stream,subject,list] of MAP){
 list.forEach((title,i)=>{
   const c=makeCourse(stream,subject,title,i);
   if(!window.ETHAN_COURSES.some(x=>x.id===c.id))window.ETHAN_COURSES.push(c);
 });
}
window.ETHAN_EXPANDED_ACADEMIC_SUMMARY={
 science:DATA.science.length,arts:DATA.arts.length,commercial:DATA.commercial.length,business:DATA.business.length,literature:DATA.literature.length,
 total:DATA.science.length+DATA.arts.length+DATA.commercial.length+DATA.business.length+DATA.literature.length
};
})();