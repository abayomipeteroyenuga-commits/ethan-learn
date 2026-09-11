(function(){
"use strict";
const C=window.ETHAN_COURSES||[];
const esc=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const low=s=>String(s||"").toLowerCase();
const money=n=>"₦"+Number(n).toLocaleString("en-NG");

function seed(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(s){let x=seed(s)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
function N(r,a,b){return Math.floor(r()*(b-a+1))+a}
function gcd(a,b){while(b)[a,b]=[b,a%b];return Math.abs(a)}
function pack(title,formula,worked,items){
 return `<section class="intensive-practice"><div class="practice-badge">PRACTICE INTENSIVE</div><h2>${title}</h2>
 <div class="formula-strip"><strong>Rule / formula:</strong> ${formula}</div>
 <h3>Worked example</h3><div class="worked-example">${worked}</div>
 <h3>Practice Set A — Build confidence</h3>${render(items.slice(0,5))}
 <h3>Practice Set B — Exam practice</h3>${render(items.slice(5,10))}
 <h3>Practice Set C — Challenge / application</h3>${render(items.slice(10,15))}
 <details class="practice-solutions"><summary>Answers & checked workings</summary>${items.map((q,i)=>`<div class="solution"><strong>${i+1}.</strong> ${q.a}</div>`).join("")}</details>
 <div class="do-now-box"><strong>Mastery target:</strong> Work all 15 questions on paper. Aim for at least 12/15 before moving on. Retry missed questions without looking at the answer.</div></section>`;
}
function render(items){return `<ol class="practice-bank">${items.map(q=>`<li>${q.q}</li>`).join("")}</ol>`}

function algebra(topic,key){
 const r=rng(key), items=[];
 for(let i=0;i<5;i++){let a=N(r,2,9),x=N(r,2,14),b=N(r,1,20),c=a*x+b;items.push({q:`Solve ${a}x + ${b} = ${c}.`,a:`${a}x=${c-b}; x=${c-b}÷${a}=<strong>${x}</strong>.`})}
 for(let i=0;i<5;i++){let x=N(r,2,10),y=N(r,1,9),a=N(r,1,5),b=N(r,1,5),c=a*x+b*y,d=N(r,1,5),e=N(r,1,5);while(a*e===b*d)e++;let f=d*x+e*y;items.push({q:`Solve simultaneously: ${a}x + ${b}y = ${c}; ${d}x + ${e}y = ${f}.`,a:`Eliminating/substituting and checking both equations gives <strong>x=${x}, y=${y}</strong>.`})}
 for(let i=0;i<5;i++){let p=N(r,2,8),q=N(r,2,8);items.push({q:`Solve x² − ${p+q}x + ${p*q} = 0.`,a:`(x−${p})(x−${q})=0, so <strong>x=${p} or x=${q}</strong>.`})}
 return pack(`Calculation Lab: ${esc(topic)}`,"Show algebraic transformations line by line; verify solutions in the original equation.",
 `Solve 3x+5=20: 3x=15, therefore <strong>x=5</strong>. Check: 3(5)+5=20.`,
 items);
}
function arithmetic(topic,key){
 const r=rng(key),items=[];
 for(let i=0;i<5;i++){let base=N(r,20,90)*100,p=[5,10,15,20,25][N(r,0,4)],ans=base*p/100;items.push({q:`Find ${p}% of ${money(base)}.`,a:`${p}/100 × ${money(base)} = <strong>${money(ans)}</strong>.`})}
 for(let i=0;i<5;i++){let a=N(r,2,12),b=N(r,2,12),d=N(r,2,9),num=a*d+b;items.push({q:`Evaluate ${a} + ${b}/${d}. Give an exact mixed number or improper fraction.`,a:`(${a}×${d}+${b})/${d}=${num}/${d}. Reduce if possible using the HCF.`})}
 for(let i=0;i<5;i++){let cost=N(r,20,80)*1000,rate=[5,8,10,12][N(r,0,3)],yr=N(r,1,4),si=cost*rate*yr/100;items.push({q:`Calculate simple interest on ${money(cost)} at ${rate}% per year for ${yr} year(s).`,a:`I=PRT/100=${cost}×${rate}×${yr}/100=<strong>${money(si)}</strong>.`})}
 return pack(`Calculation Lab: ${esc(topic)}`,"Write the operation/formula, substitute, calculate, include units, then estimate/check.",
 `15% of ₦8,000 = 15/100 × 8,000 = <strong>₦1,200</strong>.`,
 items);
}
function further(topic,key){
 const r=rng(key),items=[];
 for(let i=0;i<5;i++){let a=N(r,1,5),b=N(r,1,9),x=N(r,1,6);items.push({q:`For f(x)=${a}x²+${b}x, find f′(${x}).`,a:`f′(x)=${2*a}x+${b}; f′(${x})=${2*a*x+b}.`})}
 for(let i=0;i<5;i++){let a=N(r,1,6),n=N(r,2,5);items.push({q:`Integrate ${a*n}x^${n-1} with respect to x.`,a:`Using ∫kxⁿ dx=kxⁿ⁺¹/(n+1), the antiderivative is <strong>${a}x^${n}+C</strong>.`})}
 for(let i=0;i<5;i++){let a=N(r,1,5),b=N(r,1,5),c=N(r,1,5),d=N(r,1,5);items.push({q:`Given A=[[${a},${b}],[${c},${d}]], calculate det(A).`,a:`det(A)=ad−bc=${a*d}−${b*c}=<strong>${a*d-b*c}</strong>.`})}
 return pack(`Further Mathematics Lab: ${esc(topic)}`,"Select the theorem/formula, transform symbolically, calculate, then verify domain/sign/conditions.",
 `If y=3x²+4x, then dy/dx=6x+4. At x=2, gradient = <strong>16</strong>.`,
 items);
}
function accounting(topic,key){
 const r=rng(key),items=[];
 for(let i=0;i<5;i++){let A=N(r,4,20)*50000,L=N(r,1,6)*50000; if(L>=A)L=A-50000;items.push({q:`A business has assets of ${money(A)} and liabilities of ${money(L)}. Calculate owner's equity.`,a:`Equity=Assets−Liabilities=${money(A)}−${money(L)}=<strong>${money(A-L)}</strong>.`})}
 for(let i=0;i<5;i++){let sales=N(r,10,40)*50000,cost=N(r,5,20)*50000; if(cost>=sales)cost=sales-50000;let gp=sales-cost;items.push({q:`Sales are ${money(sales)} and cost of sales is ${money(cost)}. Calculate gross profit and gross-profit margin.`,a:`Gross profit=${money(gp)}. Margin=${gp}/${sales}×100=<strong>${(gp/sales*100).toFixed(1)}%</strong>.`})}
 for(let i=0;i<5;i++){let bank=N(r,3,15)*10000,book=bank+N(r,1,5)*5000,dep=book-bank;items.push({q:`Cash-book balance is ${money(book)} while the adjusted bank figure is ${money(bank)}. If the entire difference is one outstanding item, calculate the reconciling amount and state why it must be investigated before finalising the reconciliation.`,a:`Difference=${money(book)}−${money(bank)}=<strong>${money(dep)}</strong>. Identify the actual timing/error item from evidence before posting any correction.`})}
 return pack(`Accounting Practice Lab: ${esc(topic)}`,"Classify → apply accounting rule → calculate/record → balance/reconcile → interpret.",
 `Assets ₦900,000 and liabilities ₦250,000: Equity = 900,000−250,000 = <strong>₦650,000</strong>.`,
 items);
}
function physics(topic,key){
 const r=rng(key),items=[];
 for(let i=0;i<5;i++){let u=N(r,0,10),a=N(r,1,5),t=N(r,2,8),v=u+a*t,s=u*t+.5*a*t*t;items.push({q:`An object has initial speed ${u} m/s and constant acceleration ${a} m/s² for ${t} s. Find final speed and displacement.`,a:`v=u+at=${u}+${a}(${t})=<strong>${v} m/s</strong>. s=ut+½at²=${u*t}+½(${a})(${t}²)=<strong>${s} m</strong>.`})}
 for(let i=0;i<5;i++){let m=N(r,2,20),acc=N(r,1,8),F=m*acc;items.push({q:`A ${m} kg body accelerates at ${acc} m/s². Find the resultant force.`,a:`F=ma=${m}×${acc}=<strong>${F} N</strong>.`})}
 for(let i=0;i<5;i++){let F=N(r,2,15)*10,d=N(r,2,10),t=N(r,2,8),W=F*d,P=W/t;items.push({q:`A constant force of ${F} N moves an object ${d} m in its direction in ${t} s. Find work done and average power.`,a:`W=Fd=${F}×${d}=<strong>${W} J</strong>; P=W/t=${W}/${t}=<strong>${P.toFixed(1)} W</strong>.`})}
 return pack(`Physics Calculation Lab: ${esc(topic)}`,"List data with SI units → choose equation → substitute → calculate → check units and physical reasonableness.",
 `A 5 kg body accelerates at 3 m/s²: F=ma=5×3=<strong>15 N</strong>.`,
 items);
}
function chemistry(topic,key){
 const r=rng(key),items=[];
 for(let i=0;i<5;i++){let n=N(r,1,5),M=[18,32,44,58.5,98][N(r,0,4)],mass=n*M;items.push({q:`A sample contains ${n} mol of a substance with molar mass ${M} g/mol. Calculate its mass.`,a:`m=nM=${n}×${M}=<strong>${mass} g</strong>.`})}
 for(let i=0;i<5;i++){let c=N(r,1,8)/10,V=N(r,1,10)/10,n=c*V;items.push({q:`A solution has concentration ${c.toFixed(1)} mol/L and volume ${V.toFixed(1)} L. Calculate amount in moles.`,a:`n=cV=${c.toFixed(1)}×${V.toFixed(1)}=<strong>${n.toFixed(2)} mol</strong>.`})}
 for(let i=0;i<5;i++){let P=N(r,1,3),V=N(r,2,8),T=N(r,280,330),R=.082057,n=P*V/(R*T);items.push({q:`An ideal gas occupies ${V} L at ${P} atm and ${T} K. Using R=0.082057 L·atm·mol⁻¹·K⁻¹, calculate the amount of gas.`,a:`n=PV/RT=(${P}×${V})/(0.082057×${T})=<strong>${n.toFixed(3)} mol</strong>.`})}
 return pack(`Chemistry Calculation Lab: ${esc(topic)}`,"Write balanced relationship/formula → convert units → calculate moles/ratio/value → use significant figures appropriately → check.",
 `For 2.0 mol of a substance with molar mass 44 g/mol: m=nM=2.0×44=<strong>88 g</strong>.`,
 items);
}

function kind(c){
 const z=low((c.subject||"")+" "+(c.title||""));
 if(/further math|advanced mathematics|additional mathematics/.test(z))return"further";
 if(/mathemat/.test(z)||/(^|\s)math(\s|$)/.test(z))return"math";
 if(/account|bookkeep|audit|taxation/.test(z))return"account";
 if(/physics/.test(z))return"physics";
 if(/chemistry/.test(z))return"chem";
 return null;
}
let audit={courses:0,lessons:0,questions:0,byType:{}};
for(const c of C){
 const k=kind(c);if(!k)continue;
 audit.courses++;audit.byType[k]=(audit.byType[k]||0)+1;
 for(const m of (c.modules||[]))for(const l of (m.lessons||[])){
   const key=c.id+"|"+l.id+"|"+l.title, title=l.title||m.title||c.title;
   let block=k==="further"?further(title,key):k==="math"?( /calculus|matrix|vector|differential|integral|complex|coordinate geometry|trigonomet/i.test(low(title))?further(title,key):(/algebra|equation|factor|polynomial|quadratic|simultaneous/i.test(low(title))?algebra(title,key):arithmetic(title,key))):k==="account"?accounting(title,key):k==="physics"?physics(title,key):chemistry(title,key);
   l.body=(l.body||"")+block;l.practiceIntensiveVersion="4.7";audit.lessons++;audit.questions+=15;
 }
 c.practiceIntensiveVersion="4.7";
}
window.ETHAN_PRACTICE_INTENSIVE_AUDIT=audit;
})();