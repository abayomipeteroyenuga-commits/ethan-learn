(function(){
"use strict";
const courses=window.ETHAN_COURSES||[];
const isMath=c=>String(c.subject||"").toLowerCase().includes("math")||String(c.title||"").toLowerCase().includes("mathemat");
let coursesUpdated=0, lessonsUpdated=0;
for(const c of courses){
 if(!isMath(c)) continue;
 coursesUpdated++;
 c.mathTeachingProcedure={
   sequence:["Subject","Topic","Explanation","Formula/Rule","Worked Example","Guided Questions","Independent Questions","Real Practical","Quiz","Mastery Check"],
   standard:"Nigerian-curriculum-style mathematics learning flow"
 };
 for(const m of (c.modules||[])){
   for(const l of (m.lessons||[])){
     lessonsUpdated++;
     l.mathLessonStructure=true;
   }
 }
}
window.ETHAN_MATH_PROCEDURE_AUDIT={coursesUpdated,lessonsUpdated};
})();