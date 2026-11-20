"use strict";
// ---------- ŞEHİR SAHNESİ: canlı katman, dokunma, yürüme ----------
const PLACES = [
  {id:'smith',  name:'DEMİRCİ',   r:[4,296,124,176],   door:{x:66,y:490},  label:{x:66,y:367}},
  {id:'armor',  name:'ZIRHÇI',    r:[138,268,126,204], door:{x:201,y:488}, label:{x:201,y:359}},
  {id:'shield', name:'KALKANCI',  r:[274,294,122,178], door:{x:335,y:490}, label:{x:335,y:381}},
  {id:'train',  name:'ANTRENMAN', r:[280,508,120,92],  door:{x:318,y:594}, label:{x:342,y:513}},
  {id:'arena',  name:'ARENA',     r:[86,138,252,128],  door:{x:269,y:480}, label:{x:212,y:208}},
];
const CITY = { sc:null, hero:null, npcs:[], parts:new Particles(), press:null, busy:false, idle:0, nextSpark:0, nextSmoke:0, birds:[], look:null, act:null };

function cityInit(){
  if(CITY.sc) return;
  const cv=$('cvCity'); CITY.sc=makeScene(cv,400);
  CITY.hero={x:200,y:568,path:[],walk:0,wa:0,facing:1,act:null};
  for(let i=0;i<5;i++) CITY.npcs.push(makeNpc(i));
  for(let i=0;i<3;i++) CITY.birds.push({x:rnd(0,400),y:rnd(50,150),v:rnd(0.008,0.016),ph:rnd(0,6)});
  cv.addEventListener('pointerdown',e=>{ if(CITY.busy) return; const p=CITY.sc.toLocal(e); CITY.press=hitPlace(p); });
  cv.addEventListener('pointerup',e=>{ if(CITY.busy) return; const p=CITY.sc.toLocal(e), h=hitPlace(p); if(h && CITY.press && h.id===CITY.press.id) cityTap(h); CITY.press=null; });
  cv.addEventListener('pointerleave',()=>CITY.press=null);
}
function makeNpc(i){
  const R=rng(100+i*7), garb=pk(R,['tunic','tunic','robe']), fem=garb==='robe';
  const look={civ:true,garb,fem,skin:pk(R,LOOK.skin),hair:fem?pk(R,['bun','long']):pk(R,['short','bald','short']),hairCol:pk(R,LOOK.hairCol),
    beard:fem?'none':pk(R,['none','stubble','full']),cloth:pk(R,['#7a6a3a','#5e6f84','#8a4a3a','#4a6a5a','#a08a5a','#5a4a7a','#9a7a52']),
    body:{m:R()*0.3,v:R()*0.4,a:0.2,k:0,d:0,c:0},weapon:{t:'none'},armor:{t:'none'},helmet:{t:'none'},shield:{t:'none'}};
  return {look,x:R()*440-20,y:483+R()*20,dir:R()<0.5?1:-1,speed:0.012+R()*0.01,walk:R()*6,seed:i,pause:0};
}
function hitPlace(p){
  if(Math.hypot(p.x-CITY.hero.x,(p.y-CITY.hero.y+30)*0.6)<26) return {id:'hero'};
  if(Math.hypot((p.x-80)/60,(p.y-560)/26)<1) return {id:'fountain'};
  for(const pl of PLACES){ if(pl.id==='arena') continue; const [x,y,w,h]=pl.r; if(p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h) return pl; }
  const a=PLACES[4], [x,y,w,h]=a.r; if(p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h) return a;
  return null;
}
function cityTap(pl){
  hideHint();
  if(pl.id==='hero'){ SFX.play('select'); return cityGo('char'); }
  if(pl.id==='fountain'){ SFX.play('select'); for(let i=0;i<14;i++) CITY.parts.add({x:80+rnd(-30,30),y:560+rnd(-6,6),vx:rnd(-0.6,0.6),vy:rnd(-2.2,-1),g:0.09,decay:0.03,size:rnd(0.8,1.6),col:'#bfe6f0',kind:'dot'}); return; }
  cityGo(pl.id);
}
// Kahramanı kapıya yürüt, sonra ekranı aç
function cityGo(id){
  if(CITY.busy) return;
  const pl=PLACES.find(p=>p.id===id), H=CITY.hero, dest=()=>{
    if(id==='char') openChar(); else if(id==='train') openTrain(); else if(id==='arena') openArena(); else openShop(id); };
  if(!pl || !$('s-city').classList.contains('on')){ dest(); return; }
  CITY.busy=true; SFX.play('step');
  const lane=Math.max(Math.min(H.y,pl.door.y+(pl.id==='train'?0:4)),pl.door.y);
  H.path = pl.id==='train' ? [{x:pl.door.x,y:pl.door.y}] : [{x:lerp(H.x,pl.door.x,0.35),y:Math.max(lane,pl.door.y)+10},{x:pl.door.x,y:pl.door.y}];
  H.onArrive=()=>{ SFX.play(pl.id==='arena'?'whoosh':'door'); fadeTo(()=>{ CITY.busy=false; dest(); }); };
}
function cityEnter(fromId){
  cityInit(); CITY.look=lookOf(P); CITY.busy=false; CITY.press=null; CITY.idle=0;
  const pl=PLACES.find(p=>p.id===fromId), H=CITY.hero;
  if(pl){ H.x=pl.door.x; H.y=Math.min(596,pl.door.y+6); H.path=[{x:lerp(pl.door.x,200,0.4),y:Math.min(574,pl.door.y+(pl.id==='train'?-20:40))}]; H.onArrive=null; }
  else { H.x=200; H.y=568; H.path=[]; }
  const hint=$('cityHint'); let seen=false; try{ seen=localStorage.getItem('kvk_hint')==='1'; }catch(e){} hint.style.opacity=seen?0:1;
}
function hideHint(){ $('cityHint').style.opacity=0; try{ localStorage.setItem('kvk_hint','1'); }catch(e){} }

function cityFrame(t,dt){
  const S=CITY.sc; if(!S || !S.fit()) return;
  const c=S.ctx; S.begin();
  S.blit(S.layer('bg',(x,W,H)=>{ citySky(x,W); ridge(x,222,20,'#9b87a6',1,0.021); ridge(x,240,22,'#7f6d8c',2,0.033);
    templeHill(x,rng(5)); aqueduct(x); colosseum(x,rng(6)); backHouses(x,rng(8)); cityStreet(x,W,H); smithShop(x,rng(21)); armorShop(x,rng(22)); shieldShop(x,rng(23)); }));
  // kuşlar ve ışık huzmeleri
  for(const b of CITY.birds){ b.x+=b.v*dt; if(b.x>430) b.x=-30; const f=Math.sin(t/140+b.ph)*2.2, y=b.y+Math.sin(t/900+b.ph)*4;
    c.strokeStyle='rgba(40,25,40,0.6)'; c.lineWidth=0.9; c.beginPath(); c.moveTo(b.x-4,y-f*0.5); c.quadraticCurveTo(b.x-2,y-f,b.x,y); c.quadraticCurveTo(b.x+2,y-f,b.x+4,y-f*0.5); c.stroke(); }
  c.save(); c.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){ const a=0.05+0.025*Math.sin(t/2200+i*2); c.fillStyle=lg(c,0,0,300,500,[[0,`rgba(255,200,140,${a})`],[1,'rgba(255,200,140,0)']]);
    const o=i*70; c.beginPath(); c.moveTo(-40+o,0); c.lineTo(10+o,0); c.lineTo(260+o,560); c.lineTo(190+o,560); c.closePath(); c.fill(); }
  c.restore();
  // arena bayrakları
  for(let j=0;j<=12;j++){ const a=Math.PI-j*Math.PI/12, x=212+126*Math.cos(a), y=172+30*Math.sin(a)-11, w=Math.sin(t/260+j)*1.6;
    c.fillStyle=j%2?'#e2b44a':'#b3322a'; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+4,y+1+w,x+8,y+2+w*1.4); c.lineTo(x,y+4.5); c.closePath(); c.fill(); }
  // demirci: ocak ışığı, duman, kıvılcım
  const fl=0.75+0.25*Math.sin(t/90)*Math.sin(t/37+1);
  glow(c,65,452,46,'#ff8a3a',0.32*fl); glow(c,66,482,40,'#ff9a4a',0.14*fl);
  if(t>CITY.nextSmoke){ CITY.nextSmoke=t+140; CITY.parts.add({x:24+rnd(-3,3),y:244,vx:rnd(0.05,0.2),vy:rnd(-0.35,-0.22),decay:0.0055,size:rnd(3,5),grow:0.09,col:'#8a7a78',kind:'smoke',a:0.5}); }
  if(t>CITY.nextSpark){ CITY.nextSpark=t+rnd(900,2200); for(let i=0;i<7;i++) CITY.parts.add({x:65+rnd(-6,6),y:452,vx:rnd(-0.6,0.6),vy:rnd(-1.6,-0.6),g:0.04,decay:0.03,size:0.8,col:'#ffd27a',kind:'spark'}); }
  CITY.parts.step(dt); CITY.parts.draw(c);
  // zırhçı sancağı
  const bx=181, by=300, bw=40, bh=46, sw=Math.sin(t/700)*1.5;
  c.fillStyle='#5a3a22'; c.fillRect(bx-3,by-2,bw+6,2.4);
  c.beginPath(); c.moveTo(bx,by); c.lineTo(bx+bw,by); c.quadraticCurveTo(bx+bw+sw,by+bh*0.5,bx+bw+sw*1.6,by+bh); c.lineTo(bx+bw/2+sw*1.3,by+bh-7); c.lineTo(bx+sw*1.6,by+bh); c.quadraticCurveTo(bx+sw,by+bh*0.5,bx,by); c.closePath();
  c.fillStyle=lg(c,bx,0,bx+bw,0,[[0,'#c23a2c'],[0.5,'#9e2b22'],[1,'#6a1a14']]); c.fill(); c.strokeStyle='#e2b44a'; c.lineWidth=1.2; c.stroke();
  c.save(); c.translate(bx+bw/2+sw*0.8,by+20); drawHelmet(c,ITEMS.helmet.list[4].g,6,{},t); c.restore();
  // levhalar
  for(const pl of PLACES) if(pl.id!=='train') plaque(c,pl.label.x,pl.label.y+Math.sin(t/900+pl.r[0])*0.6,pl.name, CITY.press&&CITY.press.id===pl.id);
  // yürüyen halk (ön plan nesnelerinin arkasında)
  const H=CITY.hero; stepHero(H,dt);
  const actors=CITY.npcs.map(n=>{ n.x+=n.dir*n.speed*dt; n.walk+=n.speed*dt*0.19; if(n.x>440) n.x=-40; if(n.x<-40) n.x=440;
    return {y:n.y, draw:()=>drawHero(c,n.x,n.y,48+(n.y-480)*0.5,n.look,{facing:n.dir,walk:n.walk,wa:1,seed:n.seed},t)}; });
  const heroSize=lerp(56,76,clamp((H.y-480)/90,0,1));
  const heroDraw=()=>{ const st={facing:H.facing,walk:H.walk,wa:H.wa,seed:9,stand:true};
    if(H.act){ st.kind=H.act.kind; st.p=(t-H.act.t0)/H.act.dur; if(st.p>=1) H.act=null; }
    drawHero(c,H.x,H.y,heroSize,CITY.look,st,t); };
  if(H.y<572) actors.push({y:H.y,draw:heroDraw});
  actors.sort((a,b)=>a.y-b.y).forEach(a=>a.draw());
  S.blit(S.layer('front',x=>{ fountainArt(x); trainingArt(x); }));
  fountainWater(c,t);
  if(H.y>=572) heroDraw();
  plaque(c,342,513,'ANTRENMAN',CITY.press&&CITY.press.id==='train');
  if(P && P.pts>0){ const p=0.5+0.5*Math.sin(t/260); circ(c,384,506,7+p); c.fillStyle='#d9473a'; c.fill(); c.strokeStyle='#fff0c0'; c.lineWidth=1.2; c.stroke();
    c.fillStyle='#fff'; c.font='800 8.5px system-ui'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('+'+P.pts,384,506.5); }
  if(CITY.press && CITY.press.r){ const [x,y,w,h]=CITY.press.r; c.save(); c.globalCompositeOperation='lighter'; rr(c,x,y,w,h,6); c.fillStyle='rgba(255,200,120,0.12)'; c.fill(); c.restore(); rr(c,x,y,w,h,6); c.strokeStyle='rgba(255,220,140,0.8)'; c.lineWidth=1.4; c.stroke(); }
  // renk dokunuşu
  c.fillStyle=lg(c,0,0,400,0,[[0,'rgba(255,170,90,0.07)'],[1,'rgba(60,40,120,0.06)']]); c.fillRect(0,0,400,S.LH);
  vignette(c,400,S.LH,0.4);
  // boşta hareketler
  if(!H.path.length && !H.act){ CITY.idle+=dt; if(CITY.idle>7000){ CITY.idle=0; H.act={kind:pick(['flex','taunt','puff']),t0:t,dur:1500}; } } else CITY.idle=0;
}
function stepHero(H,dt){
  if(H.path.length){
    const g=H.path[0], dx=g.x-H.x, dy=g.y-H.y, d=Math.hypot(dx,dy), v=0.085*dt;
    if(Math.abs(dx)>0.5) H.facing=dx>0?1:-1;
    if(d<=v){ H.x=g.x; H.y=g.y; H.path.shift(); if(!H.path.length && H.onArrive){ const f=H.onArrive; H.onArrive=null; f(); } }
    else { H.x+=dx/d*v; H.y+=dy/d*v; }
    H.walk+=v*0.21; H.wa=Math.min(1,H.wa+dt/120);
  } else H.wa=Math.max(0,H.wa-dt/150);
}
function fountainWater(c,t){
  const cx=80, top=516;
  c.save(); c.strokeStyle='rgba(200,235,245,0.75)'; c.lineWidth=1.1; c.setLineDash([3,2.5]); c.lineDashOffset=-t/40;
  for(const s of [-1,1]){ c.beginPath(); c.moveTo(cx+s*2,top); c.quadraticCurveTo(cx+s*12,top-6,cx+s*14,top+12); c.stroke();
    c.beginPath(); c.moveTo(cx+s*12,530); c.quadraticCurveTo(cx+s*26,526,cx+s*30,562); c.stroke(); }
  c.restore();
  for(let i=0;i<3;i++){ const p=((t/1600)+i/3)%1; c.strokeStyle=`rgba(220,245,250,${0.5*(1-p)})`; c.lineWidth=0.8; ell(c,cx+(i-1)*22,563,4+p*12,1.2+p*3); c.stroke(); }
  const g=0.5+0.5*Math.sin(t/300); c.fillStyle=`rgba(255,255,255,${0.35+0.3*g})`; ell(c,cx-20,561,6,1.2); c.fill();
}
function plaque(c,x,y,text,hot){
  c.font='700 9px Palatino,"Book Antiqua",Georgia,serif';
  const s=text.split('').join(' '), w=c.measureText(s).width+14, h=14;
  c.save(); c.translate(x,y);
  c.fillStyle='rgba(15,8,4,0.4)'; rr(c,-w/2+1,-h/2+2,w,h,3); c.fill();
  rr(c,-w/2,-h/2,w,h,3); c.fillStyle=lg(c,0,-h/2,0,h/2,[[0,hot?'#7a4a22':'#4d2f18'],[1,'#26150a']]); c.fill();
  c.strokeStyle=hot?'#ffe39a':'#c9a050'; c.lineWidth=hot?1.4:1; c.stroke();
  c.fillStyle='#f8dd94'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(s,0,0.6);
  c.restore();
}
