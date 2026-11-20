"use strict";
// ---------- GÖVDE, ZIRH, ETEK, PELERİN, BAŞ ----------

function torsoPts(R, look){
  const D=R.D,B=R.B,L=D.torso,pt=R.pt, br=1+R.br*0.012, fem=look.fem?1:0;
  return [pt(0,-D.hiW), pt(L*0.42,-D.waW), pt(L*0.72,-D.chW*br), pt(L*0.93,-D.shW), pt(L*1.03,-D.neck), pt(L*1.03,D.neck),
          pt(L*0.93,D.shW*0.88), pt(L*0.73,(D.chW+1.2+B.m*1.8+fem*2.4)*br), pt(L*0.44,D.waW+D.belly*0.7), pt(L*0.12,D.hiW+D.belly*0.3), pt(0,D.hiW)];
}

function drawTorso(c,R,look,t){
  const D=R.D,B=R.B,L=D.torso,pt=R.pt, pts=torsoPts(R,look);
  const ls=LX<0?-1:1, A=pt(L*0.65,ls*D.shW), Z=pt(L*0.65,-ls*D.shW);
  const grad=(base,hi=0.18,lo=-0.32)=>lg(c,A.x,A.y,Z.x,Z.y,[[0,C(shade(base,hi))],[0.45,C(base)],[1,C(shade(base,lo))]]);
  const ar = look.garb ? {t:look.garb} : (look.armor||{t:'none'});
  spline(c,pts); c.fillStyle=grad(look.skin); c.fill();
  c.save(); spline(c,pts); c.clip();
  if(ar.t==='none'||ar.t==='apron') muscles(c,R,look);
  const fillPoly=(P,fill)=>{ c.beginPath(); c.moveTo(P[0].x,P[0].y); for(const q of P.slice(1)) c.lineTo(q.x,q.y); c.closePath(); c.fillStyle=fill; c.fill(); };
  if(ar.t==='none'){ // tek omuzlu tunik (exomis)
    const top=pt(L*1.0,D.shW*0.45), low=pt(L*0.2,-D.waW*1.45);
    fillPoly([top, pt(L*1.04,D.shW*1.4), pt(-2,D.hiW*1.5), pt(-2,-D.hiW*1.5), low], grad(look.cloth));
    c.strokeStyle=C(shade(look.cloth,0.3)); c.lineWidth=1.4; c.beginPath(); c.moveTo(top.x,top.y); c.quadraticCurveTo(pt(L*0.55,D.chW*0.05).x,pt(L*0.55,D.chW*0.05).y,low.x,low.y); c.stroke();
    c.strokeStyle=C(shade(look.cloth,-0.38)); c.lineWidth=0.8; c.beginPath();
    for(let i=1;i<4;i++){ const a=pt(L*(0.95-i*0.06),D.shW*(0.55+i*0.14)), b=pt(L*(0.2-i*0.04),-D.waW*(1.1-i*0.45)); c.moveTo(a.x,a.y); c.quadraticCurveTo((a.x+b.x)/2+1.2,(a.y+b.y)/2+1,b.x,b.y); }
    c.stroke();
  }
  else if(ar.t==='apron'){
    fillPoly([pt(L*0.74,-D.chW*0.55), pt(L*0.78,D.chW*1.4), pt(-3,D.hiW*1.6), pt(-3,-D.hiW*0.9)], grad('#6b4528',0.15,-0.35));
    c.strokeStyle=C('#3a2414'); c.lineWidth=0.8; c.setLineDash([1.2,1.2]); c.beginPath(); const q=pt(L*0.7,-D.chW*0.45), w=pt(L*0.73,D.chW*1.3); c.moveTo(q.x,q.y); c.lineTo(w.x,w.y); c.stroke(); c.setLineDash([]);
  }
  else if(ar.t==='tunic'||ar.t==='robe'){
    fillPoly([pt(-3,-D.hiW*1.6), pt(L*1.1,-D.shW*1.4), pt(L*1.1,D.shW*1.4), pt(-3,D.hiW*1.7)], grad(look.cloth));
    c.fillStyle=C(look.skin); c.beginPath(); const n0=pt(L*1.05,-D.neck*1.3), n1=pt(L*0.86,D.neck*0.4), n2=pt(L*1.05,D.neck*1.5); c.moveTo(n0.x,n0.y); c.lineTo(n1.x,n1.y); c.lineTo(n2.x,n2.y); c.fill();
    c.strokeStyle=C(shade(look.cloth,-0.35)); c.lineWidth=0.8; c.beginPath();
    for(let i=0;i<3;i++){ const a=pt(L*0.8,D.chW*(-0.4+i*0.45)), b=pt(L*0.1,D.waW*(-0.5+i*0.5)); c.moveTo(a.x,a.y); c.quadraticCurveTo(a.x+1.5,(a.y+b.y)/2,b.x,b.y); } c.stroke();
  }
  else if(ar.t==='leather'){
    fillPoly([pt(L*0.9,-D.shW*1.4), pt(L*0.86,-D.neck*1.5), pt(L*0.8,0), pt(L*0.86,D.neck*1.5), pt(L*0.9,D.shW*1.4), pt(-3,D.hiW*1.6), pt(-3,-D.hiW*1.6)], grad(ar.base,0.2,-0.38));
    c.strokeStyle=C(ar.dark); c.lineWidth=3.2; c.beginPath(); const s1=pt(L*0.86,-D.neck*1.7), s2=pt(L*1.04,-D.shW*0.8); c.moveTo(s1.x,s1.y); c.lineTo(s2.x,s2.y); c.stroke();
    c.strokeStyle=C(ar.trim); c.lineWidth=0.7; c.setLineDash([1.1,1]); c.beginPath();
    const e0=pt(L*0.88,-D.shW*1.2), e1=pt(L*0.8,0), e2=pt(L*0.88,D.shW*1.2); c.moveTo(e0.x,e0.y); c.quadraticCurveTo(pt(L*0.82,-D.neck).x,pt(L*0.82,-D.neck).y,e1.x,e1.y); c.quadraticCurveTo(pt(L*0.82,D.neck).x,pt(L*0.82,D.neck).y,e2.x,e2.y);
    const m0=pt(L*0.78,D.chW*0.3), m1=pt(L*0.1,D.waW*0.3); c.moveTo(m0.x,m0.y); c.lineTo(m1.x,m1.y); c.stroke(); c.setLineDash([]);
    c.fillStyle=C('#d7a95a'); for(let i=0;i<3;i++){ const q=pt(L*(0.62-i*0.17),D.chW*0.55); circ(c,q.x,q.y,0.8); c.fill(); }
  }
  else if(ar.t==='chain'){
    c.fillStyle=grad(ar.base,0.25,-0.4); c.fillRect(-60,-120,120,140);
    let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9; for(const q of pts){ mnx=Math.min(mnx,q.x); mxx=Math.max(mxx,q.x); mny=Math.min(mny,q.y); mxy=Math.max(mxy,q.y); }
    c.strokeStyle=C(ar.dark); c.lineWidth=0.55; c.beginPath(); let row=0;
    for(let y=mny; y<mxy+2; y+=1.55, row++) for(let x=mnx+(row%2)*0.9; x<mxx; x+=1.8){ c.moveTo(x+0.8,y); c.arc(x,y,0.8,0,Math.PI); }
    c.stroke();
    c.strokeStyle=C(ar.trim); c.globalAlpha=0.5; c.lineWidth=0.5; c.beginPath(); row=0;
    for(let y=mny; y<mxy+2; y+=1.55, row++) for(let x=mnx+(row%2)*0.9; x<mxx; x+=1.8){ c.moveTo(x-0.7,y-0.3); c.arc(x,y-0.2,0.7,Math.PI,TAU*0.9); }
    c.stroke(); c.globalAlpha=1;
    const n0=pt(L*1.0,-D.neck*1.6), n2=pt(L*1.0,D.neck*1.6); c.strokeStyle=C(ar.dark); c.lineWidth=2.2; c.beginPath(); c.moveTo(n0.x,n0.y); c.quadraticCurveTo(pt(L*0.9,0).x,pt(L*0.9,0).y,n2.x,n2.y); c.stroke();
  }
  else if(ar.t==='scale'){
    c.fillStyle=grad(ar.dark,0.1,-0.3); c.fillRect(-60,-120,120,140);
    let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9; for(const q of pts){ mnx=Math.min(mnx,q.x); mxx=Math.max(mxx,q.x); mny=Math.min(mny,q.y); mxy=Math.max(mxy,q.y); }
    let row=0;
    for(let y=mny-1; y<mxy+3; y+=2.3, row++){
      c.beginPath(); for(let x=mnx+(row%2)*1.3-2; x<mxx+2; x+=2.6){ c.moveTo(x-1.3,y); c.arc(x,y,1.3,Math.PI,0,true); c.lineTo(x-1.3,y); }
      c.fillStyle=lg(c,0,y-1.3,0,y+1.4,[[0,C(shade(ar.base,0.35))],[1,C(shade(ar.base,-0.2))]]); c.fill();
      c.strokeStyle=C(ar.dark); c.lineWidth=0.5; c.stroke();
    }
    const n0=pt(L*1.0,-D.neck*1.6), n2=pt(L*1.0,D.neck*1.6); c.strokeStyle=C(ar.trim); c.lineWidth=1.6; c.beginPath(); c.moveTo(n0.x,n0.y); c.quadraticCurveTo(pt(L*0.9,0).x,pt(L*0.9,0).y,n2.x,n2.y); c.stroke();
  }
  else if(ar.t==='plate'){ // kaslı göğüslük
    c.fillStyle=grad(ar.base,0.42,-0.45); c.fillRect(-60,-120,120,140);
    const emb=(P,dark)=>{ for(const [o,col,w] of [[0.45,dark?ar.dark:'#ffffff',0.9],[-0.35,dark?'#ffffff':ar.dark,0.6]]){
      c.strokeStyle=C(col); c.globalAlpha=0.55; c.lineWidth=w; c.beginPath(); c.moveTo(P[0].x,P[0].y+o);
      for(let i=1;i<P.length;i+=2) c.quadraticCurveTo(P[i].x,P[i].y+o,P[i+1].x,P[i+1].y+o); c.stroke(); } c.globalAlpha=1; };
    emb([pt(L*0.86,-D.chW*0.15), pt(L*0.58,D.chW*0.25), pt(L*0.68,D.chW*1.05)], true);
    emb([pt(L*0.68,D.chW*0.3), pt(L*0.45,D.waW*0.35), pt(L*0.18,D.waW*0.35)], true);
    for(let i=0;i<2;i++) emb([pt(L*(0.48-i*0.14),D.waW*0.05), pt(L*(0.46-i*0.14),D.waW*0.35), pt(L*(0.48-i*0.14),D.waW*0.7)], true);
    c.strokeStyle='rgba(255,255,255,0.55)'; c.lineWidth=1.2; c.beginPath(); const h0=pt(L*0.85,-D.shW*0.55), h1=pt(L*0.35,-D.waW*0.75); c.moveTo(h0.x,h0.y); c.quadraticCurveTo(pt(L*0.6,-D.chW*0.8).x,pt(L*0.6,-D.chW*0.8).y,h1.x,h1.y); c.stroke();
    const n0=pt(L*1.0,-D.neck*1.6), n2=pt(L*1.0,D.neck*1.6); c.strokeStyle=C(ar.trim); c.lineWidth=1.5; c.beginPath(); c.moveTo(n0.x,n0.y); c.quadraticCurveTo(pt(L*0.88,0).x,pt(L*0.88,0).y,n2.x,n2.y); c.stroke();
  }
  c.restore();
  spline(c,pts); outline(c);
  drawBelt(c,R,look,ar);
  if(R.B.c>=0.22 && !look.civ){ const q=pt(L*0.97,D.shW*0.3); circ(c,q.x,q.y,1.9); c.fillStyle=C('#e7bb52'); c.fill(); outline(c,0.7); circ(c,q.x-0.4,q.y-0.4,0.6); c.fillStyle='#fff6d8'; c.fill(); }
}

function muscles(c,R,look){
  const D=R.D,B=R.B,L=D.torso,pt=R.pt, a=0.16+B.m*0.5, dk=C(shade(look.skin,-0.5)), lt=C(shade(look.skin,0.35));
  const Q=(p0,p1,p2,col,al,w)=>{ c.strokeStyle=rgba(col,al); c.lineWidth=w; c.beginPath(); c.moveTo(p0.x,p0.y); c.quadraticCurveTo(p1.x,p1.y,p2.x,p2.y); c.stroke(); };
  Q(pt(L*0.88,-D.chW*0.25), pt(L*0.57,D.chW*0.2), pt(L*0.69,D.chW*1.02), dk, a, 0.9+B.m*0.5);   // göğüs altı
  Q(pt(L*0.86,-D.chW*0.2), pt(L*0.75,D.chW*0.3), pt(L*0.82,D.chW*0.9), lt, a*0.6, 0.8);           // göğüs parlaklığı
  Q(pt(L*0.66,D.chW*0.28), pt(L*0.42,D.waW*0.36), pt(L*0.16,D.waW*0.3), dk, a*0.8, 0.7);          // orta çizgi
  for(let i=0;i<3;i++){ const h=L*(0.52-i*0.12); Q(pt(h,D.waW*0.05),pt(h+0.8,D.waW*0.35),pt(h,D.waW*0.66), dk, a*0.75*(B.m>0.15?1:0.4), 0.6); }
  Q(pt(L*0.98,D.neck*1.2), pt(L*0.98,D.shW*0.5), pt(L*0.93,D.shW*0.78), dk, a*0.5, 0.6);           // köprücük
  Q(pt(L*0.74,-D.chW*0.75), pt(L*0.58,-D.waW*1.05), pt(L*0.4,-D.waW*0.9), dk, a*0.4, 0.6);         // kanat kası
  if(!look.fem){ const n=pt(L*0.19,D.waW*0.34); c.fillStyle=rgba(dk,0.5); circ(c,n.x,n.y,0.55); c.fill(); }
}

function drawBelt(c,R,look,ar){
  const D=R.D,L=D.torso,pt=R.pt;
  if(look.garb==='apron') return;
  const a0=L*0.05, a1=L*(look.civ?0.11:0.17);
  const p=[pt(a0,-D.hiW*1.06), pt(a1,-D.waW*1.14-0.4), pt(a1,D.waW*1.14+D.belly*0.75), pt(a0,D.hiW*1.08+D.belly*0.35)];
  c.beginPath(); c.moveTo(p[0].x,p[0].y); for(const q of p.slice(1)) c.lineTo(q.x,q.y); c.closePath();
  const col = look.civ ? shade(look.cloth,0.25) : '#6e4527';
  c.fillStyle=lg(c,p[1].x,p[1].y,p[0].x,p[0].y,[[0,C(shade(col,0.15))],[1,C(shade(col,-0.35))]]); c.fill(); outline(c,0.9);
  if(look.civ) return;
  for(let i=0;i<4;i++){ const q=pt((a0+a1)/2, lerp(-D.waW*0.85,D.waW*0.95,i/3)); rr(c,q.x-1.35,q.y-1.7,2.7,3.4,0.6); c.fillStyle=C('#d8a84f'); c.fill(); c.strokeStyle=C('#6b4a1c'); c.lineWidth=0.4; c.stroke(); }
}

function drawSkirt(c,R,look,t,st){
  const D=R.D,P=R.P,L=D.torso,pt=R.pt, garb=look.garb, ar=look.civ?null:(look.armor||{t:'none'});
  const len = garb==='robe'?D.leg*0.93 : (garb==='tunic'||garb==='apron')?D.leg*0.45 : D.leg*0.31;
  const sway=(st.wa?Math.sin(st.walk||0)*1.8*st.wa:0)+Math.sin(t/700+(st.seed||0))*0.4;
  const hemY=P.y+len, wide=garb==='robe'?1.55:1.28, col=garb==='apron'?'#5e3d24':(ar&&ar.t==='chain'?ar.base:look.cloth);
  const tb=pt(L*0.12,-D.hiW*1.05), tf=pt(L*0.12,D.hiW*1.08+D.belly*0.35);
  const hf={x:P.x+D.hiW*wide+2+sway, y:hemY}, hb={x:P.x-D.hiW*(wide-0.05)-1+sway, y:hemY+0.6};
  c.beginPath(); c.moveTo(tb.x,tb.y); c.lineTo(tf.x,tf.y); c.quadraticCurveTo(hf.x-1,lerp(tf.y,hemY,0.55),hf.x,hf.y);
  c.quadraticCurveTo(P.x+sway*0.6,hemY+2.2,hb.x,hb.y); c.quadraticCurveTo(hb.x+0.8,lerp(tb.y,hemY,0.5),tb.x,tb.y); c.closePath();
  const ls=LX<0?-1:1;
  c.fillStyle=lg(c,P.x+ls*D.hiW*1.3,0,P.x-ls*D.hiW*1.3,0,[[0,C(shade(col,0.18))],[0.5,C(col)],[1,C(shade(col,-0.35))]]); c.fill(); outline(c);
  c.strokeStyle=C(shade(col,-0.38)); c.lineWidth=0.8; c.beginPath();
  for(let i=0;i<3;i++){ const x0=lerp(tb.x,tf.x,0.25+i*0.25), x1=lerp(hb.x,hf.x,0.22+i*0.27); c.moveTo(x0,tb.y+2); c.quadraticCurveTo(x0+0.6+sway*0.3,lerp(tb.y,hemY,0.5),x1,hemY); }
  c.stroke();
  c.strokeStyle=C(shade(col,0.3)); c.lineWidth=1; c.beginPath(); c.moveTo(hb.x+1,hb.y-1); c.quadraticCurveTo(P.x+sway*0.6,hemY+1,hf.x-1,hf.y-1); c.stroke();
  // deri şeritler (pteruges)
  if(ar && (ar.t==='leather'||ar.t==='plate'||ar.t==='scale')){
    const n=6, lc=ar.t==='plate'?'#7a4a26':ar.dark;
    for(let i=0;i<n;i++){ const q=i/(n-1), x=lerp(tb.x+1.5,tf.x-1.5,q), y=lerp(tb.y,tf.y,q)+1, h=hemY-y-1.5+Math.sin(i*1.7)*0.6;
      rr(c,x-1.7+sway*q*0.4,y,3.4,h,1.2); c.fillStyle=C(shade(lc,(q-0.5)*0.3)); c.fill(); outline(c,0.7);
      circ(c,x+sway*q*0.4,y+h-1.6,0.7); c.fillStyle=C(ar.trim||'#d8a84f'); c.fill(); }
  }
}

function drawCape(c,R,look,t,st){
  const B=R.B; if(look.civ || B.c<0.22) return;
  const D=R.D,L=D.torso,pt=R.pt, len=D.leg*(0.38+B.c*0.62);
  const A=pt(L*0.98,D.shW*0.35), K=pt(L*0.97,-D.shW*0.95);
  const wv=Math.sin(t/520+(st.seed||0))*2.2, mv=(st.kind==='attack'||st.wa)?-4:0;
  const hemY=R.P.y+len, bx=K.x-4-B.c*7+mv, col=shade(look.cloth,-0.2);
  c.beginPath(); c.moveTo(A.x,A.y); c.quadraticCurveTo(K.x+1,K.y-2.5,K.x-1.5,K.y+1);
  c.quadraticCurveTo(bx-2+wv*0.5,lerp(K.y,hemY,0.5),bx-3+wv,hemY);
  c.quadraticCurveTo(lerp(bx,A.x,0.5)+wv*0.6,hemY+3,A.x+2,hemY-2); c.closePath();
  c.fillStyle=lg(c,bx,K.y,A.x,K.y,[[0,C(shade(col,-0.3))],[0.6,C(col)],[1,C(shade(col,0.12))]]); c.fill(); outline(c);
  c.strokeStyle=C(shade(col,-0.45)); c.lineWidth=0.8; c.beginPath();
  for(let i=1;i<3;i++){ const x=lerp(K.x,bx,i*0.35); c.moveTo(lerp(K.x,A.x,i*0.3),K.y+3); c.quadraticCurveTo(x+wv*0.4,lerp(K.y,hemY,0.6),x-1+wv*0.8,hemY+i*0.6); } c.stroke();
  if(B.c>0.5){ c.strokeStyle=C('#e2b44a'); c.lineWidth=1.3; c.beginPath(); c.moveTo(bx-3+wv,hemY); c.quadraticCurveTo(lerp(bx,A.x,0.5)+wv*0.6,hemY+3,A.x+2,hemY-2); c.stroke(); }
}

// ---------- BAŞ ----------
function headPath(c,r,j){
  c.beginPath(); c.moveTo(-r*0.55,r*0.78*j);
  c.bezierCurveTo(-r*1.08,r*0.35,-r*1.05,-r*0.75,-r*0.2,-r*1.0);
  c.bezierCurveTo(r*0.45,-r*1.12,r*0.92,-r*0.72,r*0.9,-r*0.3);
  c.lineTo(r*0.97,-r*0.12); c.quadraticCurveTo(r*1.22,r*0.13,r*1.08,r*0.25); c.lineTo(r*0.93,r*0.31);
  c.quadraticCurveTo(r*1.0,r*0.42,r*0.95,r*0.53); c.quadraticCurveTo(r*0.99,r*0.68*j,r*0.86,r*0.84*j);
  c.quadraticCurveTo(r*0.68,r*1.0*j,r*0.3,r*0.94*j); c.quadraticCurveTo(-r*0.1,r*0.9*j,-r*0.2,r*0.7*j); c.closePath();
}
function drawHead(c,R,look,st,t){
  const D=R.D,B=R.B,r=D.head, j=1+B.m*0.08+B.v*0.05;
  limbFill(c, capsule(c,R.N.x,R.N.y,R.Hc.x-r*0.2,R.Hc.y+r*0.5,D.neck,D.neck*0.92), shade(look.skin,-0.08));
  c.save(); c.translate(R.Hc.x,R.Hc.y); c.rotate(R.tilt);
  const helm = look.helmet && look.helmet.t!=='none' ? look.helmet : null, hc=look.hairCol;
  if(look.hair==='long'){ const sw=Math.sin(t/600+(st.seed||0))*1.2;
    c.beginPath(); c.moveTo(-r*0.3,-r*0.9); c.quadraticCurveTo(-r*1.5,-r*0.2,-r*1.25+sw,r*1.9); c.quadraticCurveTo(-r*0.6,r*1.7,-r*0.25,r*0.9); c.closePath();
    c.fillStyle=C(shade(hc,-0.12)); c.fill(); outline(c); }
  headPath(c,r,j);
  c.fillStyle=lg(c,LX*r,-r,-LX*r,r,[[0,C(shade(look.skin,0.2))],[0.5,C(look.skin)],[1,C(shade(look.skin,-0.28))]]); c.fill(); outline(c);
  // yanak gölgesi ve kulak
  c.fillStyle=rgba(C(shade(look.skin,-0.4)),0.22); ell(c,r*0.35,r*0.5,r*0.4,r*0.25); c.fill();
  ell(c,-r*0.12,r*0.06,r*0.2,r*0.28); c.fillStyle=C(shade(look.skin,-0.08)); c.fill(); outline(c,0.8);
  c.strokeStyle=C(shade(look.skin,-0.4)); c.lineWidth=0.6; c.beginPath(); c.arc(-r*0.1,r*0.06,r*0.11,-1.2,1.4); c.stroke();
  // sakal
  if(look.beard!=='none'){
    c.beginPath(); c.moveTo(-r*0.3,r*0.18); c.lineTo(-r*0.05,r*0.14); c.quadraticCurveTo(r*0.25,r*0.56,r*0.62,r*0.62);
    c.lineTo(r*0.96,r*0.62); c.quadraticCurveTo(r*1.02,r*0.98*j,r*0.6,r*1.12*j); c.quadraticCurveTo(r*0.02,r*1.12*j,-r*0.36,r*0.62); c.closePath();
    if(look.beard==='full'){ c.fillStyle=C(hc); c.fill(); outline(c,0.8);
      c.beginPath(); c.moveTo(r*0.66,r*0.45); c.quadraticCurveTo(r*0.86,r*0.31,r*1.01,r*0.4); c.quadraticCurveTo(r*0.9,r*0.52,r*0.66,r*0.5); c.closePath(); c.fill(); }
    else { c.fillStyle=rgba(C(hc),0.32); c.fill(); }
  }
  // savaş boyası
  if(!look.civ && B.k>0.42){ c.strokeStyle=rgba('#8c1a12',clamp((B.k-0.42)*2.4,0,0.8)); c.lineWidth=r*0.2; c.beginPath(); c.moveTo(r*0.22,-r*0.06); c.lineTo(r*1.0,-r*0.1); c.stroke();
    if(B.k>0.7){ c.lineWidth=r*0.1; c.beginPath(); c.moveTo(r*0.35,r*0.25); c.lineTo(r*0.6,r*0.5); c.moveTo(r*0.5,r*0.2); c.lineTo(r*0.75,r*0.45); c.stroke(); } }
  // göz, kaş, ağız
  const dead=st.dead>0.5, closed=dead||R.eye||st.kind==='rest';
  if(closed){ line(c,r*0.44,-r*0.05,r*0.74,-r*0.05,C(shade(look.skin,-0.6)),0.9); }
  else { c.beginPath(); c.moveTo(r*0.42,-r*0.06); c.quadraticCurveTo(r*0.58,-r*0.21,r*0.75,-r*0.07); c.quadraticCurveTo(r*0.58,r*0.04,r*0.42,-r*0.06);
    c.fillStyle=C('#f4ece0'); c.fill(); circ(c,r*0.66,-r*0.075,r*0.08); c.fillStyle=C('#22150e'); c.fill();
    line(c,r*0.4,-r*0.08,r*0.77,-r*0.1,C(shade(look.skin,-0.62)),0.9); }
  const fierce=clamp(B.k*0.7+(st.anger?0.5:0),0,1);
  c.strokeStyle=C(shade(hc,-0.15)); c.lineWidth=1.3+B.m*0.6; c.beginPath(); c.moveTo(r*0.34,-r*0.31+fierce*r*0.02); c.quadraticCurveTo(r*0.6,-r*0.38,r*0.86,-r*0.24+fierce*r*0.1); c.stroke();
  const smile=B.c*0.12*r - (st.kind==='hit'?r*0.08:0);
  c.strokeStyle=C(shade(look.skin,-0.55)); c.lineWidth=0.8; c.beginPath(); c.moveTo(r*0.66,r*0.55-smile); c.quadraticCurveTo(r*0.8,r*0.58,r*0.93,r*0.54); c.stroke();
  c.beginPath(); c.arc(r*0.96,r*0.24,r*0.07,0.5,2.6); c.stroke();
  // saç
  if(!helm || helm.t==='cap'){
    if(look.hair!=='bald'){
      c.beginPath(); c.moveTo(r*0.8,-r*0.5); c.bezierCurveTo(r*0.6,-r*1.16,-r*0.62,-r*1.26,-r*1.03,-r*0.35);
      c.quadraticCurveTo(-r*1.06,r*0.25,-r*0.62,r*0.62); c.lineTo(-r*0.36,r*0.28); c.quadraticCurveTo(-r*0.3,-r*0.22,r*0.05,-r*0.37); c.quadraticCurveTo(r*0.46,-r*0.42,r*0.8,-r*0.5); c.closePath();
      c.fillStyle=lg(c,0,-r*1.2,0,r*0.5,[[0,C(shade(hc,0.18))],[1,C(shade(hc,-0.2))]]); c.fill(); outline(c,0.9);
      c.strokeStyle=C(shade(hc,0.3)); c.lineWidth=0.5; c.beginPath(); for(let i=0;i<4;i++){ c.moveTo(r*(0.5-i*0.35),-r*(0.95-i*0.05)); c.quadraticCurveTo(r*(0.2-i*0.35),-r*0.8,r*(0.05-i*0.3),-r*(0.5-i*0.02)); } c.stroke();
      if(look.hair==='bun'){ circ(c,-r*0.82,-r*0.7,r*0.34); c.fillStyle=C(hc); c.fill(); outline(c,0.9); line(c,-r*0.58,-r*0.86,-r*0.6,-r*0.5,C('#c9a04a'),1); }
    } else { c.strokeStyle='rgba(255,245,225,0.4)'; c.lineWidth=1.2; c.beginPath(); c.arc(-r*0.05,-r*0.35,r*0.6,-2.4,-1.4); c.stroke(); }
  }
  if(!look.civ && B.c>0.72 && !helm){ // defne tacı
    c.fillStyle=C('#6f8f3a'); for(let i=0;i<7;i++){ const a=-2.8+i*0.42; ell(c,Math.cos(a)*r*0.95,Math.sin(a)*r*0.95-r*0.1,r*0.22,r*0.1,a+1.2); c.fill(); }
  }
  if(helm) drawHelmet(c, helm, r, look, t, st);
  c.restore();
}
