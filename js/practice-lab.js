(function(){
"use strict";
const KEY="ethan_practical_evidence_v2";
function read(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}}
function write(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function subjectName(id){return (window.ETHAN_SUBJECTS||[]).find(s=>s.id===id)?.name||id}
function key(c,l){return `${c.id}:${l.id}`}
function task(c,l){
 const s=c.subject,title=l.title,course=c.title;
 if(s==="math")return {
   doNow:`Solve three problems connected to “${title}”: one basic, one word problem and one challenge. Show every step and check each answer using a second method where possible.`,
   work:`Write what is known, choose the formula or rule, substitute carefully, solve, then explain what the answer means.`,
   stretch:`Create your own problem on ${title}, solve it, then change one value and predict how the answer changes.`,
   evidence:"Keep your worked solutions, corrections and final checked answers."
 };
 if(s==="science")return {
   doNow:`Complete a safe observation, supplied-data task or virtual investigation related to “${title}”. State the question, identify variables or evidence, record results and write a conclusion.`,
   work:`Separate observation from explanation. Use measurements, a table, labelled diagram or supplied dataset where relevant.`,
   stretch:`Identify one limitation in the investigation and propose one improvement that would make the evidence stronger.`,
   evidence:"Keep your table, diagram, calculation, graph or investigation note. Use only teacher-approved or virtual practicals."
 };
 if(s==="arts")return {
   doNow:`Create a small original study connected to “${title}”: a sketch, composition plan, storyboard, design study, performance plan or visual response.`,
   work:`Choose two principles such as line, shape, rhythm, contrast, balance, colour, space, texture, movement or emphasis and use them deliberately.`,
   stretch:`Make a second version with a different creative decision and compare which version communicates the idea better.`,
   evidence:"Keep the first draft, improved version and a short reflection."
 };
 if(s==="literature"||s==="english")return {
   doNow:`Analyse one short original, teacher-provided or public-domain-friendly example related to “${title}”. Identify form, language, structure, tone, theme and effect.`,
   work:`Make one clear claim, support it with evidence from the text without copying long passages, and explain how the evidence supports your interpretation.`,
   stretch:`Write an alternative interpretation and explain what evidence could support it.`,
   evidence:"Keep your reading notes and one polished analytical paragraph."
 };
 if(s==="commercial"||s==="finance")return {
   doNow:`Complete one commercial task linked to “${title}”: a calculation, source document, journal/ledger entry, comparison table, pricing decision or transaction analysis.`,
   work:`Show the transaction or problem, method, calculation/record, result and accuracy check.`,
   stretch:`Change one assumption, price, quantity, rate or transaction and explain the effect.`,
   evidence:"Keep your working, business document, spreadsheet or calculation sheet."
 };
 if(s==="business"||s==="marketing")return {
   doNow:`Apply “${title}” to a realistic school, organisation or small-business case. Define the objective, facts, options, decision and success measure.`,
   work:`Use a simple decision table: option, benefit, cost/risk, evidence and recommendation.`,
   stretch:`Give a second recommendation and explain when it would be better than your first choice.`,
   evidence:"Keep a one-page plan, case response, dashboard, memo or decision table."
 };
 if(["programming","web","data","ai","digital-literacy","office","digital-courses","cloud","cyber"].includes(s))return {
   doNow:`Build or configure one small output related to “${title}”. Test it, identify one problem, fix it and record what changed.`,
   work:`Use the cycle: goal → build → test → diagnose → improve → verify.`,
   stretch:`Add one extra requirement such as accessibility, clearer naming, validation, error handling, security awareness or better presentation.`,
   evidence:"Keep a screenshot, file, code snippet, before/after note or test result."
 };
 return {
   doNow:`Complete one short practical task using “${title}” instead of only reading it.`,
   work:`State the objective, apply the key idea, produce a result, check it and explain what you learned.`,
   stretch:`Try the same idea in a different situation and compare the result.`,
   evidence:"Keep a note, worksheet, screenshot, plan, calculation or other proof of work."
 };
}
function render(c,l){
 const t=task(c,l),done=!!read()[key(c,l)];
 return ``;
}
function attach(root=document){
 root.querySelectorAll("[data-practical-key]").forEach(box=>{
   const k=box.getAttribute("data-practical-key");
   const btn=box.querySelector("[data-practical-done]"),reset=box.querySelector("[data-practical-reset]"),ref=box.querySelector("[data-practical-reflection]");
   const state=read()[k];if(state&&ref)ref.value=state.reflection||"";
   if(btn)btn.onclick=()=>{
     const all=read();all[k]={done:true,reflection:ref?.value||"",at:Date.now()};write(all);
     btn.textContent="Practical evidence saved ✓";box.querySelector(".din-state").textContent="Evidence saved ✓";
     try{window.ETHAN?.toast?.("Practical evidence saved")}catch(e){}
     window.dispatchEvent(new CustomEvent("ethan:practice-saved",{detail:{key:k}}));
   };
   if(reset)reset.onclick=()=>{
     const all=read();delete all[k];write(all);if(ref)ref.value="";
     if(btn)btn.textContent="Mark practical evidence saved";box.querySelector(".din-state").textContent="Not completed yet";
   };
 });
}
function stats(){
 const all=read(),items=Object.values(all).filter(x=>x&&x.done);
 return {completed:items.length};
}
window.EthanPracticeLab={render,attach,stats,task};
})();