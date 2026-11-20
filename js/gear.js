"use strict";
// ---------- SİLAH, KALKAN, MİĞFER, SİMGELER ----------

function metal(c,x0,y0,x1,y1,base,hi,dark){ return lg(c,x0,y0,x1,y1,[[0,C(hi)],[0.35,C(base)],[0.7,C(shade(base,-0.12))],[1,C(dark)]]); }

// Silah: el (hx,hy) noktasında, phi yönünde (aşağıdan öne açı). Uç noktasını döndürür.
function drawWeapon(c,g,hx,hy,phi,look,t=0){
  if(!g || g.t==='none') return null;
  const ang=Math.atan2(Math.cos(phi),Math.sin(phi));
  c.save(); c.translate(hx,hy); c.rotate(ang);
  let tip=0;
  if(g.t==='sword'){
    const L=g.len,w=g.w; tip=L+4.5;
    if(g.glow) glow(c,L*0.55,0,L*0.75,g.glow,0.28+0.08*Math.sin(t/260));
    circ(c,-5.4,0,2); c.fillStyle=metal(c,-7,-2,-3,2,g.pommel,shade(g.pommel,0.5),shade(g.pommel,-0.5)); c.fill(); outline(c,0.8);
    rr(c,-4.6,-1.45,7.4,2.9,1); c.fillStyle=lg(c,0,-1.5,0,1.5,[[0,C(shade(g.grip,0.25))],[1,C(shade(g.grip,-0.35))]]); c.fill(); outline(c,0.8);
    c.strokeStyle=C(shade(g.grip,-0.5)); c.lineWidth=0.5; c.beginPath(); for(let x=-3.8;x<2.4;x+=1.3){ c.moveTo(x,-1.4); c.lineTo(x+0.8,1.4); } c.stroke();
    c.beginPath(); c.moveTo(4.6,-w*0.5);
    if(g.leaf){ c.quadraticCurveTo(L*0.55,-w*0.95,L*0.82,-w*0.42); } else c.lineTo(L*0.84,-w*0.46);
    c.lineTo(L+4.5,0);
    if(g.leaf){ c.lineTo(L*0.82,w*0.42); c.quadraticCurveTo(L*0.55,w*0.95,4.6,w*0.5); } else { c.lineTo(L*0.84,w*0.46); c.lineTo(4.6,w*0.5); }
    c.closePath(); c.fillStyle=lg(c,0,-w*0.6,0,w*0.6,[[0,C(g.edge)],[0.42,C(g.blade)],[0.55,C(shade(g.blade,-0.15))],[1,C(shade(g.blade,-0.45))]]); c.fill(); outline(c,0.85);
    line(c,5.6,0,L*0.72,0,C(shade(g.blade,-0.35)),0.7);
    line(c,5,-w*0.36,L*0.8,-w*0.3,'rgba(255,255,255,0.55)',0.6);
    if(g.rust){ c.fillStyle=rgba('#6b3a1c',0.55); for(const [x,y,s] of [[L*0.3,-0.6,1.3],[L*0.55,0.8,1],[L*0.7,-0.3,0.8],[L*0.42,1,0.7]]){ ell(c,x,y,s*1.4,s*0.7); c.fill(); } }
    if(g.sheen){ line(c,L*0.2,-w*0.18,L*0.75,-w*0.12,rgba(g.sheen,0.8),0.6); }
    rr(c,2.4,-(w*0.5+2.6),2.3,w+5.2,0.9); c.fillStyle=metal(c,2,-w,5,w,g.guard,shade(g.guard,0.45),shade(g.guard,-0.5)); c.fill(); outline(c,0.8);
  } else if(g.t==='spear'){
    const L=g.len, back=L*0.42, front=L*0.58; tip=front;
    rr(c,-back,-1.15,back+front-g.head+1,2.3,1.1); c.fillStyle=lg(c,0,-1.2,0,1.2,[[0,C(shade(g.shaft,0.3))],[1,C(shade(g.shaft,-0.4))]]); c.fill(); outline(c,0.8);
    poly(c,[-back,-1.2,-back-3.4,0,-back,1.2]); c.fillStyle=C(shade(g.blade,-0.3)); c.fill(); outline(c,0.7);
    rr(c,front-g.head-1.5,-1.6,3,3.2,0.8); c.fillStyle=C(shade(g.blade,-0.2)); c.fill(); outline(c,0.7);
    c.beginPath(); c.moveTo(front-g.head,-1.3); c.quadraticCurveTo(front-g.head*0.45,-3.8,front,0); c.quadraticCurveTo(front-g.head*0.45,3.8,front-g.head,1.3); c.closePath();
    c.fillStyle=lg(c,0,-3.5,0,3.5,[[0,C(g.edge)],[0.5,C(g.blade)],[1,C(shade(g.blade,-0.45))]]); c.fill(); outline(c,0.8);
    line(c,front-g.head+1,0,front-1.5,0,C(shade(g.blade,-0.4)),0.6);
    c.strokeStyle=C('#3b2414'); c.lineWidth=0.6; c.beginPath(); for(let x=-3;x<3;x+=1.1){ c.moveTo(x,-1.2); c.lineTo(x+0.6,1.2); } c.stroke();
  } else if(g.t==='axe'){
    const L=g.len; tip=L+2;
    rr(c,-6,-1.35,L+6,2.7,1.2); c.fillStyle=lg(c,0,-1.4,0,1.4,[[0,C(shade(g.shaft,0.3))],[1,C(shade(g.shaft,-0.4))]]); c.fill(); outline(c,0.8);
    for(const s of [-1,1]){
      c.beginPath(); c.moveTo(L-7,s*1.4); c.quadraticCurveTo(L-8,s*6,L-13,s*12); c.quadraticCurveTo(L-4.5,s*15.5,L+4,s*12); c.quadraticCurveTo(L-1,s*6,L-2,s*1.4); c.closePath();
      c.fillStyle=metal(c,L-12,-s*2,L+3,s*14,g.blade,g.edge,shade(g.blade,-0.45)); c.fill(); outline(c,0.85);
      c.strokeStyle=C(g.edge); c.lineWidth=0.9; c.beginPath(); c.moveTo(L-12.2,s*12); c.quadraticCurveTo(L-4.5,s*15,L+3.2,s*12); c.stroke();
    }
    rr(c,L-8.5,-2.6,7.5,5.2,1.2); c.fillStyle=C(shade(g.blade,-0.25)); c.fill(); outline(c,0.8);
  } else if(g.t==='hammer'){
    tip=22; rr(c,-4,-1.1,24,2.2,1); c.fillStyle=C('#6e4a2c'); c.fill(); outline(c,0.8);
    rr(c,18,-4.2,7,8.4,1.2); c.fillStyle=metal(c,18,-4,25,4,'#5d6268','#a9b0b6','#2c3034'); c.fill(); outline(c,0.8);
  } else if(g.t==='brush'){
    tip=15; rr(c,-2,-0.7,14,1.4,0.6); c.fillStyle=C('#8a6440'); c.fill(); outline(c,0.6);
    poly(c,[12,-1.3,16,-0.8,16,0.8,12,1.3]); c.fillStyle=C(g.col||'#b52e22'); c.fill(); outline(c,0.6);
  } else if(g.t==='file'){
    tip=14; rr(c,-3,-0.9,6,1.8,0.8); c.fillStyle=C('#5a3a20'); c.fill(); rr(c,3,-0.8,11,1.6,0.4); c.fillStyle=C('#9aa1a7'); c.fill(); outline(c,0.6);
  }
  c.restore();
  return {x:hx+Math.cos(ang)*tip, y:hy+Math.sin(ang)*tip};
}

// Kalkan: merkez (cx,cy). front=true ise tam karşıdan (simge için)
function drawShield(c,g,cx,cy,look,front=false){
  if(!g || g.t==='none') return;
  const base = g.tint && look ? look.cloth : g.base, sq = front?1:0.66;
  if(g.t==='round'){
    const r=g.r, rx=r*sq;
    if(!front){ ell(c,cx-1.6,cy,rx,r); c.fillStyle=C(g.dark); c.fill(); outline(c); }
    ell(c,cx,cy,rx,r); c.fillStyle=lg(c,cx-rx,cy-r,cx+rx,cy+r,[[0,C(shade(base,0.25))],[0.5,C(base)],[1,C(shade(base,-0.35))]]); c.fill();
    c.save(); ell(c,cx,cy,rx,r); c.clip();
    if(g.planks){ c.strokeStyle=C(g.dark); c.lineWidth=0.7; c.beginPath(); for(let i=1;i<5;i++){ const x=cx-rx+i*rx*0.4; c.moveTo(x,cy-r); c.lineTo(x,cy+r); } c.stroke();
      c.fillStyle=rgba('#2a160a',0.18); for(let i=0;i<5;i++){ ell(c,cx-rx*0.6+i*rx*0.3,cy+((i*37)%9-4)*r*0.15,rx*0.08,r*0.05); c.fill(); } }
    if(g.emblem){ c.strokeStyle=C(shade(base,0.35)); c.lineWidth=0.9; ell(c,cx,cy,rx*0.68,r*0.68); c.stroke();
      c.beginPath(); for(let i=0;i<12;i++){ const a=i/12*TAU; c.moveTo(cx+Math.cos(a)*rx*0.36,cy+Math.sin(a)*r*0.36); c.lineTo(cx+Math.cos(a)*rx*0.64,cy+Math.sin(a)*r*0.64); } c.stroke(); }
    c.fillStyle='rgba(255,255,255,0.16)'; ell(c,cx-rx*0.35,cy-r*0.35,rx*0.35,r*0.5,-0.5); c.fill();
    c.restore();
    ell(c,cx,cy,rx,r); c.strokeStyle=C(g.rim); c.lineWidth=2.1; c.stroke(); outline(c,0.7);
    ell(c,cx+(front?0:0.9),cy,rx*0.3,r*0.3); c.fillStyle=lg(c,cx-rx*0.3,cy-r*0.3,cx+rx*0.3,cy+r*0.3,[[0,C(shade(g.boss,0.5))],[1,C(shade(g.boss,-0.4))]]); c.fill(); outline(c,0.7);
    circ(c,cx-rx*0.08,cy-r*0.1,r*0.07); c.fillStyle='rgba(255,255,255,0.7)'; c.fill();
  } else if(g.t==='tower'){
    const w=g.w*(front?0.8:sq*0.62), h=g.h, x0=cx-w/2, y0=cy-h/2;
    if(!front){ rr(c,x0-1.8,y0+0.5,w,h,3.5); c.fillStyle=C(g.dark); c.fill(); outline(c); }
    rr(c,x0,y0,w,h,3.5); c.fillStyle=lg(c,x0,0,x0+w,0,[[0,C(shade(base,-0.25))],[0.3,C(shade(base,0.25))],[0.55,C(base)],[1,C(shade(base,-0.45))]]); c.fill(); outline(c);
    rr(c,x0+1.6,y0+1.6,w-3.2,h-3.2,2.4); c.strokeStyle=C(g.rim); c.lineWidth=1.2; c.stroke();
    c.strokeStyle=C(g.rim); c.lineWidth=0.9; c.beginPath();
    for(let i=0;i<8;i++){ const a=i/8*TAU+0.39; c.moveTo(cx+Math.cos(a)*w*0.16,cy+Math.sin(a)*w*0.16); c.lineTo(cx+Math.cos(a)*w*0.42,cy+Math.sin(a)*h*0.36); } c.stroke();
    line(c,cx,y0+3,cx,cy-w*0.2,C(g.rim),1); line(c,cx,cy+w*0.2,cx,y0+h-3,C(g.rim),1);
    ell(c,cx,cy,w*0.17,w*0.17*(front?1:1.3)); c.fillStyle=lg(c,cx-3,cy-3,cx+3,cy+3,[[0,C(shade(g.boss,0.5))],[1,C(shade(g.boss,-0.45))]]); c.fill(); outline(c,0.7);
  }
}

// Miğfer: baş yerel koordinatında (r: baş yarıçapı)
function drawHelmet(c,g,r,look,t,st={}){
  const M=(x0,y0,x1,y1)=>metal(c,x0,y0,x1,y1,g.base,g.hi,g.dark);
  if(g.t==='cap'){
    c.beginPath(); c.moveTo(r*0.88,-r*0.38); c.bezierCurveTo(r*0.7,-r*1.27,-r*0.76,-r*1.32,-r*1.09,-r*0.3);
    c.quadraticCurveTo(-r*1.12,r*0.36,-r*0.75,r*0.64); c.lineTo(-r*0.4,r*0.42); c.quadraticCurveTo(-r*0.25,-r*0.15,r*0.2,-r*0.3); c.quadraticCurveTo(r*0.55,-r*0.35,r*0.88,-r*0.38); c.closePath();
    c.fillStyle=M(-r,-r*1.2,r,r*0.4); c.fill(); outline(c);
    c.strokeStyle=C(g.dark); c.lineWidth=0.6; c.setLineDash([1,0.9]); c.beginPath(); c.moveTo(r*0.7,-r*0.5); c.bezierCurveTo(r*0.5,-r*1.08,-r*0.6,-r*1.12,-r*0.92,-r*0.32); c.stroke(); c.setLineDash([]);
    rr(c,-r*0.42,-r*0.22,r*0.5,r*0.75,r*0.15); c.fillStyle=C(shade(g.base,-0.1)); c.fill(); outline(c,0.7);
    return;
  }
  const ext = g.t==='iron'||g.t==='champion' ? 1.25 : 1;
  // ense koruması
  if(g.t!=='bronze'){ c.beginPath(); c.moveTo(-r*1.1,r*0.05); c.quadraticCurveTo(-r*1.35,r*0.4,-r*1.55,r*0.72); c.lineTo(-r*0.95,r*0.78); c.lineTo(-r*0.66,r*0.5); c.closePath(); c.fillStyle=M(-r*1.5,0,-r*0.6,r); c.fill(); outline(c); }
  // kubbe
  c.beginPath(); c.moveTo(r*1.02,-r*0.3); c.bezierCurveTo(r*0.97,-r*1.44,-r*0.97,-r*1.52,-r*1.16,-r*0.35);
  c.lineTo(-r*1.13,r*0.35*ext); c.quadraticCurveTo(-r*0.96,r*0.64*ext,-r*0.62,r*0.56*ext); c.lineTo(-r*0.42,r*0.12);
  c.quadraticCurveTo(-r*0.15,-r*0.33,r*0.36,-r*0.34); c.quadraticCurveTo(r*0.7,-r*0.36,r*1.02,-r*0.3); c.closePath();
  c.fillStyle=M(-r*0.6,-r*1.4,r*0.8,r*0.5); c.fill(); outline(c);
  c.strokeStyle='rgba(255,255,255,0.6)'; c.lineWidth=r*0.09; c.beginPath(); c.arc(-r*0.05,-r*0.42,r*0.78,-2.55,-1.65); c.stroke();
  // alın bandı / siper
  if(g.t==='iron'||g.t==='champion'){ poly(c,[r*0.62,-r*0.46,r*1.24,-r*0.36,r*1.02,-r*0.24,r*0.55,-r*0.3]); c.fillStyle=M(r*0.6,-r*0.5,r*1.2,-r*0.2); c.fill(); outline(c,0.8); }
  else { c.strokeStyle=C(g.dark); c.lineWidth=r*0.12; c.beginPath(); c.moveTo(r*1.0,-r*0.33); c.quadraticCurveTo(r*0.2,-r*0.42,-r*1.1,-r*0.3); c.stroke(); }
  // yanak koruması
  c.beginPath(); c.moveTo(r*0.02,-r*0.3); c.lineTo(r*0.3,-r*0.31); c.quadraticCurveTo(r*0.5,r*0.0,r*0.54,r*0.16);
  c.quadraticCurveTo(r*0.66,r*0.5,r*0.6,r*0.74); c.quadraticCurveTo(r*0.36,r*0.86,r*0.16,r*0.74); c.quadraticCurveTo(-r*0.05,r*0.3,r*0.02,-r*0.3); c.closePath();
  c.fillStyle=M(0,-r*0.3,r*0.6,r*0.8); c.fill(); outline(c,0.9);
  c.fillStyle=C(g.hi); for(const [x,y] of [[r*0.22,-r*0.12],[r*0.36,r*0.5]]){ circ(c,x,y,r*0.06); c.fill(); }
  if(g.t==='bronze'){ c.strokeStyle=C(g.dark); c.lineWidth=r*0.14; c.beginPath(); c.moveTo(r*0.2,-r*1.28); c.quadraticCurveTo(-r*0.6,-r*1.36,-r*1.0,-r*0.9); c.stroke(); c.strokeStyle=C(g.hi); c.lineWidth=r*0.05; c.stroke(); }
  // sorguç
  if(g.plume){
    const tall = g.t==='champion' ? 1.7 : 1, sw=Math.sin(t/380+(st.seed||0))*0.6*tall;
    rr(c,-r*0.16,-r*1.42,r*0.32,r*0.3,r*0.05); c.fillStyle=C(g.dark); c.fill();
    c.beginPath(); c.moveTo(r*0.55,-r*1.25); c.quadraticCurveTo(r*0.1+sw,-r*(1.35+0.9*tall),-r*1.4+sw*2,-r*(1.25+0.45*tall));
    c.quadraticCurveTo(-r*0.9+sw,-r*(1.1+0.2*tall),-r*0.6,-r*1.2); c.quadraticCurveTo(r*0.0,-r*1.5,r*0.55,-r*1.25); c.closePath();
    c.fillStyle=lg(c,0,-r*(1.3+0.9*tall),0,-r*1.2,[[0,C(shade(g.plume,0.25))],[1,C(shade(g.plume,-0.35))]]); c.fill(); outline(c,0.8);
    c.strokeStyle=C(shade(g.plume,-0.45)); c.lineWidth=0.5; c.beginPath();
    for(let i=0;i<6;i++){ const q=i/5; c.moveTo(lerp(r*0.4,-r*0.6,q),-r*1.3); c.lineTo(lerp(r*0.2,-r*1.2,q)+sw*1.5*q,-r*(1.45+0.7*tall*(1-Math.abs(q-0.45)))); } c.stroke();
  }
}

// ---------- SİMGELER (dükkân listesi) ----------
function drawArmorIcon(c,g,look,cx,cy,s){
  c.save(); c.translate(cx,cy); c.scale(s,s);
  const P=[{x:-14,y:-15},{x:-6,y:-18},{x:6,y:-18},{x:14,y:-15},{x:13,y:-5},{x:9,y:8},{x:11,y:16},{x:-11,y:16},{x:-9,y:8},{x:-13,y:-5}];
  const path=()=>{ c.beginPath(); c.moveTo(P[0].x,P[0].y); for(const q of P.slice(1)) c.lineTo(q.x,q.y); c.closePath(); };
  const base = g.t==='none' ? look.cloth : g.base;
  path(); c.fillStyle=lg(c,-14,-18,14,16,[[0,C(shade(base,0.3))],[0.5,C(base)],[1,C(shade(base,-0.4))]]); c.fill();
  c.save(); path(); c.clip();
  if(g.t==='chain'){ c.strokeStyle=C(g.dark); c.lineWidth=0.5; c.beginPath(); let row=0; for(let y=-18;y<17;y+=1.6,row++) for(let x=-15+(row%2)*0.9;x<15;x+=1.8){ c.moveTo(x+0.8,y); c.arc(x,y,0.8,0,Math.PI); } c.stroke(); }
  if(g.t==='scale'){ let row=0; for(let y=-18;y<17;y+=2.3,row++){ c.beginPath(); for(let x=-16+(row%2)*1.3;x<16;x+=2.6){ c.moveTo(x-1.3,y); c.arc(x,y,1.3,Math.PI,0,true); } c.fillStyle=C(shade(base,0.25)); c.fill(); c.strokeStyle=C(g.dark); c.lineWidth=0.5; c.stroke(); } }
  if(g.t==='plate'){ c.strokeStyle=C(g.dark); c.lineWidth=0.8; c.beginPath(); c.moveTo(-10,-3); c.quadraticCurveTo(-5,1,0,-3); c.quadraticCurveTo(5,1,10,-3); c.moveTo(0,-3); c.lineTo(0,12); for(const y of [3,7]){ c.moveTo(-5,y); c.lineTo(5,y); } c.stroke();
    c.strokeStyle='rgba(255,255,255,0.6)'; c.lineWidth=1.2; c.beginPath(); c.moveTo(-9,-12); c.quadraticCurveTo(-11,0,-7,10); c.stroke(); }
  if(g.t==='leather'){ c.strokeStyle=C(g.trim); c.lineWidth=0.7; c.setLineDash([1.1,1]); c.beginPath(); c.moveTo(0,-14); c.lineTo(0,14); c.moveTo(-12,-8); c.quadraticCurveTo(0,-4,12,-8); c.stroke(); c.setLineDash([]); }
  if(g.t==='none'){ c.strokeStyle=C(shade(base,-0.4)); c.lineWidth=0.8; c.beginPath(); c.moveTo(-6,-18); c.lineTo(12,14); c.moveTo(-10,-6); c.quadraticCurveTo(-4,4,-6,15); c.stroke(); c.fillStyle=C('#d8b994'); poly(c,[-6,-18,-14,-15,-13,-5,-9,4]); c.fill(); }
  c.restore();
  path(); outline(c,1);
  c.fillStyle=C('#1d1410'); ell(c,0,-17,4.5,2.4); c.fill();
  if(g.trim && g.t!=='leather'){ c.strokeStyle=C(g.trim); c.lineWidth=1.2; c.beginPath(); c.moveTo(-11,15); c.lineTo(11,15); c.stroke(); }
  c.restore();
}

function drawItemIcon(c,slot,g,cx,cy,size,look){
  if(slot==='weapon'){
    const span = g.t==='spear' ? g.len+4 : g.t==='axe' ? g.len+12 : g.len+12, s=size*1.25/span;
    const center = g.t==='spear' ? (g.len*0.58 - g.len*0.42)/2 : g.t==='axe' ? (g.len-6)/2+2 : (g.len+4.5-7.4)/2;
    c.save(); c.translate(cx,cy); c.scale(s,s);
    const d={x:0.7071,y:-0.7071}; drawWeapon(c,g,-d.x*center,-d.y*center,2.356,look,performance.now());
    c.restore();
  } else if(slot==='armor'){ drawArmorIcon(c,g,look,cx,cy+size*0.04,size/40); }
  else if(slot==='helmet'){
    const r=size*0.27; c.save(); c.translate(cx-size*0.03,cy+size*0.1);
    c.globalAlpha=0.28; headPath(c,r,1); c.fillStyle='#000'; c.fill(); c.globalAlpha=1;
    if(g.t!=='none') drawHelmet(c,g,r,look,performance.now()); c.restore();
  } else if(slot==='shield'){
    const s = g.t==='tower' ? size*0.95/g.h : size*0.85/(g.r*2);
    c.save(); c.translate(cx,cy); c.scale(s,s); drawShield(c,g,0,0,look,true); c.restore();
  }
}
