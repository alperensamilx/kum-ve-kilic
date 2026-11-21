"use strict";
// ---------- DÖVÜŞ ----------
const GROUND = 230, FSIZE = 112;
const cellX = pos => (pos+0.5)*(400/ARENA_LEN);
const maxHp  = f => 26 + f.vit*7 + f.level*4;   // düellolar ~10-13 turda biter (bkz. denge simülasyonu)
const maxSta = f => 60 + f.agi*3 + f.vit*2;
const item = (f,slot) => ITEMS[slot].list[f.eq[slot]];
const armorOf = f => item(f,'armor').v + item(f,'helmet').v + item(f,'shield').v;
const COST = {quick:8, normal:16, power:28, move:4};
const DMG_BASE = 4, DMG_FLOOR = 0.35;  // zırh, ham hasarın en fazla %65'ini emer
const ADUR = {quick:520, normal:660, power:840};
let F = null;
const FV = {sc:null, crowd:null, parts:new Particles(), texts:[], shake:0, flash:0, zoom:null};

function fighter(src,pos,dir,isPlayer){
  return {src, look:lookOf(src), name:src.name, pos, rx:pos, dir, isPlayer, hp:maxHp(src), mhp:maxHp(src), sta:maxSta(src), msta:maxSta(src),
    anim:null, flash:0, angry:0, dead:false, fall:0, walk:0, wa:0, seed:isPlayer?1:5, trail:[]};
}
const now = () => performance.now();
const animate = (f,kind,dur,act) => { f.anim={kind,act,t0:now(),dur}; };
const dist = () => Math.abs(F.p.pos-F.e.pos);
function hitChance(a,d,kind){
  const mod={quick:12,normal:0,power:-18}[kind];
  let ch=72+(a.src.atk-d.src.agi)*3+mod-(a.angry?10:0);
  if(a.sta<COST[kind]) ch-=25;
  return clamp(Math.round(ch),8,96);
}
function baseDmg(a,kind){ return (item(a.src,'weapon').v + a.src.str*2.2 + DMG_BASE) * {quick:0.6,normal:1,power:1.75}[kind]; }
function log(t){ const d=document.createElement('div'); d.textContent=t; $('log').appendChild(d); while($('log').children.length>3) $('log').firstChild.remove(); }
function floatText(f,text,color,big=false){ FV.texts.push({x:cellX(f.rx),y:GROUND-FSIZE*0.95,text,color,big,t:0}); }
function burst(f,kind,n,dirX=0){
  const x=cellX(f.rx), feet=kind==='dust';
  const cols={dust:['#e8c896','#cfa774','#b8895a'],spark:['#fff6c0','#ffd27a','#ffb347'],blood:['#b3261e','#8c1c15','#d9483b']}[kind];
  for(let i=0;i<n;i++) FV.parts.add({x:x+rnd(-6,6), y:feet?GROUND+1:GROUND-FSIZE*0.62+rnd(-8,8),
    vx:dirX*rnd(0.5,2.8)+rnd(-1.2,1.2)*(kind==='spark'?2:1), vy:feet?rnd(-1.1,-0.3):rnd(-3.2,-0.6), g:feet?0.015:0.16,
    decay:rnd(0.015,0.035)*(kind==='spark'?1.6:1), size:kind==='dust'?rnd(2.5,5):kind==='spark'?0.9:rnd(1.1,2.4), grow:kind==='dust'?0.06:0,
    col:pick(cols), kind:kind==='dust'?'smoke':kind==='spark'?'spark':'dot', floor:kind==='blood'?GROUND+4:undefined, a:kind==='dust'?0.8:1});
}

function startFight(foe){
  F={foe, p:fighter(P,2,1,true), e:fighter(foe.e,ARENA_LEN-3,-1,false), crowd:30, busy:false, over:false, intro:!!foe.intro, t0:now()};
  FV.parts=new Particles(); FV.texts=[]; FV.shake=0; FV.flash=0; FV.zoom=null;
  SFX.play('gong'); setTimeout(()=>SFX.play('cheer',0.6),300);
  $('log').innerHTML=''; $('fPN').textContent=P.name; $('fEN').textContent=`${foe.e.name} · Sv.${foe.e.level}`;
  log(foe.intro ? `İki esir kuma itildi: sen ve ${foe.e.name}. Elinizde paslı kılıçtan başka bir şey yok!` : `${foe.e.name} arenaya çıktı! Seyirci ayakta!`);
  fadeTo(()=>{ go('fight'); updateFightUI(true); });
}

async function doAction(a,d,act){
  const name=a.name;
  if(act==='fwd'||act==='back'){
    const step=act==='fwd'?a.dir:-a.dir, np=a.pos+step;
    if(np<0||np>=ARENA_LEN||np===d.pos){ log(`${name} kıpırdayamadı.`); return; }
    a.pos=np; a.sta=Math.max(0,a.sta-COST.move); SFX.play('step'); burst(a,'dust',6,-step);
    if(act==='back') F.crowd=clamp(F.crowd-3,0,100);
    await sleep(260); return;
  }
  if(act==='rest'){
    const gain=Math.round(22+a.src.agi*1.5+a.src.vit), heal=Math.round(1+a.src.vit*0.5);
    a.sta=Math.min(a.msta,a.sta+gain); a.hp=Math.min(a.mhp,a.hp+heal); animate(a,'rest',900);
    floatText(a,`+${gain} enerji`,'#7cc4f4'); SFX.play('rest'); log(`${name} nefeslendi.`); F.crowd=clamp(F.crowd-4,0,100);
    await sleep(520); return;
  }
  if(act==='taunt'){
    const ch=clamp(40+(a.src.cha-d.src.cha)*5,10,90); animate(a,'taunt',1000);
    if(Math.random()*100<ch){ d.sta=Math.max(0,d.sta-15); d.angry=2; F.crowd=clamp(F.crowd+10+a.src.cha,0,100);
      floatText(d,'ÖFKE!','#ff8a3d'); SFX.play('taunt'); SFX.play('cheer',0.5); log(`${name} alay etti! ${d.isPlayer?'Sinirlendin':d.name+' sinirlendi'}.`);
      if(F.crowd>60) for(let i=0;i<10;i++) FV.parts.add({x:rnd(20,380),y:rnd(90,120),vx:rnd(-0.3,0.3),vy:rnd(0.3,0.8),g:0.01,decay:0.008,size:rnd(1.5,2.6),col:pick(['#e2b44a','#c23a2c','#f4e8d0']),kind:'petal'});
    } else { F.crowd=clamp(F.crowd-5,0,100); floatText(a,'yuhh','#c9b8a0'); SFX.play('taunt'); SFX.play('boo'); log(`${name} alay etmeye çalıştı ama kimse gülmedi.`); }
    await sleep(600); return;
  }
  if(dist()>1){ log('Çok uzak!'); return; }
  const tired=a.sta<COST[act], chance=hitChance(a,d,act), dur=ADUR[act];
  a.sta=Math.max(0,a.sta-COST[act]); if(a.angry) a.angry--;
  animate(a,'attack',dur,act); a.trail=[]; setTimeout(()=>SFX.play('swing'),dur*0.3);
  await sleep(dur*0.55);
  if(Math.random()*100<chance){
    let dmg=baseDmg(a,act)*rnd(0.85,1.15)*(tired?0.6:1);
    const crit=Math.random()<0.06+a.src.agi*0.005; if(crit) dmg*=1.6;
    const red=armorOf(d.src)*0.7+d.src.def*1.2, raw=dmg;
    dmg=Math.max(1,Math.round(Math.max(raw*DMG_FLOOR, raw-red*(act==='power'?0.6:1))));
    d.hp=Math.max(0,d.hp-dmg); d.flash=1;
    const blocked=dmg<raw*0.55 && (item(d.src,'shield').v || armorOf(d.src)>=6);
    animate(d, blocked?'block':'hit', blocked?520:560);
    FV.shake=act==='power'||crit?8:3;
    if(crit){ SFX.play('crit'); FV.flash=0.55; buzz([30,40,60]); burst(d,'blood',12,a.dir); burst(d,'spark',10,a.dir); }
    else if(act==='power'){ SFX.play('heavy'); buzz(50); burst(d,'blood',8,a.dir); burst(d,'dust',4,a.dir); }
    else if(blocked){ SFX.play('clang'); buzz(15); burst(d,'spark',12,a.dir); }
    else { SFX.play('hit'); buzz(25); burst(d,'blood',5,a.dir); }
    if(d.hp<=0){ FV.shake=12; FV.flash=0.75; SFX.play('heavy'); burst(d,'blood',16,a.dir); burst(d,'dust',12,a.dir); FV.zoom={x:cellX(d.rx),t0:now()}; }
    else if((crit||act==='power') && F.crowd>55) SFX.play('cheer',F.crowd/100);
    floatText(d,(crit?'KRİTİK ':'')+'-'+dmg, crit?'#ffd86b':'#ff6a5a', crit);
    F.crowd=clamp(F.crowd+(act==='power'?9:act==='normal'?5:3)+(crit?8:0),0,100);
    log(`${name} ${({quick:'hızlıca vurdu',normal:'vurdu',power:'güçlü bir darbe indirdi'})[act]}: ${dmg} hasar${crit?' (kritik!)':''}.`);
    if(act==='power' && d.hp>0){ const np=d.pos+a.dir; if(np>=0&&np<ARENA_LEN&&Math.random()<0.6){ d.pos=np; burst(d,'dust',10,a.dir); log(`${d.isPlayer?'Geriye savruldun':d.name+' geriye savruldu'}!`); } }
  } else {
    animate(d,'dodge',460); floatText(d,'ISKA','#e6e0d6'); SFX.play('miss'); burst(d,'dust',4,-a.dir);
    log(`${name} ıskaladı${tired?' (yorgun)':''}.`);
  }
  updateFightUI(); await sleep(dur*0.5);
}

function enemyChoice(){
  const e=F.e, p=F.p, dd=dist(), hpR=e.hp/e.mhp;
  if(dd>1){ if(e.sta<20&&Math.random()<0.6) return 'rest'; if(e.src.cha>=5&&Math.random()<0.15) return 'taunt'; return 'fwd'; }
  if(e.sta<10) return (hpR<0.35&&Math.random()<0.5)?'back':'rest';
  const r=Math.random(), finish=p.hp<baseDmg(e,'normal')*0.8;
  if(finish&&e.sta>=COST.quick) return 'quick';
  if(e.sta>=COST.power&&r<0.3) return 'power';
  if(e.sta>=COST.normal&&r<0.75) return 'normal';
  if(e.sta>=COST.quick) return r<0.92?'quick':'taunt';
  return 'rest';
}
async function playerAct(act){
  if(!F||F.busy||F.over) return;
  const fight=F; fight.busy=true; updateFightUI();
  await doAction(fight.p,fight.e,act);
  if(!(await checkEnd())){ await sleep(150); await doAction(fight.e,fight.p,enemyChoice()); await checkEnd(); }
  fight.busy=false; if(F===fight) updateFightUI();
}
async function checkEnd(){
  updateFightUI(); if(F.p.hp>0&&F.e.hp>0) return false;
  F.over=true; const won=F.e.hp<=0; (won?F.e:F.p).dead=true;
  log(won?`${F.e.name} kuma düştü! Zafer senin!`:'Kuma düştün...');
  await sleep(1500); endFight(won); return true;
}
function updateFightUI(instant){
  if(!F) return; const {p,e}=F;
  const set=(id,v,m)=>{ const w=(100*v/m)+'%'; $(id).style.width=w; const g=$(id+'g'); if(g){ if(instant) g.style.transition='none'; g.style.width=w; if(instant) requestAnimationFrame(()=>g.style.transition=''); } const tt=$(id+'t'); if(tt) tt.textContent=`${Math.round(v)}/${m}`; };
  set('fPH',p.hp,p.mhp); set('fPS',p.sta,p.msta); set('fEH',e.hp,e.mhp); set('fES',e.sta,e.msta);
  $('fC').style.width=F.crowd+'%'; $('fCt').textContent='%'+Math.round(F.crowd);
  const near=dist()<=1, lock=F.busy||F.over;
  document.querySelectorAll('#acts button').forEach(b=>{
    const a=b.dataset.a; let dis=lock;
    if(a==='fwd') dis||=near; if(a==='back') dis||=p.pos<=0;
    if(['quick','normal','power'].includes(a)){ dis||=!near; b.querySelector('small').textContent=near?`%${hitChance(p,e,a)} · -${COST[a]} enerji`:'menzil dışı'; }
    b.disabled=dis;
  });
}

// ---------- ARENA ÇİZİMİ ----------
function arenaBg(x,W,H){
  const R=rng(77);
  x.fillStyle=lg(x,0,0,0,140,[[0,'#2a1c20'],[1,'#5a3c30']]); x.fillRect(0,0,W,140);
  for(let row=0;row<11;row++){ const y=8+row*10.5, sh=0.55-row*0.035;
    x.fillStyle=shade('#b89c7c',-sh); x.fillRect(0,y+7,W,3.5);
    for(let i=0;i<70;i++){ const px=i*5.9+(row%2)*3+R()*1.5; const col=pk(R,['#a8443a','#e6d6b4','#4a6a9a','#c99a3a','#6a4a6a','#8a7a5a','#3a5a4a']);
      x.fillStyle=shade(col,-sh*0.9); x.fillRect(px,y+2.5,3.6,4.6); x.fillStyle=shade(pk(R,['#d9a374','#b27a4e','#f0cba6','#7f5236']),-sh*0.9); circ(x,px+1.8,y+1.4,1.7); x.fill(); } }
  x.fillStyle=lg(x,0,0,0,30,[[0,'rgba(120,40,30,0.95)'],[1,'rgba(120,40,30,0)']]); x.fillRect(0,0,W,30);
  x.strokeStyle='rgba(60,30,20,0.6)'; x.lineWidth=0.8; x.beginPath(); for(let i=0;i<W;i+=40){ x.moveTo(i,0); x.quadraticCurveTo(i+20,14,i+40,0); } x.stroke();
  // onur locası
  x.fillStyle='#e8d6b4'; x.fillRect(160,70,80,52); x.fillStyle='#9e2b22'; x.beginPath(); x.moveTo(154,72); x.lineTo(246,72); x.lineTo(240,62); x.lineTo(160,62); x.closePath(); x.fill();
  x.fillStyle='#e2b44a'; for(let i=0;i<9;i++) x.fillRect(160+i*10,72,5,2.5);
  x.fillStyle='#3a2420'; x.fillRect(166,82,68,30); for(let i=0;i<5;i++){ x.fillStyle=lg(x,168+i*14,0,173+i*14,0,[[0,'#fff0d2'],[1,'#b9a080']]); x.fillRect(167+i*14.5,80,4,34); }
  // podyum duvarı
  x.fillStyle=lg(x,0,122,0,152,[[0,'#efe0c4'],[1,'#c4ad8c']]); x.fillRect(0,122,W,30);
  x.fillStyle='#d9c4a2'; x.fillRect(0,120,W,4); x.fillStyle='rgba(60,40,30,0.3)'; x.fillRect(0,124,W,1.2);
  for(let i=0;i<W;i+=50){ x.strokeStyle='rgba(120,90,60,0.5)'; x.lineWidth=0.8; rr(x,i+6,128,38,18,2); x.stroke(); }
  for(const gx of [44,356]){ archPath(x,gx-18,124,36,28); x.fillStyle='#1a0e0a'; x.fill();
    x.strokeStyle='#4a4a50'; x.lineWidth=1; x.beginPath(); for(let i=1;i<6;i++){ x.moveTo(gx-18+i*6,128); x.lineTo(gx-18+i*6,152); } for(let j=0;j<4;j++){ x.moveTo(gx-18,134+j*5); x.lineTo(gx+18,134+j*5); } x.stroke(); voussoirs(x,gx-18,124,36,'#e0cba8'); }
  for(const bx of [130,270]){ x.fillStyle='#9e2b22'; x.beginPath(); x.moveTo(bx-9,122); x.lineTo(bx+9,122); x.lineTo(bx+9,146); x.lineTo(bx,141); x.lineTo(bx-9,146); x.closePath(); x.fill(); x.strokeStyle='#e2b44a'; x.lineWidth=1; x.stroke(); }
  // kum
  x.fillStyle=lg(x,0,152,0,H,[[0,'#b89064'],[0.25,'#d6b27e'],[1,'#e2c08c']]); x.fillRect(0,152,W,H-152);
  x.fillStyle=lg(x,0,152,0,172,[[0,'rgba(40,20,15,0.45)'],[1,'rgba(40,20,15,0)']]); x.fillRect(0,152,W,20);
  speckle(x,0,155,W,H-155,1400,['#f0d6a4','#a8805a','#c79a6a'],R,0.4,1.3,0.45);
  x.strokeStyle='rgba(140,100,60,0.22)'; x.lineWidth=0.8; for(let y=170;y<H;y+=7){ x.beginPath(); x.moveTo(0,y); x.quadraticCurveTo(200,y+2,400,y); x.stroke(); }
  x.fillStyle='rgba(110,30,20,0.18)'; for(let i=0;i<5;i++){ ell(x,R()*W,190+R()*50,4+R()*6,1.5+R()*1.5); x.fill(); }
}
function fightFrame(t,dt){
  if(!F) return;
  if(!FV.sc) FV.sc=makeScene($('cvFight'),400);
  const S=FV.sc; if(!S.fit()) return; const c=S.ctx; S.begin();
  for(const f of [F.p,F.e]){
    const moving=Math.abs(f.pos-f.rx)>0.02; f.rx+=(f.pos-f.rx)*Math.min(1,dt/140);
    f.wa=moving?Math.min(1,f.wa+dt/80):Math.max(0,f.wa-dt/120); if(moving) f.walk+=dt*0.016;
    if(f.flash>0) f.flash=Math.max(0,f.flash-dt/260); if(f.dead&&f.fall<1) f.fall=Math.min(1,f.fall+dt/650);
  }
  c.save();
  if(FV.shake>0){ c.translate(rnd(-FV.shake,FV.shake),rnd(-FV.shake,FV.shake)*0.5); FV.shake=Math.max(0,FV.shake-dt/30); }
  if(FV.zoom){ const p=(now()-FV.zoom.t0)/1400, z=1+0.08*Math.sin(clamp(p,0,1)*Math.PI); c.translate(FV.zoom.x,GROUND-40); c.scale(z,z); c.translate(-FV.zoom.x,-(GROUND-40)); }
  c.drawImage(S.layer('arena',arenaBg),0,0,400,S.LH);
  // coşan ön sıralar
  const ex=F.crowd/100;
  for(let i=0;i<46;i++){ const x=i*8.8+3, j=Math.max(0,Math.sin(t/(130-ex*40)+i*1.7))*(1+ex*5), y=116-j;
    c.fillStyle=['#8e3a30','#c8b894','#3e5a84','#a8822e','#5a3e5a'][i%5]; c.fillRect(x-2.2,y-3,4.4,6);
    c.fillStyle=['#c48a5c','#9a6a40','#dcb48a'][i%3]; circ(c,x,y-4.6,1.9); c.fill();
    if(ex>0.55 && (i%3===0)){ c.strokeStyle=c.fillStyle; c.lineWidth=1.2; c.beginPath(); c.moveTo(x+2,y-2); c.lineTo(x+4,y-8-j*0.3); c.stroke(); } }
  // mangallar
  for(const gx of [16,384]){ c.fillStyle='#3a2a20'; c.fillRect(gx-4,138,8,10); const fl=0.7+0.3*Math.sin(t/70+gx);
    c.fillStyle='#ffb347'; c.beginPath(); c.moveTo(gx-4,138); c.quadraticCurveTo(gx,128-fl*6,gx+4,138); c.fill(); glow(c,gx,134,22,'#ff9a3a',0.35*fl); }
  // gölgeler + dövüşçüler (yaklaşan önde)
  const order=[F.e,F.p].sort((a,b)=>(a.anim&&a.anim.kind==='attack'?1:0)-(b.anim&&b.anim.kind==='attack'?1:0));
  for(const f of order){
    const st={facing:f.dir,walk:f.walk,wa:f.wa,seed:f.seed,anger:f.angry>0,dead:f.fall,tint:'#ffffff',tintA:f.flash*0.75};
    if(f.anim){ st.kind=f.anim.kind; st.act=f.anim.act; st.p=(now()-f.anim.t0)/f.anim.dur; if(st.p>=1){ f.anim=null; st.kind=null; } }
    if(f.dead){ st.kind=null; }
    const R=drawHero(c,cellX(f.rx),GROUND,FSIZE,f.look,st,t);
    if(st.kind==='attack' && st.p>0.36 && st.p<0.64 && R.tipW){ f.trail.push({...R.tipW,h:R.handW}); if(f.trail.length>7) f.trail.shift(); } else if(f.trail.length) f.trail.shift();
    if(f.trail.length>1){ c.save(); c.globalCompositeOperation='lighter'; for(let i=1;i<f.trail.length;i++){ const a=f.trail[i-1], b=f.trail[i], al=i/f.trail.length;
      c.fillStyle=`rgba(255,240,200,${0.32*al})`; c.beginPath(); c.moveTo(a.x,a.y); c.lineTo(b.x,b.y); c.lineTo(lerp(b.h.x,b.x,0.55),lerp(b.h.y,b.y,0.55)); c.lineTo(lerp(a.h.x,a.x,0.55),lerp(a.h.y,a.y,0.55)); c.closePath(); c.fill(); } c.restore(); }
    if(f.angry && !f.dead){ c.fillStyle='#ff6a3a'; c.font='800 13px system-ui'; c.textAlign='center'; c.fillText('!',R.headW.x,R.headW.y-FSIZE*0.16); }
  }
  FV.parts.step(dt); FV.parts.draw(c);
  FV.texts=FV.texts.filter(o=>o.t<1);
  for(const o of FV.texts){ o.t+=dt/1150; const pop=o.t<0.15?0.6+o.t/0.15*0.6:1.2-Math.min(0.2,(o.t-0.15)); const y=o.y-easeOut(o.t)*34;
    c.save(); c.translate(o.x,y); c.scale(pop*(o.big?1.25:1),pop*(o.big?1.25:1)); c.globalAlpha=1-Math.max(0,(o.t-0.6)/0.4);
    c.font='900 15px system-ui'; c.textAlign='center'; c.lineJoin='round'; c.lineWidth=3.5; c.strokeStyle='rgba(20,8,4,0.85)'; c.strokeText(o.text,0,0); c.fillStyle=o.color; c.fillText(o.text,0,0); c.restore(); }
  c.restore();
  vignette(c,400,S.LH,0.35);
  if(F.intro){ const k=(now()-F.t0)/(DBG?40000:2800); if(k<1){ const a=k<0.15?k/0.15:k>0.7?(1-k)/0.3:1;
    c.save(); c.globalAlpha=a; c.fillStyle='rgba(12,6,3,0.55)'; c.fillRect(0,S.LH*0.32,400,64);
    c.textAlign='center'; c.textBaseline='middle'; c.font='700 26px Palatino,"Book Antiqua",Georgia,serif'; c.lineWidth=4; c.strokeStyle='rgba(20,8,4,0.9)';
    c.strokeText('İ L K   D Ö V Ü Ş',200,S.LH*0.32+24); c.fillStyle='#f6d98a'; c.fillText('İ L K   D Ö V Ü Ş',200,S.LH*0.32+24);
    c.font='italic 12px Palatino,Georgia,serif'; c.fillStyle='#f5e8d0'; c.fillText('Hayatta kal, kalabalığı coştur',200,S.LH*0.32+48); c.restore(); } }
  if(FV.flash>0){ c.fillStyle=`rgba(255,240,205,${FV.flash})`; c.fillRect(0,0,400,S.LH); FV.flash=Math.max(0,FV.flash-dt/420); }
}
