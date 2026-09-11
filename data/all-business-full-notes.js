(function(){
const isBiz=c=>/(business|marketing|commerce|account|econom|entrepreneur|finance|sales|customer|brand|e-commerce|ecommerce|seo|management|advertis|retail|logistics|insurance|banking|office|secretar|trade|consumer|public relation|human resource|operations|supply chain)/i.test((c.subject||"")+" "+(c.title||""));
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
const defs=[
[/social media marketing/i,"the planned use of social media channels to connect with a defined audience, communicate value, build relationships and achieve measurable marketing objectives"],
[/digital marketing/i,"the planned use of digital channels, technologies and data to understand audiences, communicate value and achieve measurable marketing objectives"],
[/content marketing/i,"a strategic approach to planning, creating and distributing useful and relevant content for a clearly defined audience"],
[/email marketing/i,"the permission-based use of email to communicate useful information, develop customer relationships and support measurable marketing objectives"],
[/search engine optimization|\bseo\b/i,"the systematic improvement of website content, structure and discoverability so relevant users and search engines can understand and find useful pages"],
[/marketing/i,"the process of identifying and understanding customer needs, creating and communicating value, facilitating exchange and developing beneficial customer relationships"],
[/financial accounting|accounting/i,"the systematic process of identifying, measuring, recording, classifying, summarising, analysing and communicating financial information for decision-making"],
[/economics/i,"the social science concerned with how individuals, organisations and societies make choices about scarce resources and competing needs"],
[/commerce/i,"the activities and institutions that facilitate the exchange and distribution of goods and services, including trade and aids to trade"],
[/entrepreneur/i,"the process of identifying opportunities, organising resources, creating value and managing uncertainty in establishing or developing an enterprise"],
[/finance/i,"the study and management of money, funding, investment, financial decisions and risk"],
[/management/i,"the coordinated process of planning, organising, leading and controlling resources to achieve defined organisational objectives"],
[/business communication/i,"the purposeful exchange of information within and outside an organisation to support coordination, decisions and stakeholder relationships"],
[/customer service/i,"the organised support provided before, during and after an exchange to meet customer needs and sustain relationships"],
[/sales/i,"the professional process of identifying customer needs, communicating relevant value, developing relationships and facilitating legitimate exchange"],
[/brand/i,"the strategic creation and management of distinctive meanings, associations and experiences connected with an organisation, product or service"],
[/e-commerce|ecommerce/i,"the conduct of commercial transactions and supporting business activities through electronic networks and digital platforms"],
[/bank/i,"the organised provision and management of financial services such as deposits, payments, credit and related financial activities"],
[/insurance/i,"a system of risk management in which specified financial risks are transferred or pooled under agreed terms"],
[/business/i,"the organised activity of creating and providing goods or services to satisfy needs while managing resources, stakeholders, risks and objectives"]
];
function definition(c){
 const z=(c.title||"")+" "+(c.subject||"");
 for(const [rx,d] of defs) if(rx.test(z)) return d;
 return "the systematic study and application of concepts used to understand organisations, markets, customers, resources and business decision-making";
}
function cleanTitle(t){return String(t||"Business Studies").replace(/\s*[—–-]\s*(Standard Academic.*|Complete Academic.*)$/i,"").trim();}
function note(c){
 const name=cleanTitle(c.title), en=esc(name), def=esc(definition(c));
 return `<article class="full-note business-full-note"><div class="academic-kicker">ETHAN LEARN • COMPLETE ACADEMIC NOTE</div>
 <h2>What is ${en}?</h2>
 <h3>Definition</h3><p><strong>${en}</strong> is ${def}.</p>
 <h3>Meaning</h3><p>To understand ${en}, begin with the definition and identify its main ideas. The subject is studied systematically: learners understand the concepts and terminology, examine why they matter, see how they operate in a real organisation, practise applying them and finally evaluate results.</p>
 <h3>Scope</h3><p>The scope covers the people, processes, resources, information, environment, decisions, technology, ethics and performance measures relevant to ${en}. Specific topics later in the course develop these areas in greater depth.</p>
 <h3>Objectives</h3><ul><li>Understand the major concepts and terminology.</li><li>Explain how the subject supports business or organisational decisions.</li><li>Apply principles to realistic situations.</li><li>Use evidence rather than unsupported assumptions.</li><li>Evaluate results and recommend improvements.</li></ul>
 <h3>Importance</h3><p>${en} develops knowledge that can be used in further study, employment, entrepreneurship and organisational decision-making. It helps learners connect theory with real problems and explain why a decision is appropriate.</p>
 <h3>Key Terms</h3><p><strong>Objective:</strong> an intended result. <strong>Strategy:</strong> a coordinated approach for achieving an objective. <strong>Stakeholder:</strong> a person or group affected by or interested in an organisation. <strong>Value:</strong> useful benefit considered in relation to cost or sacrifice. <strong>KPI:</strong> an indicator used to assess progress.</p>
 <h3>Principles</h3><p>A useful academic sequence is <strong>Definition → Explanation → Principle → Example → Application → Analysis → Evaluation</strong>. Learners should not be asked to perform a task before the underlying concept has been explained.</p>
 <h3>Worked Business Example</h3><p>Suppose a small Nigerian training organisation has a business problem. First define the relevant ${en} concept. Next collect useful facts, compare possible decisions, select and explain an appropriate action, keep records of the result and evaluate whether the objective was achieved.</p>
 <h3>Practical Application</h3><p>Select a safe everyday business. Identify one issue connected with ${en}. Write the relevant concept, facts needed, possible decisions, preferred decision, reason for the choice and how the result would be measured.</p>
 <h3>Ethics and Professional Practice</h3><p>Business decisions should be lawful, fair and evidence-based. Learners should avoid deceptive claims, fabricated records, misuse of personal information, plagiarism and other unethical practices.</p>
 <h3>Revision Questions</h3><ol><li>What is ${en}?</li><li>Define ${en} in your own words.</li><li>Explain its scope.</li><li>State and explain five objectives or areas of importance.</li><li>Give a Nigerian business example.</li><li>Explain how theory can be applied to a practical business decision.</li></ol>
 <h3>Assignment</h3><p>Prepare a full academic note on ${en}: definition, meaning, scope, objectives, importance, key terms, principles, example, practical application, ethics and conclusion.</p>
 <h3>Summary</h3><p>${en} should first be understood academically and then applied practically. A strong learner can define the subject, explain its principles, use them in a realistic situation and evaluate the outcome.</p></article>`;
}
let courses=window.ETHAN_COURSES||[],cc=0,ll=0;
for(const c of courses){
 if(!isBiz(c)) continue;
 cc++;
 if(c.id==="academic-social-media-marketing"){c.allBusinessFullNote="5.3";continue;}
 const id="full-note-foundation-"+String(c.id).replace(/[^a-z0-9_-]/gi,"-");
 // remove older v5.3 module if re-run
 c.modules=(c.modules||[]).filter(m=>m.id!==id);
 const title=cleanTitle(c.title), b=note(c);
 const q=[{id:id+"-q1",type:"mcq",question:"What is the correct academic learning sequence?",options:["Definition, explanation, example, application and evaluation","Practical task before meaning","Memorise terms without understanding","Skip the definition"],answer:0,explanation:"ETHAN Learn teaches meaning before application."}];
 c.modules.unshift({id,title:"Start Here — What is "+title+"?",lessons:[
   {id:id+"-lesson",title:"What is "+title+"?",minutes:40,body:b,quiz:q},
   {id:id+"-classwork",title:title+" — Understanding & Classwork",minutes:30,body:b+"<h3>Classwork</h3><p>Without copying, write the definition, explain it, give an example and show one practical application.</p>",quiz:q}
 ]});
 c.allBusinessFullNote="5.3"; ll+=2;
}
window.ETHAN_COURSES=courses;
window.ETHAN_ALL_BUSINESS_FULL_NOTE_AUDIT={courses:cc,newFoundationLessons:ll};
})();