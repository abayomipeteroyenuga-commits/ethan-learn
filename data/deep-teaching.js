(function(){
"use strict";

/*
 ETHAN Learn v4.3 Deep Teaching Engine
 Converts lesson pages from "read-only theory" into:
 Explain -> Worked Example -> Guided Practice -> Independent Questions -> Real Application -> Check/Reflect.
 It enriches every lesson at runtime without duplicating thousands of static HTML blocks.
*/
const courses=window.ETHAN_COURSES||[];
const esc=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const lower=s=>String(s||"").toLowerCase();

function box(title,html,cls="deep-card"){
  return `<section class="${cls}"><h3>${title}</h3>${html}</section>`;
}
function questions(items){
  return `<ol class="deep-questions">${items.map(x=>`<li>${x}</li>`).join("")}</ol>`;
}
function answers(items){
  return `<details class="deep-answers"><summary>Check answers / model points</summary><ol>${items.map(x=>`<li>${x}</li>`).join("")}</ol></details>`;
}

function simultaneous(){
 return `
 <section class="deep-teaching-feature">
   <div class="deep-kicker">ETHAN TEACHES • MATHEMATICS</div>
   <h2>Simultaneous Equations — learn it step by step</h2>
   <p><strong>Meaning.</strong> Simultaneous equations are two or more equations involving the same unknowns. We look for values that make <em>all</em> the equations true at the same time.</p>
   <p>For two linear equations in <em>x</em> and <em>y</em>, the common solution is also the point where their two straight-line graphs meet.</p>

   <h3>1. Explanation and meaning</h3>
   <p>A pair of simultaneous linear equations represents two conditions that must be true together. The solution is the ordered pair <strong>(x, y)</strong> satisfying both equations.</p>
   <h3>2. Graphical method</h3>
   <div class="worked-example"><p>For <strong>x + y = 5</strong> and <strong>x − y = 1</strong>, create a table of values for each line, plot both lines on the same axes, and read their intersection. The lines meet at <strong>(3, 2)</strong>, so x=3 and y=2. Verify: 3+2=5 and 3−2=1.</p></div>
   <h3>3. Method: Elimination</h3>
   <div class="worked-example">
     <p><strong>Example 1.</strong> Solve:</p>
     <p class="math-line">x + y = 10 &nbsp;&nbsp; (1)<br>x − y = 2 &nbsp;&nbsp; (2)</p>
     <p><strong>Step 1:</strong> Add (1) and (2). The +y and −y cancel.</p>
     <p class="math-line">2x = 12</p>
     <p><strong>Step 2:</strong> Divide both sides by 2.</p>
     <p class="math-line">x = 6</p>
     <p><strong>Step 3:</strong> Substitute x = 6 into equation (1).</p>
     <p class="math-line">6 + y = 10 ⇒ y = 4</p>
     <p><strong>Step 4: Check.</strong> 6 + 4 = 10 ✓ and 6 − 4 = 2 ✓.</p>
     <p><strong>Answer:</strong> x = 6, y = 4.</p>
   </div>

   <div class="worked-example">
     <p><strong>Example 2 — coefficients do not match immediately.</strong></p>
     <p class="math-line">2x + 3y = 13 &nbsp;&nbsp; (1)<br>3x + 2y = 12 &nbsp;&nbsp; (2)</p>
     <p>Multiply (1) by 3: <strong>6x + 9y = 39</strong>.</p>
     <p>Multiply (2) by 2: <strong>6x + 4y = 24</strong>.</p>
     <p>Subtract: <strong>5y = 15</strong>, so <strong>y = 3</strong>.</p>
     <p>Put y = 3 into 3x + 2y = 12:</p>
     <p class="math-line">3x + 6 = 12 ⇒ 3x = 6 ⇒ x = 2</p>
     <p><strong>Check:</strong> 2(2)+3(3)=13 ✓; 3(2)+2(3)=12 ✓.</p>
   </div>

   <h3>4. Method: Substitution</h3>
   <div class="worked-example">
     <p><strong>Example 3.</strong> Solve y = 2x + 1 and x + y = 10.</p>
     <p>Because y is already isolated, replace y in the second equation with 2x + 1:</p>
     <p class="math-line">x + (2x + 1) = 10<br>3x + 1 = 10<br>3x = 9<br>x = 3</p>
     <p>Then y = 2(3)+1 = <strong>7</strong>. Check: 3 + 7 = 10 ✓.</p>
   </div>

   <h3>5. Guided practice — do these with the steps</h3>
   ${questions([
     "Solve x + y = 9 and x − y = 3. Hint: add the equations first.",
     "Solve 2x + y = 11 and x + y = 7. Hint: subtract the second equation from the first.",
     "Solve y = x + 2 and 2x + y = 11. Hint: substitute x + 2 for y."
   ])}
   ${answers(["x = 6, y = 3.","x = 4, y = 3.","x = 3, y = 5."])}

   <h3>6. Independent questions</h3>
   ${questions([
     "3x + y = 14 and x + y = 8.",
     "2x + 3y = 16 and x + y = 6.",
     "4x + y = 19 and 2x − y = 5.",
     "y = 3x − 2 and x + y = 14.",
     "5x + 2y = 24 and 3x − 2y = 8.",
     "A school sells adult tickets for ₦2,000 and student tickets for ₦1,000. It sells 80 tickets for ₦120,000. Form simultaneous equations and find the number of each ticket sold."
   ])}
   ${answers([
     "x = 3, y = 5.",
     "x = 2, y = 4.",
     "x = 4, y = 3.",
     "x = 4, y = 10.",
     "x = 4, y = 2.",
     "Let a = adult tickets and s = student tickets. a+s=80; 2000a+1000s=120000. Therefore a=40 and s=40."
   ])}

   <h3>7. Exam technique</h3>
   <ul>
     <li>Write the equations clearly and label them (1), (2).</li>
     <li>Choose elimination when coefficients can be matched easily; choose substitution when one variable is already isolated.</li>
     <li>Whatever operation you perform must preserve the equality.</li>
     <li>Always substitute your final values back into <strong>both</strong> original equations.</li>
     <li>For word problems, define the unknowns first, form the equations second, solve third, then answer in words.</li>
   </ul>

   <div class="do-now-box"><strong>Do It Now:</strong> Create your own real-life two-variable problem using prices and quantities. Form two equations, solve them, and verify the result in both equations.</div>
 </section>`;
}

function mathBlock(topic){
 const t=lower(topic);
 if(t.includes("simultaneous")) return simultaneous();
 if(t.includes("quadratic")) return box("Worked mathematics — from rule to answer",`
   <p>A quadratic equation has highest power 2. One common form is <strong>ax² + bx + c = 0</strong>.</p>
   <div class="worked-example"><strong>Example:</strong> Solve x² − 5x + 6 = 0.<br>
   Find two numbers whose product is 6 and sum is −5: −2 and −3.<br>
   x² − 5x + 6 = (x−2)(x−3)=0.<br>
   Therefore <strong>x=2 or x=3</strong>. Check each value in the original equation.</div>
   ${questions(["Solve x²−7x+12=0.","Solve x²+x−6=0.","A rectangle has area 48 m² and length is 2 m more than width. Form and solve the quadratic equation."])}
   ${answers(["x=3 or 4.","x=2 or −3.","Let width=w; w(w+2)=48 ⇒ w²+2w−48=0 ⇒ w=6 m, length=8 m."])}
   <div class="do-now-box"><strong>Do It Now:</strong> Solve one question by factorisation, then verify both roots by substitution.</div>`);
 if(t.includes("percentage") || t.includes("percent")) return box("Worked mathematics — percentages",`
   <p>A percentage means “out of 100”. Convert p% to a fraction or decimal before calculating: p% = p/100.</p>
   <div class="worked-example"><strong>Example:</strong> Find 15% of ₦8,000.<br>15/100 × 8000 = <strong>₦1,200</strong>.<br>
   If an ₦8,000 item receives 15% discount, new price = 8000−1200 = <strong>₦6,800</strong>.</div>
   ${questions(["Find 25% of 360.","Increase ₦20,000 by 10%.","A price falls from ₦5,000 to ₦4,250. Find the percentage decrease."])}
   ${answers(["90.","₦22,000.","Decrease=₦750; 750/5000×100=15%."])}
   <div class="do-now-box"><strong>Real practical:</strong> Pick three prices from a shop advert. Calculate 5%, 10% and 20% discounts and the final prices.</div>`);
 if(t.includes("fraction")) return box("Worked mathematics — fractions",`
   <p>Fractions describe parts of a whole. To add unlike fractions, first use a common denominator.</p>
   <div class="worked-example"><strong>Example:</strong> 2/3 + 1/4. LCM of 3 and 4 is 12. So 2/3=8/12 and 1/4=3/12. Total = <strong>11/12</strong>.</div>
   ${questions(["1/2 + 1/3","3/4 − 1/6","2/5 × 15/4","A family uses 3/8 of a bag of rice on Monday and 1/4 on Tuesday. What fraction was used altogether?"])}
   ${answers(["5/6","7/12","3/2 or 1½","5/8"])}
   <div class="do-now-box"><strong>Do It Now:</strong> Draw a fraction model for one answer, then solve it numerically.</div>`);
 return `
 <section class="deep-teaching-feature math-lesson-structure">
   <div class="deep-kicker">MATHEMATICS • ${esc(topic)}</div>
   <h2>Topic: ${esc(topic)}</h2>
   <h3>1. Explanation</h3>
   <p>This lesson treats <strong>${esc(topic)}</strong> as a mathematics topic, not as a reading passage. First identify the quantities, symbols, relationship, rule or formula involved. Then work through the mathematics line by line. A mathematical statement must be justified by a calculation, diagram, table, graph or logical step.</p>

   <h3>2. How to solve questions on this topic</h3>
   <div class="worked-example">
     <ol>
       <li><strong>Read the question:</strong> write what is given and what must be found.</li>
       <li><strong>Choose the rule:</strong> state the formula, property, equation or operation that connects them.</li>
       <li><strong>Substitute or transform:</strong> put the known values into the rule, or rearrange the expression.</li>
       <li><strong>Calculate:</strong> show each line. Do not jump from the question to the final answer.</li>
       <li><strong>Check:</strong> use substitution, an inverse operation, estimation, a graph/table or another valid method.</li>
     </ol>
   </div>

   <h3>3. Worked example</h3>
   <div class="worked-example">
     <p><strong>Example structure for ${esc(topic)}:</strong></p>
     <p><strong>Question:</strong> Take a representative numerical or symbolic problem from this topic.</p>
     <p><strong>Given:</strong> list the known numbers, expressions or conditions.</p>
     <p><strong>Required:</strong> state exactly what must be calculated or proved.</p>
     <p><strong>Solution:</strong> write the relevant rule first, substitute/rearrange, calculate one line at a time, and state the final result clearly.</p>
     <p><strong>Check:</strong> test the result against the original condition.</p>
   </div>

   <h3>4. Guided questions</h3>
   ${questions([
     `Solve a straightforward numerical question on ${esc(topic)} and show every step.`,
     `Solve a second question on ${esc(topic)} where one value or condition must first be found before the final calculation.`,
     `Solve a question on ${esc(topic)} using a table, graph, diagram or algebraic representation where appropriate.`
   ])}

   <h3>5. Independent practice</h3>
   ${questions([
     `Question 1 — Basic: solve a direct problem on ${esc(topic)}.`,
     `Question 2 — Standard: solve a two-step problem on ${esc(topic)}.`,
     `Question 3 — Application: solve a word problem involving ${esc(topic)}.`,
     `Question 4 — Reasoning: decide whether a proposed solution to a ${esc(topic)} problem is correct and justify your answer.`,
     `Question 5 — Challenge: combine ${esc(topic)} with a previously learned mathematics skill and show the complete working.`
   ])}

   <h3>6. Real practical</h3>
   <div class="do-now-box"><strong>Do It Yourself:</strong> Find or create a real situation that uses ${esc(topic)}. Record the values, form the mathematical model, calculate the answer, include the correct unit where needed, and verify the result.</div>

   <h3>7. Quiz & mastery check</h3>
   <p>Complete the lesson quiz only after doing the worked and independent questions. If an answer is wrong, return to the exact calculation step that failed, correct it, and retry.</p>
 </section>`;
}

function scienceBlock(topic){
 return box("From explanation to investigation",`
   <p><strong>Explain it:</strong> After reading the lesson on ${esc(topic)}, identify the main scientific idea, the evidence that supports it, and the variables or conditions that can change the result.</p>
   <div class="worked-example"><strong>Worked scientific reasoning:</strong> State an observation → propose an explanation → identify evidence → compare the evidence with the explanation → write a conclusion that does not claim more than the evidence shows.</div>
   ${questions([`Define the central idea in ${esc(topic)} without copying the lesson.`,`Draw and label a diagram/model that explains the process.`,`Predict what would happen if one important condition changed, and explain why.`,`Interpret a small table or teacher-provided dataset connected to this topic.`,`State one limitation or source of error in an investigation of this topic.`])}
   <div class="do-now-box"><strong>Safe practical:</strong> Use a teacher-approved observation, diagram, supplied dataset or virtual simulation. Record aim, method, observation/data, conclusion and one improvement. Do not use hazardous chemicals or equipment without qualified supervision.</div>`);
}
function financeBlock(topic){
 return box("Worked example + accounting/business practice",`
   <p>For ${esc(topic)}, move from the definition to the actual document, calculation, entry or business decision it affects.</p>
   <div class="worked-example"><strong>Worked process:</strong> Identify the transaction/problem → identify the accounts or quantities affected → apply the correct rule → calculate/record → check that totals and evidence agree.</div>
   ${questions([`Explain ${esc(topic)} to a new business owner in two sentences.`,`Create one realistic transaction or business example and show how it is treated step by step.`,`Prepare the relevant calculation, journal-style entry, schedule or decision table.`,`Change one figure in your example and recalculate the result.`,`State two errors or control risks and how to prevent them.`])}
   <div class="do-now-box"><strong>Do It Now:</strong> Build a small five-transaction case for a fictional business, process it using this topic, and keep your workings as practical evidence.</div>`);
}
function digitalBlock(topic){
 return box("Build it, test it, improve it",`
   <p>Digital skill is learned by producing an output. For <strong>${esc(topic)}</strong>, follow the lesson once, then reproduce the result without copying the steps.</p>
   <div class="worked-example"><strong>Professional workflow:</strong> define the output → build a minimum working version → test it → identify one failure/weakness → fix it → test again → save evidence of the final result.</div>
   ${questions([`What should a correct output for ${esc(topic)} do?`,`Build the smallest working example you can.`,`Test it with normal input and one unusual input.`,`Deliberately create one error, diagnose it, then fix it.`,`Improve usability, accuracy, accessibility, security or presentation and explain the change.`])}
   <div class="do-now-box"><strong>Do It Now:</strong> Produce a file, screenshot, code sample, spreadsheet, design, report or working demo. Your evidence should show both the first version and the improved version.</div>`);
}
function literatureBlock(topic){
 return box("Read, analyse, support, write",`
   <p>Literature is not mastered by memorising definitions. For ${esc(topic)}, move from <strong>observation → evidence → interpretation → effect → judgement</strong>.</p>
   <div class="worked-example"><strong>Original mini-example:</strong> “At dawn, the empty road kept yesterday's footprints.” A learner might identify imagery and contrast, then explain how “dawn” suggests a new beginning while “yesterday's footprints” keep the past present. The important part is explaining the effect, not merely naming a device.</div>
   ${questions([`Explain the key literary idea in ${esc(topic)}.`,`Using a short teacher-provided or public-domain passage, identify two relevant features and explain their effects.`,`Write one paragraph using Point → Evidence → Explanation → Link.`,`Give a second reasonable interpretation and support it.`,`Write a short exam-style response with an introduction, two developed points and conclusion.`])}
   <div class="do-now-box"><strong>Do It Now:</strong> Create a short original paragraph, poem or dramatic exchange that demonstrates the technique, then annotate your own choices.</div>`);
}
function businessBlock(topic){
 return box("Case → decision → action",`
   <p>For ${esc(topic)}, learn the concept and then use it to make a defensible business decision.</p>
   <div class="worked-example"><strong>Worked case method:</strong> define the objective → separate facts from assumptions → identify options → compare cost/benefit/risk → choose → define a measurable success indicator.</div>
   ${questions([`Define ${esc(topic)} and explain why a manager or entrepreneur needs it.`,`Create a realistic small-business case where this topic matters.`,`List three possible actions and compare their advantages, disadvantages and risks.`,`Choose one action and justify it with evidence or calculations.`,`State two KPIs you would monitor after implementation.`])}
   <div class="do-now-box"><strong>Do It Now:</strong> Apply this topic to a fictional school, shop or digital business. Produce a one-page decision note with problem, evidence, options, decision and KPI.</div>`);
}
function languageBlock(topic){
 return box("See it → use it → improve it",`
   <p>Understanding ${esc(topic)} means being able to recognise it, explain it and use it correctly in your own communication.</p>
   <div class="worked-example"><strong>Model process:</strong> read a short example → identify the feature → explain why it works → rewrite it in a different context → edit for clarity, grammar, tone and purpose.</div>
   ${questions([`Explain ${esc(topic)} in your own words.`,`Write three correct examples of it.`,`Write one incorrect example, then correct and explain the error.`,`Use the skill in a short paragraph, message, speech or report.`,`Edit your work once for meaning and once for language accuracy.`])}
   <div class="do-now-box"><strong>Do It Now:</strong> Produce 120–200 words that deliberately uses today's skill. Read it aloud, edit weak sentences, and save the improved version.</div>`);
}
function genericBlock(topic){
 return box("Learn by doing",`
   <p>Now move beyond the theory of <strong>${esc(topic)}</strong>. Explain the idea in your own words, study a realistic example, perform the skill yourself, then evaluate the result.</p>
   <div class="worked-example"><strong>Model:</strong> Problem → relevant concept → steps → result → check → improvement.</div>
   ${questions([`What does ${esc(topic)} mean, and why does it matter?`,`Give a realistic example and explain it step by step.`,`Complete a practical task that applies the idea.`,`Change one condition in your example. What changes and why?`,`What mistake is most likely, and how would you detect or correct it?`])}
   <div class="do-now-box"><strong>Do It Now:</strong> Create a real output or written solution. Keep evidence, compare it with the lesson criteria, improve it once, then write a two-sentence reflection.</div>`);
}

function enrichment(course,lesson){
 const sid=lower(course.subject), title=lesson.title||course.title;
 if(sid.includes("math") || lower(course.title).includes("mathemat")) return mathBlock(title);
 if(["science"].includes(sid) || /(physics|chemistry|biology|science|ecology|geology|astronomy)/.test(lower(course.title))) return scienceBlock(title);
 if(/account|finance|commercial|commerce|econom|bank|insurance|tax/.test(sid+" "+lower(course.title))) return financeBlock(title);
 if(/digital|program|web|data|cyber|cloud|office|ai|technology|media|design/.test(sid)) return digitalBlock(title);
 if(/literature|english|language/.test(sid)) return literatureBlock(title);
 if(/business|entrepreneur|marketing|management|logistics|hospitality/.test(sid)) return businessBlock(title);
 if(/communication|writing/.test(sid)) return languageBlock(title);
 return genericBlock(title);
}

let lessonCount=0, enriched=0, simultaneousCount=0;
courses.forEach(course=>{
 (course.modules||[]).forEach(mod=>{
   (mod.lessons||[]).forEach(lesson=>{
     lessonCount++;
     if(lesson.deepTeachingVersion==="4.3") return;
     const block=enrichment(course,lesson);
     if(block){
       lesson.body=(lesson.body||"")+block;
       lesson.deepTeachingVersion="4.3";
       lesson.teachingMethod=["Explain","Worked Example","Guided Practice","Independent Practice","Real Application","Check & Reflect"];
       enriched++;
       if(lower(lesson.title).includes("simultaneous")) simultaneousCount++;
     }
   });
 });
 course.deepTeachingVersion="4.3";
});
window.ETHAN_DEEP_TEACHING_AUDIT={courses:courses.length,lessons:lessonCount,enriched,simultaneousLessons:simultaneousCount};
})();