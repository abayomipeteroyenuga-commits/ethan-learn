(function(){
"use strict";
const courses=window.ETHAN_COURSES||[];

function q(id,question,options,answer,explanation){
  return {id,type:"mcq",question,options,answer,explanation};
}
function lesson(id,title,minutes,body,quiz){
  return {id,title,minutes,body,quiz};
}
function safe(s){return String(s||"Course");}

for(const c of courses){
  if(!c || !c.id || c.practicalAssessmentVersion==="1.8") continue;
  const title=safe(c.title), p="pa-"+c.id;

  const module={
    id:p+"-module",
    title:"Practical Work, Assignments & Assessment",
    lessons:[
      lesson(p+"-lab","Practical Workshop: Apply What You Learned",40,
        `<h2>${title} Practical Workshop</h2>
        <p>This workshop turns the course into something you must <strong>do</strong>, not merely read.</p>
        <h3>Task</h3>
        <ol>
          <li>Choose a realistic problem connected to ${title}.</li>
          <li>State the objective and expected result.</li>
          <li>Select the concepts, formulas, tools, evidence or procedures needed.</li>
          <li>Complete the work step by step.</li>
          <li>Record your working, screenshots, calculations, observations or decisions.</li>
          <li>Check accuracy and improve weak areas.</li>
          <li>Write a short conclusion explaining what you learned.</li>
        </ol>
        <h3>Evidence to keep</h3>
        <p>Keep at least one useful piece of evidence: worked solution, worksheet, spreadsheet, code file, design, report, business document, experiment table, presentation, screenshot, concept map or written analysis.</p>
        <div class="kp"><strong>Practical standard</strong><p>A learner should be able to reproduce the task with less help the second time.</p></div>`,
        [q(p+"-lab-q","Which item is strongest evidence of practical learning?",
          ["A completed task with working and a checked result","Only opening the lesson","Copying a definition without using it","Skipping the task"],0,
          "Practical learning requires performance, evidence and checking.")]
      ),
      lesson(p+"-assignment","Independent Assignment",45,
        `<h2>${title} Independent Assignment</h2>
        <p>Complete this without following the lesson word-for-word.</p>
        <h3>Assignment brief</h3>
        <p>Create a useful output that demonstrates at least three important ideas from this course. Your work must include:</p>
        <ul>
          <li>a clear title and objective;</li>
          <li>the concepts or principles used;</li>
          <li>your own working or process;</li>
          <li>a finished result;</li>
          <li>a self-check identifying at least one improvement.</li>
        </ul>
        <h3>Self-assessment rubric — 20 marks</h3>
        <ul>
          <li>Understanding and correct concepts — 5</li>
          <li>Method/process — 5</li>
          <li>Accuracy and completeness — 5</li>
          <li>Presentation, reflection and improvement — 5</li>
        </ul>`,
        [q(p+"-assignment-q","What makes an independent assignment different from simply copying an example?",
          ["You apply the ideas to produce your own result","You repeat the same words exactly","You avoid checking the result","You use no course concepts"],0,
          "Independent work requires transfer of knowledge to a task you complete yourself.")]
      ),
      lesson(p+"-case","Case Study / Real-World Problem",35,
        `<h2>Real-World Case Study</h2>
        <p>Imagine you are asked to use ${title} in a school, workplace, organisation, business or community setting.</p>
        <h3>Your response</h3>
        <ol>
          <li>Identify the main problem.</li>
          <li>List relevant facts and missing information.</li>
          <li>Select suitable concepts from the course.</li>
          <li>Propose a solution and explain each major decision.</li>
          <li>Identify possible risks or errors.</li>
          <li>Recommend how success should be measured.</li>
        </ol>
        <h3>Stretch task</h3>
        <p>Give a second possible solution and compare it with your first choice.</p>`,
        [q(p+"-case-q","A strong case-study answer should primarily:",
          ["Connect facts to relevant concepts and justify decisions","Ignore the facts","Give an unexplained opinion","Avoid alternatives"],0,
          "Good case analysis links evidence, concepts and justified decisions.")]
      ),
      lesson(p+"-project","Mini Project / Portfolio Task",60,
        `<h2>${title} Mini Project</h2>
        <p>Build a portfolio-quality piece of work showing that you can use the subject beyond the lesson page.</p>
        <h3>Project phases</h3>
        <ol>
          <li><strong>Plan:</strong> define the goal, audience/user and success criteria.</li>
          <li><strong>Build:</strong> create the main output.</li>
          <li><strong>Test:</strong> check calculations, facts, functionality, clarity or quality as relevant.</li>
          <li><strong>Improve:</strong> make at least two documented improvements.</li>
          <li><strong>Present:</strong> write a short project summary and what you learned.</li>
        </ol>
        <h3>Portfolio record</h3>
        <p>Save your final work and a before/after comparison where possible. This can later become evidence for a learner portfolio or certificate assessment.</p>`,
        [q(p+"-project-q","Which stage turns a first attempt into stronger portfolio work?",
          ["Testing and improvement","Skipping review","Removing evidence","Avoiding feedback"],0,
          "Testing and revision demonstrate genuine practical development.")]
      ),
      lesson(p+"-assessment","Course Assessment: Knowledge + Application",45,
        `<h2>${title} Course Assessment</h2>
        <p>This assessment checks more than recall. Before marking the course complete, attempt all four parts.</p>
        <h3>Part A — Definitions and concepts</h3>
        <p>Define five major terms from the course in your own words.</p>
        <h3>Part B — Explain</h3>
        <p>Choose two major principles and explain why they matter.</p>
        <h3>Part C — Apply</h3>
        <p>Solve or complete one new practical problem without copying the worked example.</p>
        <h3>Part D — Evaluate</h3>
        <p>Identify one common mistake, explain its consequence and show how to correct or prevent it.</p>
        <h3>Suggested scoring — 40 marks</h3>
        <ul><li>Concept knowledge — 10</li><li>Explanation — 10</li><li>Application — 15</li><li>Evaluation — 5</li></ul>
        <div class="kp"><strong>Suggested mastery target</strong><p>Reach at least 70% and be able to explain your practical work before treating the course as mastered.</p></div>`,
        [
          q(p+"-a1","Which assessment best distinguishes real learning from internet searching?",
            ["A new task requiring explanation and application","Finding a copied definition","Opening several websites","Reading a title"],0,
            "A transfer task tests whether the learner can use knowledge independently."),
          q(p+"-a2","Why should learners explain their method?",
            ["It demonstrates reasoning, not only the final answer","It makes accuracy unnecessary","It hides errors","It removes the need for practice"],0,
            "Visible reasoning makes understanding assessable."),
          q(p+"-a3","What should happen when a practical result is incorrect?",
            ["Review the process, find the error and correct it","Leave it unchanged","Delete the task","Guess another answer"],0,
            "Error analysis and correction are important parts of mastery."),
          q(p+"-a4","Which is the strongest completion evidence?",
            ["Correct knowledge plus independently completed practical work","Time spent on the page only","A copied answer","Course enrollment alone"],0,
            "Completion should reflect knowledge and demonstrated skill.")
        ]
      )
    ]
  };

  c.modules = Array.isArray(c.modules) ? c.modules : [];
  if(!c.modules.some(m=>m && m.id===module.id)) c.modules.push(module);
  c.practicalAssessmentVersion="1.8";
  c.assessmentModel={
    practicalRequired:true,
    assignmentRequired:true,
    projectRequired:true,
    recommendedMasteryPercent:70,
    evidenceSuggested:true
  };
}
})();