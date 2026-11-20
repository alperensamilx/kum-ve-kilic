"use strict";
// ---------- GLADYATÖR ÇİZİCİ: iskelet ve pozlar ----------
// Yerel koordinatlar: ayak ortası (0,0), yukarısı -y, yüz +x yönünde, boy ≈ 100 birim.
// İstatistikler vücudu biçimlendirir:
//   Güç → kas ve boy · Dayanıklılık → genişlik · Çeviklik → ince bel, geniş duruş
//   Saldırı → silah yukarıda, savaş boyası · Savunma → kolluk/tozluk · Karizma → pelerin, dik duruş

const sf = x => 1 - Math.exp(-Math.max(0,(x||1)-1)/7);
function bodyOf(s){ return {m:sf(s.str), v:sf(s.vit), a:sf(s.agi), k:sf(s.atk), d:sf(s.def), c:sf(s.cha)}; }
// Ekrandaki vücut hedefe yumuşakça ilerler (puan verince "şişerek" büyür)
function tweenBody(cur, tgt, dt){ const r=1-Math.exp(-dt/140); for(const k in tgt) cur[k]+=(tgt[k]-cur[k])*r; return cur; }

function lookOf(src){
  const L = Object.assign({}, DEFAULT_LOOK, src.look||{});
  const eq = src.eq || {weapon:0,armor:0,helmet:0,shield:0};
  return {
    skin:LOOK.skin[L.skin], hair:LOOK.hair[L.hair].s, hairCol:LOOK.hairCol[L.hairCol], beard:LOOK.beard[L.beard].s,
    cloth: src.cloth || LOOK.cloth[L.cloth], body: bodyOf(src),
    weapon:ITEMS.weapon.list[eq.weapon].g, armor:ITEMS.armor.list[eq.armor].g,
    helmet:ITEMS.helmet.list[eq.helmet].g, shield:ITEMS.shield.list[eq.shield].g,
  };
}

function dims(B, look, puff=0){
  const fem = look.fem?1:0, p = 1+puff*0.08;
  return {
    leg: 44 + B.a*4 + B.m*2,
    torso: 31 + B.m*2.5 + B.v,
    head: 9.4 + B.m*0.5,
    shW: (11.5 + B.m*7 + B.v*3.8)*(1-fem*0.2)*p,
    chW: (10.5 + B.m*4.5 + B.v*5.2)*(1-fem*0.12)*p,
    waW: (8.2 + B.v*8.8 - B.a*1.2)*(1-fem*0.12),
    hiW: (9.2 + B.v*5.8)*(1+fem*0.08),
    uArm: (3.9 + B.m*3.3 + B.v*1.0)*(1-fem*0.22),
    fArm: (3.2 + B.m*2.1 + B.v*0.7)*(1-fem*0.2),
    thigh: 5 + B.v*3.3 + B.m*1.6,
    calf: 3.7 + B.v*2 + B.m*0.9,
    neck: (3.6 + B.m*1.8 + B.v*2)*(1-fem*0.18),
    belly: B.v*4.8*(1-fem),
    stance: 7 + B.a*6,
    armL: 15 + B.m*1.2, foreL: 14 + B.m*0.8,
    grow: 1 + B.m*0.10 + B.v*0.05,
  };
}

// Saldırı anahtar pozları: w = kurma, s = vuruş. Açılar aşağıdan öne doğru (radyan).
const ATK = {
  sword:{ quick:{w:{nu:0.15,nf:1.15,wp:1.5}, s:{nu:1.5,nf:1.62,wp:1.62}, lunge:[-2,9],  lean:[-0.06,0.2]},
          normal:{w:{nu:-0.55,nf:2.9,wp:3.7}, s:{nu:1.45,nf:1.45,wp:1.2}, lunge:[-3,7], lean:[-0.12,0.22]},
          power:{w:{nu:2.75,nf:3.5,wp:4.0},  s:{nu:1.0,nf:0.85,wp:0.7},  lunge:[-4,8],  lean:[-0.18,0.3]} },
  spear:{ quick:{w:{nu:0.55,nf:1.45,wp:1.6}, s:{nu:1.62,nf:1.6,wp:1.6},  lunge:[-3,10], lean:[-0.05,0.2]},
          normal:{w:{nu:0.35,nf:1.35,wp:1.62},s:{nu:1.66,nf:1.62,wp:1.62},lunge:[-5,11], lean:[-0.1,0.24]},
          power:{w:{nu:2.3,nf:2.4,wp:1.85},  s:{nu:1.35,nf:1.25,wp:1.3},  lunge:[-5,10], lean:[-0.16,0.3]} },
  axe:  { quick:{w:{nu:0.6,nf:2.1,wp:2.4},   s:{nu:1.45,nf:1.3,wp:1.15},  lunge:[-2,7],  lean:[-0.06,0.2]},
          normal:{w:{nu:2.2,nf:3.2,wp:3.7},  s:{nu:1.2,nf:1.0,wp:0.9},    lunge:[-3,7],  lean:[-0.14,0.26]},
          power:{w:{nu:2.95,nf:3.65,wp:4.2}, s:{nu:0.95,nf:0.6,wp:0.5},   lunge:[-4,8],  lean:[-0.22,0.34]} },
};
const env = p => Math.sin(clamp(p,0,1)*Math.PI);
const plateau = p => { p=clamp(p,0,1); return p<0.22 ? ease(p/0.22) : p>0.78 ? ease((1-p)/0.22) : 1; };
function lerpPose(a,b,t){ const o={}; for(const k in a) o[k]=lerp(a[k], b[k]!==undefined?b[k]:a[k], t); return o; }

function guardPose(look){
  const B=look.body, k=B.k, w=look.weapon||{t:'none'};
  if(look.civ) return {nu:0.14, nf:0.3, wp:0.45, fu:-0.06, ff:0.1};
  let p;
  if(w.t==='spear') p={nu:1.05, nf:1.85+k*0.12, wp:1.6};
  else if(w.t==='axe') p={nu:0.4, nf:2.1+k*0.3, wp:2.5+k*0.3};
  else p={nu:0.42+k*0.1, nf:1.5+k*0.35, wp:1.85+k*0.55};
  if(look.shield && look.shield.t!=='none'){ p.fu=0.95; p.ff=1.72; } else { p.fu=0.72; p.ff=2.3; }
  return p;
}

// Sakin duruş: silah dik, kalkan yanda (göğüs ve kollar görünür kalır)
function standPose(look){
  const w=look.weapon||{t:'none'}, k=look.body.k;
  const p = w.t==='spear' ? {nu:0.32,nf:1.15,wp:3.08} : w.t==='axe' ? {nu:0.36,nf:1.1,wp:2.85} : {nu:0.3,nf:1.05+k*0.15,wp:2.95};
  if(look.shield && look.shield.t!=='none'){ p.fu=0.12; p.ff=0.42; } else { p.fu=0.1; p.ff=0.3; }
  return p;
}
// İki kemikli ters kinematik (diz öne bükülür)
function ik(h,f,l1,l2){
  const dx=f.x-h.x, dy=f.y-h.y; const d=clamp(Math.hypot(dx,dy), Math.abs(l1-l2)+0.01, l1+l2-0.01);
  const a=Math.atan2(dy,dx), cs=clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1), ang=a-Math.acos(cs);
  return {x:h.x+l1*Math.cos(ang), y:h.y+l1*Math.sin(ang)};
}
const dirv = th => ({x:Math.sin(th), y:Math.cos(th)});

function rig(look, st, t){
  const B=look.body, g=(st.stand&&!look.civ)?standPose(look):guardPose(look), kind=st.kind||'idle', p=st.p||0, seed=st.seed||0;
  let a={...g}, lean=0.05+B.a*0.07-B.c*0.06, bx=Math.sin(t/1300+seed)*0.6, by=0, tilt=0, puff=0, lift=0, eye=0;
  const br=Math.sin(t/(kind==='rest'?210:560)+seed);
  if(kind==='attack'){
    const W=(look.weapon && ATK[look.weapon.t]) || ATK.sword, K=W[st.act||'normal'];
    let q,lx,ln;
    if(p<0.4){ const e=easeOut(p/0.4); q=lerpPose(g,K.w,e); lx=lerp(0,K.lunge[0],e); ln=lerp(0,K.lean[0],e); }
    else if(p<0.56){ const e=easeIn((p-0.4)/0.16); q=lerpPose(K.w,K.s,e); lx=lerp(K.lunge[0],K.lunge[1],e); ln=lerp(K.lean[0],K.lean[1],e); }
    else if(p<0.72){ q={...K.s}; lx=K.lunge[1]; ln=K.lean[1]; }
    else { const e=ease((p-0.72)/0.28); q=lerpPose({...g,...K.s},g,e); lx=lerp(K.lunge[1],0,e); ln=lerp(K.lean[1],0,e); }
    Object.assign(a,q); bx+=lx; lean+=ln;
  }
  else if(kind==='hit'){ const e=1-easeOut(p); lean-=0.3*e; bx-=6*e; a.nu+=0.35*e; a.fu-=0.25*e; tilt-=0.25*e; eye=e>0.35?1:0; }
  else if(kind==='dodge'){ const e=env(p); lean-=0.3*e; bx-=7*e; tilt-=0.15*e; }
  else if(kind==='block'){ const e=plateau(p); a.fu=lerp(a.fu,1.35,e); a.ff=lerp(a.ff,2.65,e); lean-=0.06*e; bx-=2.5*e; }
  else if(kind==='taunt'){ const e=plateau(p); a=lerpPose(a,{nu:2.95,nf:3.25,wp:3.4,fu:1.25,ff:1.5},e); lean-=0.12*e; tilt-=0.22*e; by-=Math.max(0,Math.sin(p*Math.PI*4))*2*e; }
  else if(kind==='rest'){ const e=plateau(p); a=lerpPose(a,{nu:0.25,nf:0.5,wp:0.6,fu:0.3,ff:0.5},e); lean+=0.28*e; by+=3*e; tilt+=0.15*e; }
  else if(kind==='flex'){ const e=plateau(p); a=lerpPose(a,{nu:-1.45,nf:3.1,wp:2.9,fu:1.6,ff:3.1},e); lean-=0.06*e; puff=0.6*e; }
  else if(kind==='puff'){ const e=plateau(p); puff=e; lean-=0.1*e; a.fu+=0.25*e; a.nu-=0.2*e; }
  else if(kind==='hop'){ const e=env(p); by-=13*e; lift=5*e; lean+=0.1*e; }
  else if(kind==='work'){ // demirci çekici
    const q=((t/950)+seed)%1, up={nu:2.5,nf:3.3,wp:3.5}, dn={nu:1.05,nf:1.25,wp:1.35};
    a = q<0.55 ? lerpPose(a,up,ease(q/0.55)) : q<0.66 ? lerpPose({...a,...up},dn,easeIn((q-0.55)/0.11)) : lerpPose({...a,...dn},g,ease((q-0.66)/0.34));
    lean+=0.14;
  }
  else if(kind==='polish'){ a.nu=0.78+Math.sin(t/260)*0.12; a.nf=1.55+Math.cos(t/260)*0.22; a.wp=1.9; a.fu=0.9; a.ff=1.65; lean+=0.08; }
  else if(kind==='paint'){ a.nu=0.95+Math.sin(t/420)*0.16; a.nf=1.95+Math.sin(t/420+1)*0.25; a.wp=2.2; a.fu=0.8; a.ff=1.6; lean+=0.1; }
  if(st.anger) tilt+=0.05;

  const D=dims(B,look,puff), l1=D.leg*0.5, l2=D.leg*0.52;
  // ayaklar
  let fF={x:D.stance+1.5,y:0}, fN={x:-D.stance+0.5,y:0};
  if(look.civ){ fF.x=3.5; fN.x=-3; }
  const wa=st.wa||0;
  if(wa>0){ const w=st.walk||0, A=7+B.a*3;
    fF.x=lerp(fF.x, A*Math.sin(w), wa); fN.x=lerp(fN.x,-A*Math.sin(w),wa);
    fF.y=-Math.max(0,Math.cos(w))*5*wa; fN.y=-Math.max(0,-Math.cos(w))*5*wa;
    by-=Math.abs(Math.cos(w))*1.3*wa; a.nu+=Math.sin(w)*0.35*wa; a.fu-=Math.sin(w)*0.3*wa; }
  fF.y-=lift; fN.y-=lift;
  const P={x:bx, y:-(l1+l2+3)*(0.975-B.a*0.035)+by};
  const hF={x:P.x+D.hiW*0.42,y:P.y+2}, hN={x:P.x-D.hiW*0.42,y:P.y+2};
  const aF={x:fF.x,y:fF.y-3}, aN={x:fN.x,y:fN.y-3};
  const kF=ik(hF,aF,l1,l2), kN=ik(hN,aN,l1,l2);
  // gövde ekseni
  const U={x:Math.sin(lean),y:-Math.cos(lean)}, V={x:Math.cos(lean),y:Math.sin(lean)};
  const pt=(h,w)=>({x:P.x+U.x*h+V.x*w, y:P.y+U.y*h+V.y*w});
  const sh=D.torso*0.9 + br*0.35;
  const Sn=pt(sh,-(D.shW-2.6)), Sf=pt(sh,D.shW-3.4);
  const off=lean*0.4;
  const En={x:Sn.x+dirv(a.nu+off).x*D.armL, y:Sn.y+dirv(a.nu+off).y*D.armL};
  const Hn={x:En.x+dirv(a.nf+off).x*D.foreL, y:En.y+dirv(a.nf+off).y*D.foreL};
  const Ef={x:Sf.x+dirv(a.fu+off).x*D.armL, y:Sf.y+dirv(a.fu+off).y*D.armL};
  const Hf={x:Ef.x+dirv(a.ff+off).x*D.foreL, y:Ef.y+dirv(a.ff+off).y*D.foreL};
  const N=pt(D.torso*1.0,0.8);
  const Hc={x:N.x+U.x*(4.6+D.head*0.62)+V.x*1.6, y:N.y+U.y*(4.6+D.head*0.62)+V.y*1.6};
  return {B,D,P,U,V,pt,hF,hN,kF,kN,fF,fN,aF,aN,Sn,Sf,En,Hn,Ef,Hf,N,Hc,a,lean,br,eye,tilt:lean*0.55+tilt};
}

// ---------- ORTAK ÇİZİM ARAÇLARI ----------
let LX=-0.7, _tint=null, _tintA=0;
const OL='#1f120c';
const C = col => _tintA>0 ? mix(col,_tint,_tintA) : col;
function outline(c,w=1.1){ c.strokeStyle=C(OL); c.lineWidth=w; c.stroke(); }
// Eğrisel kapsül (uzuv). bN/bS: iki yandaki kas kabarıklığı
function capsule(c, ax,ay,bx,by, ra,rb, bN=0,bS=0){
  const dx=bx-ax, dy=by-ay, L=Math.hypot(dx,dy)||0.001, nx=-dy/L, ny=dx/L;
  const mx=(ax+bx)/2, my=(ay+by)/2, h=(ra+rb)/2, qN=h*(1+2*bN), qS=h*(1+2*bS), an=Math.atan2(ny,nx);
  c.beginPath(); c.moveTo(ax+nx*ra, ay+ny*ra);
  c.quadraticCurveTo(mx+nx*qN, my+ny*qN, bx+nx*rb, by+ny*rb);
  c.arc(bx,by,rb, an, an-Math.PI, true);
  c.quadraticCurveTo(mx-nx*qS, my-ny*qS, ax-nx*ra, ay-ny*ra);
  c.arc(ax,ay,ra, an-Math.PI, an-2*Math.PI, true);
  c.closePath();
  return {nx,ny,mx,my,h:Math.max(qN,qS)*0.75};
}
function limbFill(c, g, base, hi=0.2, lo=-0.34){
  const s=(g.nx*LX - g.ny*0.7)>0?1:-1;
  c.fillStyle=lg(c, g.mx+g.nx*g.h*s, g.my+g.ny*g.h*s, g.mx-g.nx*g.h*s, g.my-g.ny*g.h*s,
    [[0,C(shade(base,hi))],[0.42,C(base)],[1,C(shade(base,lo))]]);
  c.fill(); outline(c);
}
// Catmull-Rom yumuşak yol
function spline(c, P, closed=true){
  const n=P.length, g=i=>closed?P[(i+n)%n]:P[clamp(i,0,n-1)];
  c.beginPath(); c.moveTo(P[0].x,P[0].y);
  for(let i=0;i<(closed?n:n-1);i++){ const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
    c.bezierCurveTo(p1.x+(p2.x-p0.x)/6, p1.y+(p2.y-p0.y)/6, p2.x-(p3.x-p1.x)/6, p2.y-(p3.y-p1.y)/6, p2.x, p2.y); }
  if(closed) c.closePath();
}

// ---------- ANA ÇİZİM ----------
// st: {facing, kind, p, act, walk, wa, dead, tint, tintA, seed, shadow}
function drawHero(c, X, Y, size, look, st={}, t=0){
  const f=st.facing||1, R=rig(look,st,t), s=size/100*R.D.grow;
  LX=-f*0.7; _tint=st.tint||null; _tintA=st.tintA||0;
  c.save(); c.translate(X,Y);
  if(st.shadow!==false){ c.fillStyle='rgba(28,12,6,0.32)'; ell(c, R.P.x*s*f*0.4, 0.6*s, (15+R.D.hiW)*s*(1+(st.dead||0)*0.7), 3.6*s); c.fill(); }
  if(st.dead){ const d=easeIn(st.dead); c.translate(-f*d*16*s, -d*5*s); c.rotate(-f*d*Math.PI*0.47); }
  c.scale(f*s, s); c.lineJoin='round'; c.lineCap='round';
  drawCape(c,R,look,t,st);
  drawLeg(c,R,false,look);
  drawArm(c,R,false,look); fist(c,R.Hf,R.D,shade(look.skin,-0.14));
  drawLeg(c,R,true,look);
  drawSkirt(c,R,look,t,st);
  drawTorso(c,R,look,t);
  if(look.shield && look.shield.t!=='none') drawShield(c, look.shield, R.Hf.x+2.4, R.Hf.y-0.5, look);
  drawHead(c,R,look,st,t);
  drawArm(c,R,true,look);
  const tip = drawWeapon(c, look.weapon, R.Hn.x, R.Hn.y, R.a.wp+R.lean*0.4, look, t);
  fist(c,R.Hn,R.D,look.skin);
  c.restore(); _tintA=0;
  R.s=s;
  R.tipW = tip ? {x:X+tip.x*s*f, y:Y+tip.y*s} : null;
  R.headW = {x:X+R.Hc.x*s*f, y:Y+R.Hc.y*s};
  R.handW = {x:X+R.Hn.x*s*f, y:Y+R.Hn.y*s};
  return R;
}

function drawLeg(c,R,near,look){
  const D=R.D,B=R.B, h=near?R.hN:R.hF, k=near?R.kN:R.kF, f=near?R.fN:R.fF, a=near?R.aN:R.aF;
  const skin = near?look.skin:shade(look.skin,-0.14);
  limbFill(c, capsule(c,h.x,h.y,k.x,k.y,D.thigh,D.thigh*0.74,0.05,0.12), skin);
  limbFill(c, capsule(c,k.x,k.y,a.x,a.y,D.calf,D.calf*0.55,0.24,0.02), skin);
  // sandalet
  const fx=f.x, fy=f.y;
  c.beginPath(); c.moveTo(fx-3.2,fy); c.lineTo(fx-3.5,fy-3.1); c.quadraticCurveTo(fx-1,fy-5.3,fx+2.2,fy-4.1);
  c.quadraticCurveTo(fx+7,fy-2.7,fx+9.2,fy-1.1); c.quadraticCurveTo(fx+9.9,fy,fx+8.6,fy+0.2); c.closePath();
  c.fillStyle=C(shade(skin,-0.04)); c.fill(); outline(c);
  line(c,fx-3.7,fy+0.4,fx+9.1,fy+0.4,C('#3b2414'),1.5);
  c.strokeStyle=C('#4a2c18'); c.lineWidth=0.95; c.beginPath();
  for(let i=0;i<4;i++){ const q=0.6+i*0.11, x=lerp(k.x,a.x,q), y=lerp(k.y,a.y,q), w=lerp(D.calf,D.calf*0.55,q)*1.05; c.moveTo(x-w,y-0.7); c.lineTo(x+w,y+0.8); }
  c.moveTo(fx-1,fy-3.9); c.lineTo(fx+4,fy-2.9); c.moveTo(fx+1.4,fy-4.4); c.lineTo(fx+6.5,fy-1.7); c.stroke();
  if(!look.civ && B.d>(near?0.6:0.3)) greave(c,k,a,D);
}
function greave(c,k,a,D){
  const w0=D.calf*1.05, w1=D.calf*0.7;
  c.beginPath(); c.moveTo(k.x+w0*0.95,k.y+2.5); c.quadraticCurveTo(k.x+w0*1.35,lerp(k.y,a.y,0.45),a.x+w1*1.1,a.y-1.2);
  c.lineTo(a.x-w1*0.3,a.y-0.8); c.quadraticCurveTo(k.x-w0*0.1,lerp(k.y,a.y,0.5),k.x-w0*0.25,k.y+3); c.closePath();
  c.fillStyle=lg(c,k.x-w0,k.y,k.x+w0*1.3,k.y,[[0,C('#6c7580')],[0.55,C('#dfe4e8')],[1,C('#7d858d')]]); c.fill(); outline(c,0.9);
  ell(c,k.x+w0*0.55,k.y+0.8,w0*0.8,w0*0.62); c.fillStyle=C('#c6cdd3'); c.fill(); outline(c,0.9);
}
function fist(c,h,D,skin){
  circ(c,h.x,h.y,D.fArm*0.98); c.fillStyle=C(shade(skin,0.05)); c.fill(); outline(c);
  c.strokeStyle=C(shade(skin,-0.4)); c.lineWidth=0.6; c.beginPath(); c.arc(h.x+0.6,h.y,D.fArm*0.55,-0.9,0.9); c.stroke();
}
function drawArm(c,R,near,look){
  const D=R.D,B=R.B, s=near?R.Sn:R.Sf, e=near?R.En:R.Ef, h=near?R.Hn:R.Hf;
  const skin=near?look.skin:shade(look.skin,-0.14), ar=look.civ?{t:'none'}:(look.armor||{t:'none'});
  circ(c,s.x,s.y,D.uArm*1.22); c.fillStyle=C(skin); c.fill(); outline(c);
  const gu=capsule(c,s.x,s.y,e.x,e.y,D.uArm*1.05,D.fArm*0.95,0.08+B.m*0.1,0.16+B.m*0.28); limbFill(c,gu,skin);
  const gf=capsule(c,e.x,e.y,h.x,h.y,D.fArm,D.fArm*0.72,0.12+B.m*0.14,0.05); limbFill(c,gf,skin);
  if(look.garb==='tunic'||look.garb==='robe'){ // kısa kol
    limbFill(c, capsule(c,s.x,s.y,lerp(s.x,e.x,0.55),lerp(s.y,e.y,0.55),D.uArm*1.35,D.uArm*1.2), near?look.cloth:shade(look.cloth,-0.15));
  }
  if(ar.t==='chain'||ar.t==='scale'){
    limbFill(c, capsule(c,s.x,s.y,lerp(s.x,e.x,0.5),lerp(s.y,e.y,0.5),D.uArm*1.38,D.uArm*1.25), near?ar.base:shade(ar.base,-0.15));
  } else if(ar.t==='plate'){
    for(let i=2;i>=0;i--){ const q=i*0.17, x=lerp(s.x,e.x,q), y=lerp(s.y,e.y,q);
      ell(c,x,y-0.5,D.uArm*1.55,D.uArm*1.05,Math.atan2(e.y-s.y,e.x-s.x)+Math.PI/2);
      c.fillStyle=lg(c,x-4,y-4,x+4,y+4,[[0,C(shade(ar.base,0.35))],[1,C(ar.dark)]]); c.fill(); outline(c,0.9); }
  }
  const band=(q,r,col,w=1.6)=>{ const g=q<1?gu:gf, a=q<1?s:e, b=q<1?e:h, t=q<1?q:q-1;
    const x=lerp(a.x,b.x,t), y=lerp(a.y,b.y,t); c.strokeStyle=C(col); c.lineWidth=w;
    c.beginPath(); c.moveTo(x+g.nx*r,y+g.ny*r); c.lineTo(x-g.nx*r,y-g.ny*r); c.stroke(); };
  if(!look.civ){
    if(near && B.d>0.15){ // kolluk (manica)
      const from = B.d>0.45?0.35:1.1;
      for(let q=1.9;q>=from;q-=0.2){ band(q, (q<1?D.uArm:D.fArm)*1.15, '#8e979f', 2.6); band(q-0.02,(q<1?D.uArm:D.fArm)*1.1,'#d5dbe0',0.7); }
    }
    if(near && B.c>0.3) band(0.62, D.uArm*1.08, '#e2b44a', 1.8);
    if(near && B.c>0.62) band(1.55, D.fArm*1.05, '#e2b44a', 1.6);
    if(B.a>0.25){ band(1.86, D.fArm*0.85, '#e6d9bd', 1.5); band(1.76, D.fArm*0.9, '#cbbd9e', 1.2); }
  }
}
