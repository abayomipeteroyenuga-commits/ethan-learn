(function(){
"use strict";
const courses=window.ETHAN_COURSES||[];
const esc=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const txt=s=>String(s||"").toLowerCase();
const qs=a=>`<ol class="reasoning-questions">${a.map(x=>`<li>${x}</li>`).join("")}</ol>`;
const ans=a=>`<details class="reasoning-answers"><summary>Show model answers / workings</summary><ol>${a.map(x=>`<li>${x}</li>`).join("")}</ol></details>`;

function accounting(topic){
 const t=txt(topic);
 if(/accounting equation|double.entry|double entry/.test(t)) return `
 <section class="reasoning-lab"><div class="deep-kicker">ACCOUNTING • ${esc(topic)}</div>
 <h2>Topic: ${esc(topic)}</h2><h3>1. Explanation</h3>
 <p>The accounting equation is <strong>Assets = Capital + Liabilities</strong>. Every transaction has a dual effect, so the equation must remain balanced. Double-entry records that dual effect through debit and credit entries.</p>
 <h3>2. Worked Example</h3><div class="worked-example">
 <p>A business starts with ₦500,000 cash introduced by the owner.</p>
 <p><strong>Effect:</strong> Cash (asset) increases by ₦500,000 and Capital increases by ₦500,000.</p>
 <p class="math-line">Assets ₦500,000 = Capital ₦500,000 + Liabilities ₦0</p>
 <p>It then buys equipment for ₦120,000 cash. Equipment rises ₦120,000 while Cash falls ₦120,000. Total assets remain ₦500,000.</p>
 <p class="math-line">Cash ₦380,000 + Equipment ₦120,000 = Capital ₦500,000</p></div>
 <h3>3. Guided Practice</h3>${qs(["Owner introduces ₦300,000 cash. Show the equation.","The business buys furniture for ₦80,000 cash. Show the new asset composition.","It obtains a ₦100,000 bank loan. Show the effect on assets and liabilities."])}
 ${ans(["Assets ₦300,000 = Capital ₦300,000 + Liabilities ₦0.","Cash ₦220,000 + Furniture ₦80,000 = Capital ₦300,000.","Assets become ₦400,000; Capital ₦300,000 + Liabilities ₦100,000."])}
 <h3>4. Independent Questions</h3>${qs(["Classify Cash, Bank Loan and Owner's Capital.","A business has assets of ₦850,000 and liabilities of ₦230,000. Find capital.","Capital is ₦600,000 and liabilities are ₦150,000. Find total assets.","Explain the dual effect when goods worth ₦50,000 are bought for cash.","Prepare a five-transaction accounting-equation table for a fictional business."])}
 ${ans(["Cash=Asset; Bank Loan=Liability; Owner's Capital=Capital.","Capital=₦850,000−₦230,000=₦620,000.","Assets=₦600,000+₦150,000=₦750,000.","Inventory rises ₦50,000 and Cash falls ₦50,000; total assets do not change.","Answers vary; each transaction must keep Assets = Capital + Liabilities balanced."])}
 <h3>5. Real Practical</h3><div class="do-now-box">Create a small business opening scenario. Record at least five transactions and prove after every transaction that the accounting equation still balances.</div>
 <h3>6. Quiz / Mastery</h3><p>Attempt the lesson quiz after completing the ledger/equation work. Correct every imbalance before moving on.</p></section>`;
 return genericReason("ACCOUNTING",topic,
   "Identify the transaction → classify the accounts → apply the accounting rule → calculate/record the debit and credit or statement effect → balance/check.",
   ["Create a realistic transaction and identify every account affected.","Show the debit/credit or statement treatment with figures.","Prepare the relevant ledger, journal, trial-balance, reconciliation, financial-statement or ratio working.","Find and correct one deliberately introduced error.","Explain what the final figure tells the owner or manager."]);
}
function economics(topic){
 return genericReason("ECONOMICS",topic,
 "Define the economic relationship → identify assumptions → represent it with figures/table/graph where appropriate → calculate or interpret → explain the economic meaning.",
 [`Create a numerical or graphical example for ${esc(topic)}.`,`Change one economic variable and explain the expected effect, holding relevant assumptions constant.`,`Interpret a table or graph connected with ${esc(topic)}.`,`Solve a calculation where this topic has a standard numerical measure.`,`Apply the idea to a household, firm or market case and justify the conclusion.`]);
}
function commerce(topic){
 return genericReason("COMMERCE / BUSINESS STUDIES",topic,
 "Identify the commercial problem → classify the activity/document/channel → apply the rule/process → compare alternatives → choose and justify.",
 [`Draw or build a classification/process diagram for ${esc(topic)}.`,`Create a realistic transaction or trade case and show the process step by step.`,`Compare two alternatives using cost, risk, speed or suitability.`,`Complete a relevant document/table/calculation where applicable.`,`State the decision you would make and give two reasons.`]);
}
function science(topic,course){
 const name=txt(course.title);
 const kind=/physics/.test(name)?"PHYSICS":/chem/.test(name)?"CHEMISTRY":/bio/.test(name)?"BIOLOGY":"SCIENCE";
 return genericReason(kind,topic,
 "State the scientific principle → identify quantities/variables → use the equation, diagram, evidence or data → work step by step → check units/evidence → conclude.",
 [`State the key principle behind ${esc(topic)} and define its important quantities or terms.`,`Work a numerical/data question on ${esc(topic)} where the topic supports calculation.`,`Draw and label the relevant diagram, apparatus, process or model where appropriate.`,`Interpret a supplied table/graph/result and write an evidence-based conclusion.`,`Complete a safe teacher-approved practical, observation, dataset or simulation and record aim, method, result and conclusion.`]);
}
function logic(topic){
 return genericReason("LOGIC & REASONING",topic,
 "List the facts/premises → translate them into clear statements, symbols, sets or conditions → test each inference → reject contradictions → state the conclusion.",
 [`Separate the premises from the conclusion in a problem about ${esc(topic)}.`,`Represent the information using a truth table, set, sequence, diagram or symbols where appropriate.`,`Test whether a proposed conclusion necessarily follows from the premises.`,`Find a counterexample to one invalid claim, if possible.`,`Solve a new multi-step reasoning problem and explain every inference.`]);
}
function finance(topic){
 return genericReason("FINANCE / BUSINESS MATHEMATICS",topic,
 "Identify known values → select the financial formula/rule → substitute → calculate → interpret money/time/rate units → check reasonableness.",
 [`Write the variables and formula needed for a calculation on ${esc(topic)}.`,`Solve a straightforward numerical example and show all working.`,`Solve a two-step money/rate/time problem.`,`Compare two financial options using calculated results rather than opinion.`,`Create a realistic business case and calculate the final recommendation.`]);
}
function genericReason(label,topic,process,items){
 return `<section class="reasoning-lab"><div class="deep-kicker">${label} • ACTIVE REASONING</div>
 <h2>Topic: ${esc(topic)}</h2>
 <h3>1. Explanation</h3><p>Learn the meaning, rules and purpose of <strong>${esc(topic)}</strong>, then use them to solve a problem. This lesson is not complete until you have produced workings, evidence, a calculation, a diagram, a decision or another checkable output.</p>
 <h3>2. Reasoning Method</h3><div class="worked-example"><strong>Procedure:</strong> ${process}</div>
 <h3>3. Worked / Model Example</h3><div class="worked-example"><p><strong>Question:</strong> Build a representative problem from ${esc(topic)}.</p><p><strong>Given/Evidence:</strong> state the figures, facts or conditions.</p><p><strong>Working:</strong> apply the rule one step at a time and show intermediate results.</p><p><strong>Answer/Conclusion:</strong> state the result and explain what it means.</p><p><strong>Check:</strong> verify using totals, units, another method, source evidence or the original conditions.</p></div>
 <h3>4. Guided Practice</h3>${qs(items.slice(0,3))}
 <h3>5. Independent Work</h3>${qs(items)}
 <h3>6. Real Practical / Case</h3><div class="do-now-box">Create or use a realistic case for ${esc(topic)}. Show the complete process, keep your workings/evidence, check the result and explain one improvement or alternative.</div>
 <h3>7. Quiz & Mastery Check</h3><p>Take the quiz after the practical work. A correct answer without reasoning is not enough for calculation or logic tasks: compare it with your workings and correct any failed step.</p></section>`;
}

function classify(c){
 const z=txt((c.subject||"")+" "+(c.title||""));
 if(/account|bookkeep|audit|taxation|cost accounting|management accounting|public sector accounting/.test(z)) return "accounting";
 if(/economics/.test(z)) return "economics";
 if(/commerce|commercial|business studies|office practice|insurance|banking/.test(z)) return "commerce";
 if(/finance|business mathematics|financial math/.test(z)) return "finance";
 if(/logic|reasoning|critical thinking/.test(z)) return "logic";
 if(/physics|chemistry|biology|science|statistics|data analytics/.test(z)) return "science";
 return null;
}

let courseCount=0,lessonCount=0,byType={};
for(const c of courses){
 const type=classify(c); if(!type) continue;
 courseCount++; byType[type]=(byType[type]||0)+1;
 for(const m of (c.modules||[])) for(const l of (m.lessons||[])) lessonCount++;
}
function renderFor(c,l){
 const type=classify(c); if(!type||!l)return "";
 if(type==="accounting") return accounting(l.title);
 if(type==="economics") return economics(l.title);
 if(type==="commerce") return commerce(l.title);
 if(type==="finance") return finance(l.title);
 if(type==="logic") return logic(l.title);
 if(type==="science") return science(l.title,c);
 return "";
}
window.EthanReasoningTeaching={render:renderFor,classify};
window.ETHAN_REASONING_SUBJECT_AUDIT={courseCount,lessonCount,byType,lazy:true};
})();