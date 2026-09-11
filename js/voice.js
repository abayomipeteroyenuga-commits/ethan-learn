(function(){
"use strict";

const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const synth=window.speechSynthesis;
let recognition=null,commandsEnabled=false,listening=false;
let speaking=false,paused=false,chunks=[],chunkIndex=0,currentUtterance=null;
let voices=[];

function safeGet(k,d){try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}}
function safeSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
let language=safeGet("ethan_voice_lang","en-NG");
let preferredVoice=safeGet("ethan_tts_voice","");
let rate=Math.max(.75,Math.min(1.25,Number(safeGet("ethan_tts_rate","0.95"))||.95));
let followInstructor=safeGet("ethan_follow_instructor","1")!=="0";
let followSegments=[];
let activeFollowEl=null;
let manualFollowPauseUntil=0;


function toast(m){try{window.ETHAN?.toast?.(m)}catch(e){console.log("[ETHAN Voice]",m)}}
function clean(s){return String(s||"").replace(/\s+/g," ").replace(/https?:\/\/\S+/gi," ").trim()}
function normalize(s){return clean(s).toLowerCase().replace(/[^\w\s]/g," ").replace(/\s+/g," ").trim()}

function loadVoices(){
  try{voices=synth?.getVoices?.()||[]}catch(e){voices=[]}
  refreshVoiceSelects();
}
loadVoices();
try{synth?.addEventListener?.("voiceschanged",loadVoices)}catch(e){}

function chooseVoice(){
  loadVoices();
  if(preferredVoice){
    const exact=voices.find(v=>v.name===preferredVoice);
    if(exact)return exact;
  }
  const target=(language||"en-NG").toLowerCase();
  return voices.find(v=>v.lang?.toLowerCase()===target)
    ||voices.find(v=>target==="en-ng"&&v.lang?.toLowerCase().startsWith("en-gb"))
    ||voices.find(v=>v.lang?.toLowerCase().startsWith(target.split("-")[0]))
    ||voices[0]||null;
}
function refreshVoiceSelects(){
  document.querySelectorAll("[data-listen-voice]").forEach(sel=>{
    const keep=preferredVoice;
    sel.innerHTML='<option value="">Automatic best voice</option>'+voices.filter(v=>/^en/i.test(v.lang||"")).map(v=>`<option value="${String(v.name).replace(/"/g,"&quot;")}">${v.name} · ${v.lang}</option>`).join("");
    sel.value=keep;
  });
}

function splitText(text){
  text=clean(text);
  if(!text)return [];
  const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];
  const out=[];let buf="";
  for(const s0 of sentences){
    const s=clean(s0);
    if(!s)continue;
    if((buf+" "+s).length>700){
      if(buf)out.push(buf);
      if(s.length>700){
        for(let i=0;i<s.length;i+=650)out.push(s.slice(i,i+650));
        buf="";
      }else buf=s;
    }else buf=buf?buf+" "+s:s;
  }
  if(buf)out.push(buf);
  return out.slice(0,80);
}
function clearFollowHighlight(){
  try{activeFollowEl?.classList?.remove("ethan-speaking-now")}catch(e){}
  activeFollowEl=null;
}
function readableLessonElements(){
  const body=document.querySelector(".lesson-body");
  if(!body)return [];
  const title=body.querySelector("h1");
  const nodes=[];
  if(title)nodes.push(title);
  const blocks=[...body.querySelectorAll(":scope > .lesson-html,:scope > .deep-teaching-feature,:scope > .deep-card,:scope > .reasoning-lab,:scope > .intensive-practice,:scope > .do-it-now")];
  const seen=new Set();
  for(const block of blocks){
    const candidates=[...block.querySelectorAll("h2,h3,h4,p,li,.math-line,td,th")];
    if(!candidates.length){
      const t=clean(block.innerText||block.textContent||"");
      if(t&&!seen.has(block)){seen.add(block);nodes.push(block)}
      continue;
    }
    for(const el of candidates){
      if(seen.has(el))continue;
      const t=clean(el.innerText||el.textContent||"");
      if(!t)continue;
      seen.add(el);nodes.push(el);
    }
  }
  return nodes;
}
function buildFollowSegments(){
  const els=readableLessonElements();
  const out=[];
  for(const el of els){
    const text=clean(el.innerText||el.textContent||"");
    if(!text)continue;
    const parts=splitText(text);
    if(parts.length){
      parts.forEach(part=>out.push({text:part,el}));
    }else out.push({text,el});
  }
  return out.slice(0,500);
}
function currentLessonText(){
  return buildFollowSegments().map(x=>x.text).join(" ");
}
function shouldAutoFollow(){
  return followInstructor && Date.now()>=manualFollowPauseUntil;
}
function focusFollowSegment(i){
  clearFollowHighlight();
  const seg=followSegments[i];
  if(!seg?.el)return;
  activeFollowEl=seg.el;
  seg.el.classList.add("ethan-speaking-now");
  if(shouldAutoFollow()){
    try{seg.el.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"})}catch(e){}
  }
}
function setFollowInstructor(v){
  followInstructor=!!v;
  safeSet("ethan_follow_instructor",followInstructor?"1":"0");
  document.querySelectorAll("[data-follow-instructor]").forEach(x=>{
    if(x.type==="checkbox")x.checked=followInstructor;
    x.setAttribute("aria-pressed",followInstructor?"true":"false");
  });
  if(!followInstructor)clearFollowHighlight();
  updatePlayer();
}
function updatePlayer(){
  document.querySelectorAll("[data-listen-status]").forEach(el=>{
    el.textContent=speaking?(paused?"Paused":`Listening ${Math.min(chunkIndex+1,chunks.length)} / ${chunks.length}`):"Ready";
  });
  document.querySelectorAll("[data-listen-play]").forEach(btn=>{
    btn.textContent=paused?"▶ Resume":speaking?"⏸ Pause":"▶ Listen to Lesson";
    btn.setAttribute("aria-pressed",speaking&&!paused?"true":"false");
  });
  document.querySelectorAll("[data-listen-progress]").forEach(bar=>{
    const pct=chunks.length?Math.round((chunkIndex/chunks.length)*100):0;
    bar.style.width=pct+"%";
  });
  document.querySelectorAll("[data-voice-status]").forEach(x=>x.textContent=commandsEnabled?"Voice commands on":"Voice commands off");
  document.querySelectorAll("[data-follow-instructor]").forEach(x=>{
    if(x.type==="checkbox")x.checked=followInstructor;
    x.setAttribute("aria-pressed",followInstructor?"true":"false");
  });
  document.querySelectorAll("[data-follow-status]").forEach(x=>x.textContent=followInstructor?"Following instructor":"Auto-follow off");
}
function stopSpeech(){
  try{synth?.cancel?.()}catch(e){}
  speaking=false;paused=false;chunks=[];followSegments=[];chunkIndex=0;currentUtterance=null;clearFollowHighlight();updatePlayer();
}
function speakChunk(){
  if(!speaking||paused)return;
  if(chunkIndex>=chunks.length){
    speaking=false;paused=false;currentUtterance=null;clearFollowHighlight();updatePlayer();toast("Lesson audio complete");return;
  }
  if(!synth||typeof SpeechSynthesisUtterance==="undefined"){
    speaking=false;updatePlayer();toast("Your browser does not support text-to-speech.");return;
  }
  focusFollowSegment(chunkIndex);
  const u=new SpeechSynthesisUtterance(chunks[chunkIndex]);
  u.lang=language;u.rate=rate;u.pitch=1;u.volume=1;
  const v=chooseVoice();if(v)u.voice=v;
  u.onstart=()=>{speaking=true;paused=false;updatePlayer()};
  u.onend=()=>{if(!speaking)return;chunkIndex++;updatePlayer();setTimeout(speakChunk,120)};
  u.onerror=e=>{
    if(e.error==="canceled"||e.error==="interrupted")return;
    speaking=false;paused=false;updatePlayer();toast("Voice playback stopped. Try another device voice in Settings.");
  };
  currentUtterance=u;
  try{synth.speak(u)}catch(e){speaking=false;updatePlayer();toast("Voice playback could not start.")}
}
function listenLesson(){
  followSegments=buildFollowSegments();
  if(!followSegments.length){toast("Open a lesson first.");return false}
  try{synth?.cancel?.()}catch(e){}
  chunks=followSegments.map(x=>x.text);
  chunkIndex=0;paused=false;speaking=true;updatePlayer();speakChunk();return true;
}
function pauseSpeech(){if(!speaking||paused)return;try{synth?.pause?.()}catch(e){}paused=true;updatePlayer()}
function resumeSpeech(){if(!speaking){listenLesson();return}try{synth?.resume?.()}catch(e){}paused=false;updatePlayer()}
function toggleSpeech(){if(speaking&&!paused)pauseSpeech();else if(speaking&&paused)resumeSpeech();else listenLesson()}
function speakText(text){
  text=clean(text);if(!text)return false;
  try{synth?.cancel?.()}catch(e){}
  followSegments=[];
  chunks=splitText(text);chunkIndex=0;paused=false;speaking=true;updatePlayer();speakChunk();return true;
}
function setLanguage(v){language=v||"en-NG";safeSet("ethan_voice_lang",language);if(recognition)recognition.lang=language;updatePlayer()}
function setVoice(v){preferredVoice=v||"";safeSet("ethan_tts_voice",preferredVoice);updatePlayer()}
function setRate(v){rate=Math.max(.75,Math.min(1.25,Number(v)||.95));safeSet("ethan_tts_rate",String(rate));updatePlayer()}

function clickText(words){
  const els=[...document.querySelectorAll("button,a,[role=button]")];
  const x=els.find(el=>words.some(w=>normalize(el.textContent).includes(w)));
  if(x){x.click();return true}return false;
}
function command(raw){
  const s=normalize(raw);if(!s)return;
  if(s.includes("read lesson")||s.includes("listen lesson")||s.includes("play lesson")){listenLesson();return}
  if(s.includes("pause reading")||s.includes("pause voice")){pauseSpeech();return}
  if(s.includes("resume reading")||s.includes("resume voice")){resumeSpeech();return}
  if(s.includes("stop reading")||s.includes("stop speaking")){stopSpeech();return}
  if(s.includes("next lesson")){clickText(["next lesson"]);return}
  if(s.includes("previous lesson")){clickText(["previous lesson"]);return}
  if(s.includes("mark complete")){clickText(["mark complete"]);return}
  if(s.includes("take quiz")){clickText(["take quiz"]);return}
  if(s.includes("voice off")){disableCommands();return}
  const m=raw.match(/(?:search(?: for)?|find)\s+(.+)/i);
  if(m){location.hash="#/explore?q="+encodeURIComponent(m[1].trim());return}
}
function updateCommands(){
  document.querySelectorAll("[data-voice-status]").forEach(x=>x.textContent=commandsEnabled?"Voice commands on":"Voice commands off");
  document.querySelectorAll("[data-voice-toggle],#settings-voice-toggle,#voiceFab").forEach(x=>{
    x.setAttribute("aria-pressed",commandsEnabled?"true":"false");
    if(x.id==="voiceFab")x.textContent=commandsEnabled?"🎙 Listening":"🎙 Voice";
    if(x.id==="settings-voice-toggle")x.textContent=commandsEnabled?"Deactivate Voice":"Activate Voice";
  });
}
function makeRecognition(){
  if(!SR)return null;
  const r=new SR();r.lang=language;r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
  r.onstart=()=>{listening=true;updateCommands()};
  r.onresult=e=>command(e.results?.[e.results.length-1]?.[0]?.transcript||"");
  r.onerror=e=>{
    listening=false;
    if(e.error==="not-allowed"||e.error==="service-not-allowed"){commandsEnabled=false;toast("Microphone permission is blocked. Lesson audio still works without microphone permission.")}
    updateCommands();
  };
  r.onend=()=>{listening=false;updateCommands();if(commandsEnabled&&!document.hidden)setTimeout(startListening,800)};
  return r;
}
function startListening(){
  if(!commandsEnabled||listening||document.hidden||!SR)return;
  try{if(!recognition)recognition=makeRecognition();recognition.lang=language;recognition.start()}catch(e){}
}
function enableCommands(){
  if(!SR){toast("Voice commands are not supported by this browser. Lesson audio can still be used.");return}
  commandsEnabled=true;safeSet("ethan_voice_commands","1");updateCommands();startListening();
}
function disableCommands(){commandsEnabled=false;safeSet("ethan_voice_commands","0");try{recognition?.abort?.()}catch(e){}listening=false;updateCommands()}
function toggleCommands(){commandsEnabled?disableCommands():enableCommands()}

document.addEventListener("click",e=>{
  if(e.target.closest("[data-listen-play]")){e.preventDefault();toggleSpeech();return}
  if(e.target.closest("[data-listen-stop]")){e.preventDefault();stopSpeech();return}
  if(e.target.closest("[data-follow-instructor]") && e.target.type!=="checkbox"){e.preventDefault();setFollowInstructor(!followInstructor);return}
  if(e.target.closest("[data-voice-toggle],#settings-voice-toggle,#voiceFab")){e.preventDefault();toggleCommands();return}
  if(e.target.closest("#voice-stop-speaking")){e.preventDefault();stopSpeech();return}
});
document.addEventListener("change",e=>{
  if(e.target.matches("[data-listen-voice]"))setVoice(e.target.value);
  if(e.target.matches("[data-listen-rate]"))setRate(e.target.value);
  if(e.target.matches("[data-follow-instructor]") && e.target.type==="checkbox")setFollowInstructor(e.target.checked);
});
["wheel","touchstart","pointerdown"].forEach(evt=>window.addEventListener(evt,e=>{
  if(speaking && e.isTrusted) manualFollowPauseUntil=Date.now()+8000;
},{passive:true}));
window.addEventListener("hashchange",stopSpeech);
window.addEventListener("ethan:rendered",()=>{loadVoices();updatePlayer();updateCommands()});
document.addEventListener("visibilitychange",()=>{if(document.hidden){try{recognition?.abort?.()}catch(e){}}else if(commandsEnabled)setTimeout(startListening,300)});


window.addEventListener("ethan:tutor-response",e=>{
  try{
    const auto=window.StorageService?.get?.().voice?.autoSpeak;
    const text=e.detail?.text;
    if(auto&&text)speakText(text);
  }catch(err){}
});

window.VoiceService={
  get active(){return commandsEnabled},
  toggle:toggleCommands,
  listenLesson,readLesson:listenLesson,
  pause:pauseSpeech,resume:resumeSpeech,stopSpeaking:stopSpeech,
  speak:speakText,
  setPrefs(p={}){
    if(p.language)setLanguage(p.language);
    if(p.voice!==undefined)setVoice(p.voice);
    if(p.rate!==undefined)setRate(p.rate);
    if(typeof p.autoSpeak==="boolean"){
      try{window.StorageService?.update?.(s=>{s.voice=s.voice||{};s.voice.autoSpeak=p.autoSpeak;});}catch(e){}
    }
  },
  attachUI(){loadVoices();updatePlayer();updateCommands()},
  getState:()=>({commandsEnabled,listening,speaking,paused,language,voice:preferredVoice,rate,speechSupported:!!synth,recognitionSupported:!!SR})
};
window.ETHAN_VOICE=window.VoiceService;
loadVoices();updatePlayer();updateCommands();
})();