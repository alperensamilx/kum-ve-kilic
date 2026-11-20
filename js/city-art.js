"use strict";
// ---------- ŞEHİR: sabit çizimler (bir kez çizilip önbelleğe alınır) ----------
// Mantıksal boyut 400 x 600. Güneş kadraj dışında sol önde: cepheler sıcak ışık alır.
const STREET = 468;

function masonry(c,x,y,w,h,base,R,bh=7){
  c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip(); c.fillStyle=base; c.fillRect(x,y,w,h);
  for(let yy=y,row=0; yy<y+h; yy+=bh,row++){
    let xx=x-(row%2)*bh*0.9-R()*4;
    while(xx<x+w){ const bw=bh*(1.3+R()*1.2);
      c.fillStyle=shade(base,(R()-0.5)*0.2); c.fillRect(xx+0.5,yy+0.5,bw-1,bh-1);
      c.fillStyle='rgba(255,240,210,0.2)'; c.fillRect(xx+0.5,yy+0.5,bw-1,0.8);
      c.fillStyle='rgba(50,25,30,0.22)'; c.fillRect(xx+0.5,yy+bh-1.3,bw-1,0.8); xx+=bw; }
  }
  c.restore();
}
function plaster(c,x,y,w,h,base,R){
  c.fillStyle=base; c.fillRect(x,y,w,h);
  speckle(c,x,y,w,h,w*h*0.05,[shade(base,-0.12),shade(base,0.1)],R,0.6,2.2,0.35);
  c.fillStyle=lg(c,x,y,x,y+h,[[0,'rgba(80,50,40,0.18)'],[0.25,'rgba(0,0,0,0)'],[1,'rgba(90,60,40,0.12)']]); c.fillRect(x,y,w,h);
}
// Soldan gelen ışık: sağa doğru hafif koyulaşma
function lightWash(c,x,y,w,h){ c.fillStyle=lg(c,x,0,x+w,0,[[0,'rgba(255,220,160,0.16)'],[0.6,'rgba(0,0,0,0)'],[1,'rgba(40,20,40,0.22)']]); c.fillRect(x,y,w,h); }
function roofTrap(c,x0,x1,yE,depth,base){
  c.beginPath(); c.moveTo(x0-4,yE); c.lineTo(x1+4,yE); c.lineTo(x1-5,yE-depth); c.lineTo(x0+5,yE-depth); c.closePath();
  c.fillStyle=lg(c,0,yE-depth,0,yE,[[0,shade(base,-0.25)],[0.6,base],[1,shade(base,0.12)]]); c.fill();
  c.save(); c.clip(); c.lineWidth=0.6;
  for(let y=yE-depth+3;y<yE;y+=3.2){ c.strokeStyle='rgba(60,20,10,0.35)'; c.beginPath(); c.moveTo(x0-5,y); c.lineTo(x1+5,y); c.stroke(); }
  for(let x=x0;x<x1+5;x+=5){ c.strokeStyle='rgba(255,215,180,0.22)'; c.beginPath(); c.moveTo(x,yE); c.lineTo(lerp(x,(x0+x1)/2,0.08),yE-depth); c.stroke(); }
  c.restore();
  for(let x=x0-1.5;x<x1+4;x+=5){ c.beginPath(); c.arc(x,yE,2.5,0,Math.PI); c.fillStyle=shade(base,-0.12); c.fill(); c.strokeStyle='rgba(50,15,10,0.55)'; c.lineWidth=0.5; c.stroke(); }
  c.fillStyle='rgba(40,15,20,0.35)'; c.fillRect(x0-4,yE+2.4,x1-x0+8,3);
}
function archPath(c,x,y,w,h){ const r=w/2; c.beginPath(); c.moveTo(x,y+h); c.lineTo(x,y+r); c.arc(x+r,y+r,r,Math.PI,0); c.lineTo(x+w,y+h); c.closePath(); }
function voussoirs(c,x,y,w,base){
  const r=w/2, cx=x+r, cy=y+r;
  for(let i=0;i<9;i++){ const a0=Math.PI+i*Math.PI/9, a1=a0+Math.PI/9;
    c.beginPath(); c.arc(cx,cy,r+6,a0,a1); c.arc(cx,cy,r,a1,a0,true); c.closePath();
    c.fillStyle=shade(base,i===4?0.2:(i%2?-0.06:0.06)); c.fill(); c.strokeStyle='rgba(40,20,20,0.4)'; c.lineWidth=0.5; c.stroke(); }
}
function cypress(c,x,y,h,R){
  const w=h*0.16; c.beginPath(); c.moveTo(x,y-h); c.quadraticCurveTo(x+w*1.4,y-h*0.5,x+w*0.6,y); c.lineTo(x-w*0.6,y); c.quadraticCurveTo(x-w*1.4,y-h*0.5,x,y-h); c.closePath();
  c.fillStyle=lg(c,x-w,0,x+w,0,[[0,'#4f7a45'],[0.5,'#2f5233'],[1,'#1d3324']]); c.fill();
  c.strokeStyle='rgba(15,30,20,0.45)'; c.lineWidth=0.6; c.beginPath(); for(let i=1;i<6;i++){ const yy=y-h+i*h/6; c.moveTo(x-w*0.5,yy); c.quadraticCurveTo(x,yy+2,x+w*0.6,yy-1); } c.stroke();
}
function palm(c,x,y,h){
  c.strokeStyle='#6a4a30'; c.lineWidth=2.4; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+3,y-h*0.5,x+1,y-h); c.stroke();
  for(let i=0;i<7;i++){ const a=-Math.PI*0.95+i*Math.PI*0.32; c.strokeStyle=i%2?'#3e6a34':'#2c5028'; c.lineWidth=1.8;
    c.beginPath(); c.moveTo(x+1,y-h); c.quadraticCurveTo(x+1+Math.cos(a)*10,y-h+Math.sin(a)*6-4,x+1+Math.cos(a)*17,y-h+Math.sin(a)*8+5); c.stroke(); }
}
function windowSh(c,x,y,w,h){
  c.fillStyle='#3a2420'; c.fillRect(x,y,w,h); c.fillStyle='rgba(255,190,110,0.16)'; c.fillRect(x+2,y+2,w-4,h-4);
  for(const sx of [x-w*0.42, x+w]){ c.fillStyle='#6f4a2e'; c.fillRect(sx,y,w*0.42,h); c.strokeStyle='#3d2616'; c.lineWidth=0.6; c.beginPath(); for(let yy=y+2;yy<y+h;yy+=2.6){ c.moveTo(sx+1,yy); c.lineTo(sx+w*0.42-1,yy); } c.stroke(); }
  c.fillStyle='#cdb492'; c.fillRect(x-w*0.5,y+h,w*2,2.2); c.fillStyle='rgba(40,20,20,0.35)'; c.fillRect(x-w*0.5,y+h+2.2,w*2,1.2);
}
function column(c,x,y,w,h,col){
  c.fillStyle=lg(c,x,0,x+w,0,[[0,shade(col,0.25)],[0.45,col],[1,shade(col,-0.35)]]); c.fillRect(x,y+3,w,h-6);
  c.strokeStyle='rgba(60,40,40,0.35)'; c.lineWidth=0.5; c.beginPath(); for(let i=1;i<4;i++){ c.moveTo(x+i*w/4,y+4); c.lineTo(x+i*w/4,y+h-4); } c.stroke();
  c.fillStyle=shade(col,0.1); c.fillRect(x-2,y,w+4,3.5); c.fillRect(x-2,y+h-3.5,w+4,3.5);
}

function citySky(c,W){
  c.fillStyle=lg(c,0,0,0,275,[[0,'#1d2a52'],[0.32,'#3e4d7c'],[0.62,'#a7808a'],[0.82,'#e6ad7c'],[1,'#f5d39c']]); c.fillRect(0,0,W,300);
  c.fillStyle=rg(c,-40,165,300,[[0,'rgba(255,214,150,0.8)'],[0.35,'rgba(255,186,120,0.3)'],[1,'rgba(255,170,120,0)']]); c.fillRect(0,0,W,300);
  const R=rng(3);
  for(const [x,y,w,h] of [[30,62,150,11],[220,40,180,10],[110,118,220,13],[285,150,130,9],[0,172,150,8]]){
    for(let i=0;i<8;i++){ const cx=x+R()*w, cy=y+R()*h*0.5, rx=w*(0.1+R()*0.14), ry=h*(0.45+R()*0.5);
      ell(c,cx,cy,rx,ry); c.fillStyle=lg(c,0,cy-ry,0,cy+ry,[[0,'rgba(120,115,165,0.5)'],[0.6,'rgba(220,160,150,0.5)'],[1,'rgba(255,210,165,0.7)']]); c.fill(); }
  }
}
function ridge(c,y,amp,col,seed,f){
  const R=rng(seed); c.beginPath(); c.moveTo(0,320);
  for(let x=0;x<=400;x+=8) c.lineTo(x, y-amp*(0.5+0.5*Math.sin(x*f+seed))-R()*amp*0.25);
  c.lineTo(400,320); c.closePath(); c.fillStyle=col; c.fill();
}
function templeHill(c,R){
  c.beginPath(); c.moveTo(-10,320); c.quadraticCurveTo(62,196,176,320); c.closePath();
  c.fillStyle=lg(c,0,200,0,320,[[0,'#8d7f5e'],[1,'#5c5a3e']]); c.fill();
  c.fillStyle='rgba(60,70,40,0.6)'; for(let i=0;i<14;i++){ const x=10+R()*150, y=232+R()*60; if(y>320-((x-62)**2)/140) continue; ell(c,x,y,4+R()*3,3); c.fill(); }
  const x0=36, y0=207, w=74;
  c.fillStyle='#e9d3ad'; c.fillRect(x0-4,y0,w+8,3); c.fillStyle='#cbb08a'; c.fillRect(x0-7,y0+3,w+14,3); c.fillStyle='#b39874'; c.fillRect(x0-10,y0+6,w+20,3);
  c.fillStyle='#4d3a48'; c.fillRect(x0+2,y0-24,w-4,24);
  for(let i=0;i<7;i++){ const cx=x0+2+i*(w-8)/6; c.fillStyle=lg(c,cx,0,cx+5,0,[[0,'#fff0d2'],[1,'#c9ad8a']]); c.fillRect(cx,y0-24,5,24); }
  c.fillStyle='#eedbb8'; c.fillRect(x0-3,y0-30,w+6,6); c.fillStyle='#c9ad8a'; c.fillRect(x0-3,y0-25,w+6,1.2);
  c.beginPath(); c.moveTo(x0-5,y0-30); c.lineTo(x0+w/2,y0-44); c.lineTo(x0+w+5,y0-30); c.closePath(); c.fillStyle=lg(c,x0,0,x0+w,0,[[0,'#f6e4c2'],[1,'#c2a47f']]); c.fill();
  c.beginPath(); c.moveTo(x0+4,y0-31.5); c.lineTo(x0+w/2,y0-40.5); c.lineTo(x0+w-4,y0-31.5); c.closePath(); c.fillStyle='#b89c78'; c.fill();
  for(const [x,y,h] of [[14,252,34],[150,258,30],[166,266,26],[104,244,22]]) cypress(c,x,y,h,R);
}
function aqueduct(c){
  const y0=238, y1=268;
  c.fillStyle='#b09484'; c.fillRect(250,y0,160,y1-y0);
  c.fillStyle='#8c7470'; for(let x=256;x<410;x+=17){ archPath(c,x,y0+9,11,y1-y0-8); c.fill(); }
  c.fillStyle='#c4a896'; c.fillRect(248,y0-3,162,4); c.fillStyle='rgba(60,40,50,0.25)'; c.fillRect(248,y0+1,162,1.5);
}

function colosseum(c,R){
  const cx=212, top=172, base=284, rx=126, ry=30, tiers=3, th=(base-top-12)/tiers;
  // iç açıklık ve karşı tribünler
  ell(c,cx,top,rx,ry); c.fillStyle=lg(c,0,top-ry,0,top+ry,[[0,'#8a6458'],[0.45,'#4a3236'],[1,'#2b1d24']]); c.fill();
  for(let i=1;i<6;i++){ c.beginPath(); c.ellipse(cx,top+i*2.6,rx*(1-i*0.07),ry*(1-i*0.13),0,Math.PI,TAU); c.strokeStyle=`rgba(255,215,170,${0.28-i*0.03})`; c.lineWidth=0.9; c.stroke(); }
  for(let i=0;i<160;i++){ const a=Math.PI+R()*Math.PI, k=0.5+R()*0.45; c.fillStyle=pk(R,['#c8553f','#e8d2a8','#4a6a9a','#d9a441','#7a4a6a']); c.globalAlpha=0.55; c.fillRect(cx+Math.cos(a)*rx*k, top+Math.sin(a)*ry*k+2, 1.3, 1.3); }
  c.globalAlpha=1;
  // dış cephe
  c.beginPath(); c.ellipse(cx,top,rx,ry,0,0,Math.PI); c.lineTo(cx-rx,base); c.ellipse(cx,base,rx,ry,0,Math.PI,0,true); c.closePath();
  c.fillStyle=lg(c,cx-rx,0,cx+rx,0,[[0,'#f6dfb6'],[0.35,'#e2c39a'],[0.75,'#bf9c80'],[1,'#8f7270']]); c.fill();
  const yAt=(a,y)=>y+ry*Math.sin(a);
  // üst kat (attika): küçük pencereler
  for(let j=0;j<22;j++){ const a0=Math.PI-j*Math.PI/22, a1=a0-Math.PI/22, am=(a0+a1)/2;
    const x0=cx+rx*Math.cos(a0), x1=cx+rx*Math.cos(a1), wdt=Math.abs(x1-x0); if(wdt<1.2) continue;
    c.fillStyle='#5a3a3a'; c.fillRect(Math.min(x0,x1)+wdt*0.3, yAt(am,top)+3, wdt*0.4, 4); }
  for(let t=0;t<tiers;t++){
    const ty=top+12+t*th;
    c.strokeStyle='rgba(255,240,210,0.55)'; c.lineWidth=1.1; c.beginPath(); c.ellipse(cx,ty,rx,ry,0,0,Math.PI); c.stroke();
    c.strokeStyle='rgba(70,40,40,0.4)'; c.lineWidth=0.8; c.beginPath(); c.ellipse(cx,ty+1.4,rx,ry,0,0.02,Math.PI-0.02); c.stroke();
    const N=16;
    for(let j=0;j<N;j++){ const a0=Math.PI-j*Math.PI/N, a1=a0-Math.PI/N, am=(a0+a1)/2;
      const x0=cx+rx*Math.cos(a0), x1=cx+rx*Math.cos(a1), wdt=x1-x0; if(wdt<2) continue;
      const ax=x0+wdt*0.18, aw=wdt*0.64, ay=yAt(am,ty)+th*0.2, ah=th*0.72;
      archPath(c,ax,ay,aw,ah); c.fillStyle=lg(c,0,ay,0,ay+ah,[[0,'#3b2228'],[1,'#6a4038']]); c.fill();
      c.fillStyle='rgba(255,236,200,0.35)'; c.fillRect(x0+wdt*0.05,yAt(am,ty)+2,wdt*0.08,th-4);
    }
  }
  // ana kapı
  archPath(c,cx-11,base+ry-34,22,30); c.fillStyle='#24141a'; c.fill(); voussoirs(c,cx-11,base+ry-34,22,'#e7cda4');
  c.fillStyle='rgba(40,20,30,0.3)'; c.beginPath(); c.ellipse(cx,base,rx,ry,0,0.05,Math.PI-0.05); c.lineTo(cx-rx,base+6); c.ellipse(cx,base+6,rx,ry,0,Math.PI,0,true); c.fill();
  // tente direkleri
  c.strokeStyle='#6a4a3a'; c.lineWidth=1;
  for(let j=0;j<=12;j++){ const a=Math.PI-j*Math.PI/12, x=cx+rx*Math.cos(a), y=yAt(a,top); c.beginPath(); c.moveTo(x,y); c.lineTo(x,y-11); c.stroke(); }
}

function backHouses(c,R){
  const cols=['#ead7b4','#e2c49a','#d8b38a','#efe0c2','#cfa98a'];
  const H=[]; for(let i=0;i<16;i++) H.push({x:-10+R()*410, w:22+R()*26, h:18+R()*34, b:296+R()*30});
  H.sort((a,b)=>a.b-b.b);
  for(const h of H){
    const col=pk(R,cols), top=h.b-h.h;
    c.fillStyle=lg(c,h.x,0,h.x+h.w,0,[[0,shade(col,0.08)],[1,shade(col,-0.2)]]); c.fillRect(h.x,top,h.w,h.h);
    if(R()<0.6){ roofTrap(c,h.x,h.x+h.w,top,6+R()*4,pk(R,['#b5553a','#a84c34','#c0643f'])); }
    else { c.fillStyle=shade(col,0.15); c.fillRect(h.x-1,top-2,h.w+2,2.5); }
    c.fillStyle='#3b2624'; const n=Math.floor(h.w/10);
    for(let k=0;k<n;k++){ const wx=h.x+5+k*(h.w-8)/Math.max(1,n); c.fillRect(wx,top+5,3.4,5); if(h.h>30) c.fillRect(wx,top+17,3.4,5); }
    c.fillStyle='rgba(40,20,30,0.25)'; c.fillRect(h.x+h.w-2,top,2,h.h);
  }
  for(let i=0;i<7;i++) cypress(c,R()*400,305+R()*18,20+R()*16,R);
  palm(c,132,318,34); palm(c,270,314,30);
}

function cityStreet(c,W,H){
  const R=rng(11);
  c.fillStyle=lg(c,0,STREET,0,H,[[0,'#a88a68'],[0.25,'#c9aa82'],[1,'#d8bc93']]); c.fillRect(0,STREET-3,W,H-STREET+3);
  let y=STREET+1, rh=5.5, row=0;
  while(y<H){
    let x=-R()*rh*2-(row%2)*rh;
    while(x<W){ const sw=rh*(1.6+R()*1.1);
      rr(c,x+0.6,y+0.6,sw-1.2,rh-1.2,Math.min(2,rh*0.3)); c.fillStyle=shade('#c7a77f',(R()-0.45)*0.25); c.fill();
      c.fillStyle='rgba(255,240,210,0.22)'; c.fillRect(x+1.4,y+0.8,sw-3,0.8); x+=sw; }
    y+=rh; rh*=1.09; row++;
  }
  c.fillStyle=lg(c,0,STREET-3,0,STREET+16,[[0,'rgba(40,20,20,0.55)'],[1,'rgba(40,20,20,0)']]); c.fillRect(0,STREET-3,W,19);
  c.fillStyle=rg(c,200,640,260,[[0,'rgba(255,225,170,0.25)'],[1,'rgba(255,225,170,0)']]); c.fillRect(0,STREET,W,H-STREET);
}
