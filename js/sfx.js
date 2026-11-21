"use strict";
// ---------- SES (Web Audio ile sentezlenir, dosya gerekmez) ----------
const SFX = (()=>{
  let ac=null, master=null, noiseBuf=null, muted=false;
  try{ muted = localStorage.getItem('kvk_mute')==='1'; }catch(e){}
  function init(){
    if(ac){ if(ac.state==='suspended') ac.resume(); return; }
    const Ctx = window.AudioContext || window.webkitAudioContext; if(!Ctx) return;
    ac = new Ctx(); master = ac.createGain(); master.gain.value = muted?0:0.6; master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate*2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  }
  function tone(freq, dur, {type='sine', vol=0.3, slide=0, delay=0}={}){
    const t=ac.currentTime+delay, o=ac.createOscillator(), g=ac.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(20,freq+slide), t+dur);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+0.05);
  }
  function noise(dur, {vol=0.3, freq=1000, q=1, type='bandpass', delay=0, attack=0.005, sweep=0}={}){
    const t=ac.currentTime+delay, s=ac.createBufferSource(), f=ac.createBiquadFilter(), g=ac.createGain();
    s.buffer=noiseBuf; f.type=type; f.Q.value=q; f.frequency.setValueAtTime(freq,t);
    if(sweep) f.frequency.exponentialRampToValueAtTime(Math.max(50,freq+sweep), t+dur);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+attack); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t+dur+0.05);
  }
  const fx = {
    click(){ tone(620,0.05,{type:'square',vol:0.035}); },
    tick(n=0){ tone(520+n*45,0.07,{type:'triangle',vol:0.09}); tone(1040+n*90,0.05,{vol:0.03,delay:0.02}); },
    untick(){ tone(420,0.07,{type:'triangle',vol:0.07,slide:-80}); },
    select(){ tone(880,0.06,{type:'triangle',vol:0.06}); },
    swing(){ noise(0.18,{freq:700,sweep:2600,q:2,vol:0.25}); },
    hit(){ noise(0.12,{freq:450,q:0.8,vol:0.5,type:'lowpass'}); tone(150,0.15,{type:'triangle',vol:0.4,slide:-90}); },
    clang(){ tone(1850,0.4,{type:'square',vol:0.05}); tone(2700,0.35,{vol:0.08}); noise(0.08,{freq:3200,vol:0.25}); },
    heavy(){ noise(0.28,{freq:260,type:'lowpass',vol:0.75}); tone(95,0.32,{vol:0.6,slide:-55}); },
    crit(){ fx.heavy(); tone(900,0.45,{type:'sawtooth',vol:0.08,slide:-500,delay:0.03}); },
    miss(){ noise(0.25,{freq:1600,sweep:-1100,q:3,vol:0.16}); },
    step(){ noise(0.07,{freq:320,type:'lowpass',vol:0.28}); noise(0.06,{freq:300,type:'lowpass',vol:0.2,delay:0.13}); },
    rest(){ noise(0.7,{freq:650,q:0.7,vol:0.12,attack:0.25,sweep:-350}); },
    taunt(){ tone(300,0.12,{type:'sawtooth',vol:0.09,slide:160}); tone(460,0.16,{type:'sawtooth',vol:0.09,slide:-220,delay:0.12}); },
    cheer(a=1){ noise(0.5+1.3*a,{freq:1250,q:0.5,vol:0.1+0.14*a,attack:0.15});
      for(let i=0;i<Math.round(5*a);i++) tone(rnd(500,950),0.16,{type:'triangle',vol:0.03,slide:rnd(100,350),delay:rnd(0,0.9)}); },
    boo(){ for(let i=0;i<6;i++) tone(rnd(105,170),0.9,{type:'sawtooth',vol:0.025,slide:-40,delay:rnd(0,0.25)}); },
    coin(){ tone(988,0.08,{type:'square',vol:0.07}); tone(1319,0.28,{type:'square',vol:0.07,delay:0.08}); },
    equip(){ fx.coin(); tone(2200,0.25,{vol:0.05,delay:0.12}); noise(0.06,{freq:3500,vol:0.12,delay:0.12}); },
    anvil(){ tone(1450,0.35,{vol:0.035}); tone(2210,0.25,{vol:0.02}); noise(0.04,{freq:3000,vol:0.06}); },
    grumble(){ tone(150,0.28,{type:'sawtooth',vol:0.07,slide:-35}); tone(118,0.34,{type:'sawtooth',vol:0.07,slide:-25,delay:0.22}); noise(0.3,{freq:260,type:'lowpass',vol:0.18,delay:0.05}); },
    door(){ noise(0.18,{freq:180,type:'lowpass',vol:0.4}); tone(70,0.2,{vol:0.25,slide:-20}); },
    whoosh(){ noise(0.35,{freq:400,sweep:1400,q:0.8,vol:0.12,attack:0.08}); },
    win(){ [523,659,784,1047].forEach((f,i)=>tone(f,i===3?0.7:0.18,{type:'square',vol:0.08,delay:i*0.15})); fx.cheer(1.4); },
    lose(){ [392,349,311,262].forEach((f,i)=>tone(f,0.4,{type:'triangle',vol:0.15,delay:i*0.3})); },
    levelup(){ [523,659,784,1047,1319].forEach((f,i)=>tone(f,0.16,{type:'triangle',vol:0.12,delay:0.9+i*0.08})); },
    gong(){ tone(110,2.2,{vol:0.4}); tone(166,1.7,{vol:0.15}); tone(277,1.2,{type:'triangle',vol:0.05}); noise(0.3,{freq:220,type:'lowpass',vol:0.3}); },
  };
  return {
    init,
    play(n,...args){ if(!ac || muted) return; try{ fx[n](...args); }catch(e){ console.warn('ses hatası:', n, e); } },
    toggle(){ muted=!muted; try{ localStorage.setItem('kvk_mute', muted?'1':'0'); }catch(e){} if(master) master.gain.value = muted?0:0.6; return muted; },
    get muted(){ return muted; },
  };
})();
const buzz = ms => { try{ if(!SFX.muted && navigator.vibrate) navigator.vibrate(ms); }catch(e){} };
