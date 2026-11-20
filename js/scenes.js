"use strict";
// ---------- SAHNELER: başlık, avlu, sonuç amblemi, portre ----------

// Başlık: gün batımında arena silueti, kuma saplanmış kılıç ve miğfer
const TITLE = {sc:null, motes:[]};
function titleFrame(t,dt){
  if(!TITLE.sc) TITLE.sc=makeScene($('cvTitle'),400);
  const S=TITLE.sc; if(!S.fit()) return; const c=S.ctx; S.begin(); const W=400, H=S.LH;
  S.blit(S.layer('bg',(x)=>{
    x.fillStyle=lg(x,0,0,0,H*0.75,[[0,'#1a1838'],[0.35,'#4a2f55'],[0.62,'#c0583e'],[0.82,'#f0a050'],[1,'#ffd88a']]); x.fillRect(0,0,W,H);
    x.fillStyle=rg(x,318,H*0.38,190,[[0,'rgba(255,230,160,0.9)'],[0.25,'rgba(255,170,90,0.45)'],[1,'rgba(255,140,80,0)']]); x.fillRect(0,0,W,H);
    circ(x,318,H*0.38,28); x.fillStyle=lg(x,0,H*0.38-28,0,H*0.38+28,[[0,'#fff6d6'],[1,'#ffc76a']]); x.fill();
    const R=rng(4); ridge(x,H*0.66,14,'#7a4048',3,0.03);
    // arena silueti
    const cx=210, top=H*0.42, base=H*0.72, rx=150, ry=26;
    x.beginPath(); x.ellipse(cx,top,rx,ry,0,0,Math.PI); x.lineTo(cx-rx,base); x.ellipse(cx,base,rx,ry,0,Math.PI,0,true); x.closePath();
    x.fillStyle=lg(x,0,top,0,base,[[0,'#3c1f22'],[1,'#26131a']]); x.fill();
    x.beginPath(); x.ellipse(cx,top-1,rx,ry,0,Math.PI,TAU); x.ellipse(cx,top+3,rx*0.97,ry*0.8,0,TAU,Math.PI,true); x.fillStyle='#2d171c'; x.fill();
    for(let tr=0;tr<3;tr++){ const ty=top+8+tr*(base-top-8)/3, th=(base-top-8)/3;
      for(let j=0;j<18;j++){ const a0=Math.PI-j*Math.PI/18, a1=a0-Math.PI/18, am=(a0+a1)/2, x0=cx+rx*Math.cos(a0), x1=cx+rx*Math.cos(a1), w=x1-x0; if(w<2.5) continue;
        const ax=x0+w*0.2, aw=w*0.6, ay=ty+ry*Math.sin(am)+th*0.22, ah=th*0.66, lit=clamp(1-Math.abs(x0+w/2-318)/170,0,1);
        archPath(x,ax,ay,aw,ah); x.fillStyle=`rgba(255,${150+lit*80},${80+lit*60},${0.25+lit*0.65})`; x.fill(); } }
    x.strokeStyle='rgba(255,170,100,0.7)'; x.lineWidth=1.2; x.beginPath(); x.ellipse(cx,top,rx,ry,0,Math.PI*1.05,Math.PI*1.95); x.stroke();
    // kum tepeleri
    x.beginPath(); x.moveTo(0,H); x.lineTo(0,H*0.78); x.quadraticCurveTo(120,H*0.7,240,H*0.8); x.quadraticCurveTo(330,H*0.86,400,H*0.76); x.lineTo(400,H); x.closePath();
    x.fillStyle=lg(x,0,H*0.7,0,H,[[0,'#c98a54'],[0.4,'#9a5e36'],[1,'#4a2a18']]); x.fill();
    speckle(x,0,H*0.75,W,H*0.25,500,['#e0a870','#6a3c20'],R,0.5,1.2,0.4);
  }));
  // ön plan: kılıç, miğfer, kalkan (canlı ışıltı için her karede)
  const by=S.LH*0.84;
  c.fillStyle='rgba(30,12,6,0.45)'; ell(c,128,by+3,50,6); c.fill();
  c.save(); c.translate(110,by); c.scale(2.4,2.4);
  drawShield(c,ITEMS.shield.list[2].g,22,-15,null,false);
  drawWeapon(c,ITEMS.weapon.list[4].g,0,-36,0.05,{},t);
  c.translate(1,-46); drawHelmet(c,ITEMS.helmet.list[3].g,7.5,{},t); c.restore();
  // toz zerreleri
  if(TITLE.motes.length<26) TITLE.motes.push({x:rnd(0,400),y:rnd(0,S.LH),v:rnd(0.004,0.012),s:rnd(0.6,1.6),p:rnd(0,6)});
  c.save(); c.globalCompositeOperation='lighter';
  for(const m of TITLE.motes){ m.x+=m.v*dt; m.y-=m.v*dt*0.3; if(m.x>410){ m.x=-10; m.y=rnd(0,S.LH); }
    c.fillStyle=`rgba(255,210,150,${0.25+0.25*Math.sin(t/500+m.p)})`; circ(c,m.x,m.y,m.s); c.fill(); }
  c.restore();
  vignette(c,400,S.LH,0.55);
}

// Avlu arka planı (oluştur / antrenman / gladyatör ekranları)
function ludusBg(x,W,H,variant){
  const R=rng(31);
  x.fillStyle=lg(x,0,0,0,H,[[0,'#2a1912'],[0.62,'#4a3020'],[0.63,'#8a6a48'],[1,'#c9a77a']]); x.fillRect(0,0,W,H);
  masonry(x,0,0,W,H*0.62,'#5e4636',R,10);
  x.fillStyle=lg(x,0,0,0,H*0.62,[[0,'rgba(10,5,5,0.6)'],[1,'rgba(10,5,5,0.15)']]); x.fillRect(0,0,W,H*0.62);
  for(const ax of [70,330]){ archPath(x,ax-28,H*0.16,56,H*0.46); x.fillStyle='#1a0e0a'; x.fill(); voussoirs(x,ax-28,H*0.16,56,'#6a5040'); }
  for(const [bx,col] of [[150,'#9e2b22'],[250,'#9e2b22']]){ x.fillStyle='#3a2414'; x.fillRect(bx-16,H*0.06,32,3);
    x.beginPath(); x.moveTo(bx-14,H*0.07); x.lineTo(bx+14,H*0.07); x.lineTo(bx+14,H*0.4); x.lineTo(bx,H*0.34); x.lineTo(bx-14,H*0.4); x.closePath();
    x.fillStyle=lg(x,bx-14,0,bx+14,0,[[0,shade(col,0.15)],[1,shade(col,-0.3)]]); x.fill(); x.strokeStyle='#d8b05a'; x.lineWidth=1.2; x.stroke();
    x.save(); x.translate(bx,H*0.2); x.scale(0.9,0.9); drawShield(x,ITEMS.shield.list[2].g,0,0,null,true); x.restore(); }
  if(variant==='train'){ x.save(); x.translate(330,H*0.62); trainingDummy(x); x.restore(); }
  x.fillStyle='rgba(30,15,8,0.5)'; x.fillRect(0,H*0.615,W,3);
  speckle(x,0,H*0.63,W,H*0.37,700,['#e6c592','#8a6440'],R,0.5,1.4,0.35);
  x.strokeStyle='rgba(120,80,40,0.35)'; x.lineWidth=1.2; ell(x,W/2,H*0.93,120,14); x.stroke();
  x.fillStyle=rg(x,W/2,H*0.7,170,[[0,'rgba(255,210,150,0.28)'],[1,'rgba(255,210,150,0)']]); x.fillRect(0,0,W,H);
  vignette(x,W,H,0.55);
}
function trainingDummy(x){
  x.fillStyle='#5a3a22'; x.fillRect(-2.5,-70,5,70); x.fillRect(-18,-56,36,4);
  x.beginPath(); x.moveTo(-11,-62); x.quadraticCurveTo(-14,-38,-9,-18); x.lineTo(9,-18); x.quadraticCurveTo(14,-38,11,-62); x.closePath();
  x.fillStyle=lg(x,-12,0,12,0,[[0,'#d9bd78'],[1,'#7a6030']]); x.fill(); x.strokeStyle='#5a4420'; x.lineWidth=0.7; x.stroke();
  circ(x,0,-70,8); x.fillStyle='#c9ac68'; x.fill(); x.stroke();
  x.strokeStyle='#7a2a20'; x.lineWidth=1.6; x.beginPath(); x.moveTo(-12,-50); x.lineTo(12,-50); x.moveTo(-11,-30); x.lineTo(11,-30); x.stroke();
}
// Oyuncak bebek sahnesi: avlu + karakter (vücut yumuşakça hedefe ilerler)
function dollFrame(D,t,dt){
  if(!D.sc) D.sc=makeScene($(D.cv),400);
  const S=D.sc; if(!S.fit()) return; const c=S.ctx; S.begin();
  S.blit(S.layer('bg',(x,W,H)=>ludusBg(x,W,H,D.variant)));
  const src=D.src(); if(!src) return;
  const look=lookOf(src); D.body = D.body ? tweenBody(D.body,look.body,dt) : {...look.body}; look.body=D.body;
  if(D.preview) Object.assign(look, D.preview);
  const st={facing:1,seed:3,stand:true};
  if(D.act){ st.kind=D.act.kind; st.act=D.act.act; st.p=(t-D.act.t0)/D.act.dur; if(st.p>=1) D.act=null; }
  const size=Math.min(196, S.LH*0.76);
  glow(c,200,S.LH*0.86,70,'#ffcf8a',0.12);
  drawHero(c,200,S.LH*0.93,size,look,st,t);
}

// Sonuç amblemi
const RESULT={sc:null, win:true, parts:new Particles(), t0:0};
function resultFrame(t,dt){
  if(!RESULT.sc) RESULT.sc=makeScene($('cvResult'),300);
  const S=RESULT.sc; if(!S.fit()) return; const c=S.ctx; S.begin(); c.clearRect(0,0,300,S.LH);
  const cx=150, cy=S.LH*0.52, k=easeOut((t-RESULT.t0)/700);
  c.save(); c.translate(cx,cy); c.scale(0.6+0.4*k,0.6+0.4*k); c.globalAlpha=k;
  if(RESULT.win){
    c.save(); c.globalCompositeOperation='lighter'; for(let i=0;i<14;i++){ const a=i/14*TAU+t/4000; c.fillStyle='rgba(255,200,100,0.08)'; c.beginPath(); c.moveTo(0,0); c.arc(0,0,120,a,a+0.12); c.fill(); } c.restore();
    glow(c,0,0,80,'#ffcf6a',0.4);
    for(const s of [-1,1]){ c.save(); c.scale(s*1.45,1.45); c.rotate(-0.55); drawWeapon(c,ITEMS.weapon.list[5].g,0,22,Math.PI,{},t); c.restore(); }
    for(const s of [-1,1]){ c.save(); c.scale(s,1);
      c.strokeStyle='#8a5a14'; c.lineWidth=2.2; c.beginPath(); c.arc(0,0,60,1.4,-0.8,true); c.stroke();
      for(let i=0;i<10;i++){ const a=1.32-i*0.22, px=Math.cos(a)*60, py=Math.sin(a)*60, tg=a-Math.PI/2, sz=1-i*0.03;
        for(const sd of [-1,1]){ c.save(); c.translate(px,py); c.rotate(tg+sd*0.6); c.scale(sz,sz);
          c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(6,-4.2,14,0); c.quadraticCurveTo(6,4.2,0,0); c.closePath();
          c.fillStyle=lg(c,0,-4,0,4,[[0,'#fff0b0'],[0.5,'#e8b84a'],[1,'#9a6a16']]); c.fill(); c.strokeStyle='#6a4410'; c.lineWidth=0.7; c.stroke();
          line(c,1,0,12,0,'rgba(110,70,20,0.7)',0.5); c.restore(); } }
      c.restore(); }
    if(Math.random()<0.25) RESULT.parts.add({x:rnd(-120,120),y:-80,vx:rnd(-0.2,0.2),vy:rnd(0.6,1.2),g:0.01,decay:0.006,size:rnd(1.8,3),col:pick(['#ffd86b','#f0c35a','#fff2c0']),kind:'petal'});
  } else {
    glow(c,0,10,70,'#6a5a80',0.25);
    c.fillStyle='rgba(20,10,8,0.5)'; ell(c,0,38,60,8); c.fill();
    c.save(); c.translate(-6,36); drawWeapon(c,{...ITEMS.weapon.list[0].g,len:14},0,-28,0.18,{},t); c.restore();
    c.save(); c.translate(26,30); c.rotate(1.25); drawWeapon(c,{...ITEMS.weapon.list[0].g,len:10,t:'sword'},0,0,1.57,{},t); c.restore();
    if(Math.random()<0.15) RESULT.parts.add({x:rnd(-140,140),y:rnd(-20,40),vx:rnd(0.1,0.4),vy:rnd(-0.1,0.05),decay:0.006,size:rnd(4,8),grow:0.05,col:'#7a6a6a',kind:'smoke',a:0.35});
  }
  RESULT.parts.step(dt); RESULT.parts.draw(c);
  c.restore();
}

// Portre: küçük tuvale baş-omuz çizimi
function drawPortrait(cv, src, facing=1){
  const r=cv.getBoundingClientRect(), d=DPR(), w=r.width||64, h=r.height||64;
  cv.width=Math.round(w*d); cv.height=Math.round(h*d);
  const c=cv.getContext('2d'); c.setTransform(d,0,0,d,0,0);
  const s=h/44, lk=lookOf(src); lk.weapon={t:'none'}; lk.shield={t:'none'};
  drawHero(c,w/2-facing*2,4+102*s,100*s/(1+bodyOf(src).m*0.1),lk,{facing,shadow:false,seed:2,stand:true},800);
}
