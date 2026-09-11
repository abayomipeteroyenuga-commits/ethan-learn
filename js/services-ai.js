(function(g){
  g.AIProvider={
    mode:'hybrid',
    async complete(messages,context){
      const last=messages?.length?messages[messages.length-1].content:'';
      try{
        const token=await g.AuthService?.token?.();
        if(!token) return TutorService.ask(last,context);
        const res=await fetch('/api/tutor',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({message:last,context:context||{},history:(messages||[]).slice(-8)})});
        if(!res.ok)throw new Error('Tutor request failed');const data=await res.json();if(!data.text)throw new Error('Empty tutor response');return {source:'ethan-tutor-ai',text:data.text};
      }catch(e){console.warn('Remote tutor fallback',e);return TutorService.ask(last,context);}
    }
  };
})(window);
