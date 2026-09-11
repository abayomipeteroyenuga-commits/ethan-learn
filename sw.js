const CACHE="ethan-learn-v4.8-stability";
const SHELL=[
"/","/index.html","/manifest.webmanifest","/assets/css/app.css","/assets/ethan-learn-logo.svg","/assets/ethan-learn-wordmark.svg",
"/assets/icons/icon-32.png","/assets/icons/icon-192.png","/assets/icons/icon-512.png",
"/data/subjects.js","/data/courses.js","/data/expanded-academic-catalog.js","/data/full-content.js","/data/accounting-comprehensive.js",
"/data/practical-assessment.js","/data/global-core-curriculum.js","/data/nigeria-curriculum.js","/data/comprehensive-topic-coverage.js",
"/data/deep-teaching.js","/data/math-teaching-procedure.js","/data/reasoning-subject-teaching.js","/data/practice-intensive.js","/data/learningPaths.js",
"/config.js","/js/storage.js","/js/cloud-sync.js","/js/auth.js","/js/progress.js","/js/search.js","/js/tutor.js","/js/services-ai.js",
"/js/install.js","/js/voice.js","/js/practice-lab.js","/js/app.js","/js/world-class.js"
];
self.addEventListener("install",e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);for(const u of SHELL){try{await c.add(u)}catch(_){}}await self.skipWaiting()})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==self.location.origin||u.pathname.startsWith("/api/"))return;
 if(r.mode==="navigate"){
  e.respondWith((async()=>{try{const res=await fetch(r);if(res&&res.ok){const c=await caches.open(CACHE);c.put("/index.html",res.clone()).catch(()=>{});}return res}catch(_){return (await caches.match("/index.html"))||Response.error()}})());return;
 }
 if(/\.(?:js|css|json|webmanifest)$/.test(u.pathname)){
  e.respondWith((async()=>{try{const res=await fetch(r);if(res&&res.ok){const c=await caches.open(CACHE);c.put(r,res.clone()).catch(()=>{});}return res}catch(_){return (await caches.match(r))||Response.error()}})());return;
 }
 e.respondWith((async()=>{const hit=await caches.match(r);if(hit)return hit;try{return await fetch(r)}catch(_){return Response.error()}})());
});
