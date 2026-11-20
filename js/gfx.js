"use strict";
// ---------- ÇİZİM YARDIMCILARI ----------
const TAU = Math.PI*2;
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const lerp = (a,b,t) => a+(b-a)*t;
const ease = t => { t=clamp(t,0,1); return t*t*(3-2*t); };
const easeOut = t => 1-Math.pow(1-clamp(t,0,1),3);
const easeIn = t => Math.pow(clamp(t,0,1),2.2);
const rnd = (a,b) => a + Math.random()*(b-a);
const ri = (a,b) => Math.floor(rnd(a,b+1));
const pick = a => a[Math.floor(Math.random()*a.length)];

// Renkler: aydınlık tonlar sıcağa, gölgeler morumsu soğuğa kayar
function hexRgb(h){ h=h.replace('#',''); if(h.length===3) h=h.replace(/./g,'$&$&'); const n=parseInt(h,16); return [n>>16&255,n>>8&255,n&255]; }
function rgbHex(r,g,b){ return '#'+[r,g,b].map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join(''); }
const _mixC = new Map();
function mix(a,b,t){
  t = Math.round(t*40)/40;
  const k=a+b+t; let v=_mixC.get(k);
  if(!v){ const A=hexRgb(a),B=hexRgb(b); v=rgbHex(lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t)); _mixC.set(k,v); }
  return v;
}
const shade = (c,amt) => amt>=0 ? mix(c,'#fff1d6',amt) : mix(c,'#1b1018',-amt);
function rgba(c,a){ const [r,g,b]=hexRgb(c); return `rgba(${r},${g},${b},${a})`; }

// Tekrarlanabilir rastgelelik (aynı tohum = aynı şehir/kalabalık)
function rng(seed){ let a=seed>>>0; return ()=>{ a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function hashStr(s){ let h=2166136261; for(const ch of String(s)){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; }

// ---------- TUVAL ----------
const DPR = () => Math.min(3, window.devicePixelRatio||1);
// Mantıksal genişlik sabit; yükseklik CSS oranından gelir.
function makeScene(cv, LW){
  const sc = {cv, ctx:cv.getContext('2d'), LW, LH:LW*0.6, k:1, pw:0, ph:0, layers:{}};
  sc.fit = () => {
    const r = cv.getBoundingClientRect(); if(!r.width) return false;
    const pw = Math.round(r.width*DPR()), ph = Math.round(r.height*DPR());
    if(pw!==sc.pw || ph!==sc.ph){ cv.width=pw; cv.height=ph; sc.pw=pw; sc.ph=ph; sc.layers={}; }
    sc.k = pw/LW; sc.LH = LW*ph/pw; return true;
  };
  sc.begin = () => { sc.ctx.setTransform(sc.k,0,0,sc.k,0,0); };
  // Statik katmanı bir kez çizip önbellekte tutar
  sc.layer = (key, fn) => {
    let L = sc.layers[key];
    if(!L){ L=document.createElement('canvas'); L.width=sc.pw; L.height=sc.ph; const x=L.getContext('2d'); x.setTransform(sc.k,0,0,sc.k,0,0); fn(x, sc.LW, sc.LH); sc.layers[key]=L; }
    return L;
  };
  sc.blit = (L) => { const c=sc.ctx; c.setTransform(1,0,0,1,0,0); c.drawImage(L,0,0); sc.begin(); };
  sc.toLocal = (e) => { const r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*LW, y:(e.clientY-r.top)/r.height*sc.LH}; };
  return sc;
}

// ---------- ŞEKİLLER ----------
function rr(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function poly(c,p){ c.beginPath(); c.moveTo(p[0],p[1]); for(let i=2;i<p.length;i+=2) c.lineTo(p[i],p[i+1]); c.closePath(); }
function ell(c,x,y,rx,ry,rot=0){ c.beginPath(); c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),rot,0,TAU); }
function circ(c,x,y,r){ c.beginPath(); c.arc(x,y,Math.max(.01,r),0,TAU); }
function lg(c,x0,y0,x1,y1,stops){ const g=c.createLinearGradient(x0,y0,x1,y1); for(const [o,col] of stops) g.addColorStop(o,col); return g; }
function rg(c,x,y,r,stops,r0=0){ const g=c.createRadialGradient(x,y,r0,x,y,Math.max(.01,r)); for(const [o,col] of stops) g.addColorStop(o,col); return g; }
function fs(c,fill,stroke,lw){ if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=lw; c.stroke(); } }
function line(c,x0,y0,x1,y1,col,lw){ c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1,y1); c.strokeStyle=col; c.lineWidth=lw; c.stroke(); }
// Yumuşak ışık lekesi (ekleyici)
function glow(c,x,y,r,col,a=1){ c.save(); c.globalCompositeOperation='lighter'; c.globalAlpha=a; c.fillStyle=rg(c,x,y,r,[[0,col],[1,rgba(col,0)]]); c.fillRect(x-r,y-r,r*2,r*2); c.restore(); }
// Tanecik dokusu
function speckle(c,x,y,w,h,n,cols,R,s0=0.4,s1=1.2,a=0.25){
  c.save(); c.globalAlpha=a;
  for(let i=0;i<n;i++){ c.fillStyle=cols[(R()*cols.length)|0]; const s=s0+R()*(s1-s0); c.fillRect(x+R()*w, y+R()*h, s, s*0.8); }
  c.restore();
}
// Kenar karartma
function vignette(c,W,H,a=0.45,col='#0b0604'){
  const g=c.createRadialGradient(W/2,H*0.55,Math.min(W,H)*0.35,W/2,H*0.55,Math.max(W,H)*0.78);
  g.addColorStop(0,rgba(col,0)); g.addColorStop(1,rgba(col,a)); c.fillStyle=g; c.fillRect(0,0,W,H);
}

// ---------- PARÇACIKLAR ----------
function Particles(){ this.a=[]; }
Particles.prototype.add = function(p){ this.a.push(Object.assign({vx:0,vy:0,g:0,drag:1,life:1,decay:0.02,size:2,grow:0,a:1,kind:'dot',col:'#fff'},p)); };
Particles.prototype.step = function(dt, floorY){
  const k=dt/16.7;
  for(const p of this.a){
    p.vy+=p.g*k; p.vx*=Math.pow(p.drag,k); p.vy*=Math.pow(p.drag,k);
    p.x+=p.vx*k; p.y+=p.vy*k; p.life-=p.decay*k; p.size+=p.grow*k;
    if(floorY!==undefined && p.floor && p.y>p.floor){ p.y=p.floor; p.vy*=-0.25; p.vx*=0.5; p.g*=0.5; }
  }
  this.a = this.a.filter(p=>p.life>0);
};
Particles.prototype.draw = function(c){
  for(const p of this.a){
    const L=Math.max(0,p.life); c.globalAlpha=L*p.a;
    if(p.kind==='smoke'){ c.fillStyle=rg(c,p.x,p.y,p.size,[[0,rgba(p.col,0.55)],[1,rgba(p.col,0)]]); c.fillRect(p.x-p.size,p.y-p.size,p.size*2,p.size*2); }
    else if(p.kind==='spark'){ c.globalCompositeOperation='lighter'; line(c,p.x,p.y,p.x-p.vx*2.2,p.y-p.vy*2.2,p.col,p.size); c.globalCompositeOperation='source-over'; }
    else if(p.kind==='ember'){ c.globalCompositeOperation='lighter'; c.fillStyle=p.col; circ(c,p.x,p.y,p.size); c.fill(); c.globalCompositeOperation='source-over'; }
    else if(p.kind==='petal'){ c.save(); c.translate(p.x,p.y); c.rotate(p.x*0.1+p.life*6); c.fillStyle=p.col; ell(c,0,0,p.size,p.size*0.45); c.fill(); c.restore(); }
    else { c.fillStyle=p.col; circ(c,p.x,p.y,p.size); c.fill(); }
  }
  c.globalAlpha=1;
};
