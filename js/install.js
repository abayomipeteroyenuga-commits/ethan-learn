(function (g) {
  let deferred=null;
  function banner(show){ const b=document.getElementById("install-banner"); if(b)b.classList.toggle("hidden",!show); }
  g.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;banner(true);});
  g.addEventListener("appinstalled",()=>{deferred=null;banner(false);g.ETHAN?.toast?.("ETHAN Learn installed");});
  g.InstallService={
    canPrompt:()=>!!deferred,
    isStandalone:()=>g.matchMedia?.("(display-mode: standalone)").matches||navigator.standalone===true,
    async prompt(){
      if(this.isStandalone()){g.ETHAN?.toast?.("ETHAN Learn is already installed");return "installed";}
      if(deferred){const p=deferred;deferred=null;banner(false);await p.prompt();const r=await p.userChoice;return r?.outcome||"dismissed";}
      const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
      alert(ios?"To install ETHAN Learn on iPhone/iPad: open the Share menu and choose Add to Home Screen.":"To install ETHAN Learn, open your browser menu and choose Install app or Add to Home Screen. Chrome and Edge may also show an install icon in the address bar.");
      return "manual";
    }
  };
})(window);
