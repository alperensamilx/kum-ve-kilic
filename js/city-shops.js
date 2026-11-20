"use strict";
// ---------- ŞEHİR: dükkân cepheleri ve ön plan ----------
const pk = (R,a) => a[(R()*a.length)|0];

function smithShop(c,R){
  const x=4, w=124, top=318, b=STREET;
  masonry(c,14,250,20,72,'#8f5a44',R,5); c.fillStyle='#5a382c'; c.fillRect(11,246,26,5); c.fillStyle='#2a1714'; c.fillRect(16,244,16,3);
  roofTrap(c,x,x+w,top,18,'#a24a33');
  masonry(c,x,top,w,b-top,'#a08d79',R,7); lightWash(c,x,top,w,b-top);
  const ox=28, ow=74, oy=384;
  archPath(c,ox,oy,ow,b-oy); c.fillStyle=lg(c,0,oy,0,b,[[0,'#160b08'],[0.6,'#2a130c'],[1,'#3c1a0e']]); c.fill();
  c.save(); archPath(c,ox,oy,ow,b-oy); c.clip();
  // ocak
  c.fillStyle='#4a2a20'; c.fillRect(ox+18,b-30,38,30); c.fillStyle='#2a1410'; c.fillRect(ox+22,b-24,30,12);
  c.fillStyle=rg(c,ox+37,b-18,22,[[0,'#ffd27a'],[0.35,'#ff7a2a'],[1,'rgba(120,30,10,0)']]); c.fillRect(ox+10,b-40,54,40);
  c.strokeStyle='rgba(255,150,80,0.55)'; c.lineWidth=1.2; c.beginPath();
  for(const [tx,ty,l] of [[ox+8,oy+44,14],[ox+13,oy+42,18],[ox+64,oy+44,12]]){ c.moveTo(tx,ty); c.lineTo(tx,ty+l); }
  c.stroke(); c.fillStyle='rgba(255,150,80,0.5)'; c.fillRect(ox+5,oy+56,7,4); c.fillRect(ox+60,oy+55,6,5);
  c.restore();
  voussoirs(c,ox,oy,ow,'#b3a08a');
  c.strokeStyle='#5d5048'; c.lineWidth=2; c.beginPath(); c.arc(ox+ow/2,oy-9,4,0.2,Math.PI-0.2); c.stroke();
  // fıçı
  const bx=7, by=b; c.fillStyle=lg(c,bx,0,bx+16,0,[[0,'#9a6a3e'],[1,'#4e321c']]); rr(c,bx,by-20,16,20,3); c.fill();
  c.fillStyle='#3a3a3e'; c.fillRect(bx,by-16,16,1.6); c.fillRect(bx,by-6,16,1.6); ell(c,bx+8,by-20,8,2.2); c.fillStyle='#3f6f88'; c.fill(); ell(c,bx+6,by-20.5,3,0.7); c.fillStyle='rgba(255,255,255,0.5)'; c.fill();
  // örs ve kütük
  const ax=108; c.fillStyle=lg(c,ax-8,0,ax+8,0,[[0,'#8a6440'],[1,'#4a301c']]); rr(c,ax-7,b-12,14,12,2); c.fill();
  c.beginPath(); c.moveTo(ax-12,b-18); c.lineTo(ax+6,b-18); c.quadraticCurveTo(ax+14,b-18,ax+17,b-16); c.lineTo(ax+6,b-15); c.lineTo(ax+4,b-12); c.lineTo(ax-4,b-12); c.lineTo(ax-6,b-15); c.lineTo(ax-12,b-15); c.closePath();
  c.fillStyle=lg(c,0,b-19,0,b-12,[[0,'#9aa2aa'],[0.3,'#4e555c'],[1,'#25292d']]); c.fill(); c.strokeStyle='#15171a'; c.lineWidth=0.6; c.stroke();
  // yaslanmış mızrak ve kılıçlar
  c.strokeStyle='#6e4a2c'; c.lineWidth=1.4; c.beginPath(); c.moveTo(118,b-1); c.lineTo(124,b-62); c.moveTo(25,b-1); c.lineTo(28,b-48); c.stroke();
  c.fillStyle='#c9d0d6'; poly(c,[124,b-62,122.5,b-70,125.5,b-62]); c.fill(); poly(c,[28,b-48,26.6,b-55,29.4,b-48]); c.fill();
}

function armorShop(c,R){
  const x=138, w=126, top=290, mid=374, b=STREET;
  roofTrap(c,x,x+w,top,20,'#b8553a');
  plaster(c,x,top,w,mid-top,'#ecd9b6',R); lightWash(c,x,top,w,mid-top);
  windowSh(c,x+18,top+16,18,26); windowSh(c,x+w-36,top+16,18,26);
  for(const px of [x+14,x+w-40]){ c.fillStyle='#9a5a3a'; rr(c,px,top+44,26,6,1.5); c.fill(); c.fillStyle='#4f7a3a'; for(let i=0;i<5;i++){ circ(c,px+3+i*5,top+43,3); c.fill(); } c.fillStyle='#d8455a'; circ(c,px+8,top+41,1.3); c.fill(); circ(c,px+18,top+41.5,1.3); c.fill(); }
  c.fillStyle='#d9c3a0'; c.fillRect(x-3,mid-7,w+6,7); c.fillStyle='#f4e4c4'; c.fillRect(x-3,mid-7,w+6,1.6); c.fillStyle='rgba(50,30,30,0.35)'; c.fillRect(x-3,mid,w+6,2);
  masonry(c,x,mid,w,b-mid,'#dcc6a2',R,9); lightWash(c,x,mid,w,b-mid);
  const ox=x+26, ow=w-52, oy=mid+16;
  c.fillStyle=lg(c,0,oy,0,b,[[0,'#1d1210'],[1,'#3a241a']]); c.fillRect(ox,oy,ow,b-oy);
  c.fillStyle='#5a3a24'; for(const sy of [oy+22,oy+46]) c.fillRect(ox+3,sy,ow-6,2.4);
  const hg=ITEMS.helmet.list;
  [[ox+14,oy+20,2],[ox+31,oy+20,3],[ox+48,oy+20,1],[ox+20,oy+44,4],[ox+40,oy+44,2]].forEach(([hx,hy,i])=>{ c.save(); c.translate(hx,hy-5); drawHelmet(c,hg[i].g,5.2,{},0); c.restore(); });
  column(c,ox-10,mid+8,7,b-mid-8,'#efdcbc'); column(c,ox+ow+3,mid+8,7,b-mid-8,'#efdcbc');
  // çizgili tente
  const ay=mid+3, ah=15;
  c.save(); c.beginPath(); c.moveTo(ox-14,ay); c.lineTo(ox+ow+14,ay); c.lineTo(ox+ow+18,ay+ah); c.lineTo(ox-18,ay+ah); c.closePath(); c.clip();
  for(let i=0;i<16;i++){ c.fillStyle=i%2?'#efe2c8':'#a8322a'; c.beginPath(); const sx=ox-20+i*8.2; c.moveTo(sx,ay); c.lineTo(sx+8.2,ay); c.lineTo(sx+9.6,ay+ah); c.lineTo(sx+1.4,ay+ah); c.fill(); }
  c.fillStyle=lg(c,0,ay,0,ay+ah,[[0,'rgba(255,255,255,0.15)'],[1,'rgba(40,10,10,0.35)']]); c.fillRect(ox-20,ay,ow+40,ah); c.restore();
  for(let i=0;i<10;i++){ const sx=ox-18+i*((ow+36)/10); c.beginPath(); c.arc(sx+(ow+36)/20,ay+ah,(ow+36)/20,0,Math.PI); c.fillStyle=i%2?'#efe2c8':'#a8322a'; c.fill(); }
  c.fillStyle='rgba(30,15,15,0.4)'; c.fillRect(ox,ay+ah+4,ow,6);
  // zırh mankeni
  const mx=x+13; c.fillStyle='#5a3a22'; c.fillRect(mx-1,b-30,2,30); c.fillRect(mx-6,b-2,12,2);
  drawArmorIcon(c,ITEMS.armor.list[4].g,{cloth:'#9e2b22'},mx,b-40,0.5); c.save(); c.translate(mx-1,b-55); drawHelmet(c,ITEMS.helmet.list[3].g,5.5,{},0); c.restore();
  // masa ve miğfer
  const tx=x+w-15; c.fillStyle='#6a4a2e'; c.fillRect(tx-9,b-15,18,3); c.fillRect(tx-8,b-12,2,12); c.fillRect(tx+6,b-12,2,12);
  c.save(); c.translate(tx,b-21); drawHelmet(c,ITEMS.helmet.list[4].g,5.5,{},0); c.restore();
}

function shieldShop(c,R){
  const x=274, w=122, top=312, mid=394, b=STREET;
  roofTrap(c,x,x+w,top,16,'#94502f');
  plaster(c,x,top,w,mid-top,'#e6d1aa',R); lightWash(c,x,top,w,mid-top);
  const beam=(x0,y0,x1,y1,wd=4)=>{ c.strokeStyle='#5a3a22'; c.lineWidth=wd; c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1,y1); c.stroke(); c.strokeStyle='rgba(255,220,170,0.18)'; c.lineWidth=0.8; c.beginPath(); c.moveTo(x0-wd*0.3,y0); c.lineTo(x1-wd*0.3,y1); c.stroke(); };
  beam(x,top+2,x+w,top+2,5); beam(x,mid-2,x+w,mid-2,5);
  for(const bx of [x+2,x+41,x+81,x+w-2]) beam(bx,top,bx,mid);
  beam(x+2,mid-4,x+41,top+4,3); beam(x+81,top+4,x+w-2,mid-4,3);
  const SH=[{t:'round',r:11,base:'#a8322a',dark:'#5a1610',rim:'#d8b45a',boss:'#e8c56c',emblem:true},
            {t:'round',r:12,base:'#2f5a8a',dark:'#14283f',rim:'#c9ced4',boss:'#e0e4e8'},
            {t:'round',r:11,base:'#c38c44',dark:'#7a5424',rim:'#ecc47c',boss:'#f4d18a',emblem:true}];
  drawShield(c,SH[0],x+21,top+42,null,true); drawShield(c,SH[1],x+61,top+40,null,true); drawShield(c,SH[2],x+101,top+42,null,true);
  masonry(c,x,mid,w,b-mid,'#a69482',R,7); lightWash(c,x,mid,w,b-mid);
  c.fillStyle='#5a3a22'; c.beginPath(); c.moveTo(x+36,mid+4); c.lineTo(x+86,mid+4); c.lineTo(x+92,mid+12); c.lineTo(x+30,mid+12); c.closePath(); c.fill();
  c.fillStyle='rgba(30,15,10,0.35)'; c.fillRect(x+34,mid+12,54,3);
  const dx=x+44, dw=34, dy=mid+16;
  archPath(c,dx-3,dy-3,dw+6,b-dy+3); c.fillStyle='#7d6d5e'; c.fill();
  archPath(c,dx,dy,dw,b-dy); c.fillStyle=lg(c,dx,0,dx+dw,0,[[0,'#8a5a32'],[1,'#5a3a1e']]); c.fill();
  c.save(); archPath(c,dx,dy,dw,b-dy); c.clip(); c.strokeStyle='rgba(40,20,10,0.6)'; c.lineWidth=0.7; c.beginPath(); for(let i=1;i<5;i++){ c.moveTo(dx+i*dw/5,dy); c.lineTo(dx+i*dw/5,b); } c.stroke();
  c.fillStyle='#3a3a3e'; c.fillRect(dx,dy+20,dw,2); c.fillRect(dx,dy+40,dw,2); c.restore();
  c.strokeStyle='#c9a24a'; c.lineWidth=1.1; c.beginPath(); c.arc(dx+dw-8,dy+32,2.4,0,TAU); c.stroke();
  const tw={t:'tower',w:16,h:30,base:'#9c2b23',dark:'#5a1610',rim:'#dcb75c',boss:'#e8c56c'};
  drawShield(c,tw,x+20,b-17,null,true); drawShield(c,{...tw,base:'#2e5a3a'},x+w-18,b-17,null,true);
  c.fillStyle='#6a4a2e'; c.fillRect(x+86,b-14,24,3); c.fillRect(x+88,b-11,2,11); c.fillRect(x+106,b-11,2,11);
  c.fillStyle='#a8322a'; c.fillRect(x+90,b-18,4,4); c.fillStyle='#2f5a8a'; c.fillRect(x+96,b-17,4,3); c.fillStyle='#e2b44a'; c.fillRect(x+102,b-18,4,4);
}

// Ön plan: çeşme ve antrenman alanı (yürüyenlerin önünde çizilir)
function fountainArt(c){
  const cx=80, cy=566, rx=56, ry=15, wall=11;
  c.fillStyle='rgba(30,15,10,0.28)'; ell(c,cx+14,cy+wall+4,rx+10,ry*0.8); c.fill();
  c.beginPath(); c.ellipse(cx,cy,rx,ry,0,0,Math.PI); c.lineTo(cx-rx,cy+wall); c.ellipse(cx,cy+wall,rx,ry,0,Math.PI,0,true); c.closePath();
  c.fillStyle=lg(c,cx-rx,0,cx+rx,0,[[0,'#efdcbc'],[0.5,'#d2b996'],[1,'#9c8272']]); c.fill(); c.strokeStyle='rgba(60,40,40,0.5)'; c.lineWidth=0.7; c.stroke();
  for(let i=1;i<9;i++){ const a=Math.PI-i*Math.PI/9, px=cx+rx*Math.cos(a); line(c,px,cy+ry*Math.sin(a),px,cy+wall+ry*Math.sin(a),'rgba(70,50,50,0.35)',0.6); }
  ell(c,cx,cy,rx,ry); c.strokeStyle='#f6e8cc'; c.lineWidth=2.2; c.stroke();
  ell(c,cx,cy,rx-3,ry-2.5); c.fillStyle=lg(c,0,cy-ry,0,cy+ry,[[0,'#2f5f74'],[0.6,'#4f8ea2'],[1,'#7cc0cc']]); c.fill();
  c.fillStyle=lg(c,cx-5,0,cx+5,0,[[0,'#f2e0bf'],[1,'#a88f78']]); c.fillRect(cx-4.5,cy-36,9,36);
  ell(c,cx,cy-36,15,4.4); c.fillStyle='#e8d4b2'; c.fill(); c.strokeStyle='rgba(60,40,40,0.5)'; c.lineWidth=0.6; c.stroke();
  ell(c,cx,cy-36.5,12.5,3.2); c.fillStyle='#4f8ea2'; c.fill();
  c.fillStyle=lg(c,cx-3,0,cx+3,0,[[0,'#f2e0bf'],[1,'#a88f78']]); c.fillRect(cx-2.6,cy-48,5.2,12); ell(c,cx,cy-50,4.2,5); c.fill();
}
function trainingArt(c){
  const x0=284, y0=528;
  c.fillStyle=rg(c,342,566,70,[[0,'rgba(170,130,90,0.55)'],[1,'rgba(170,130,90,0)']]); c.fillRect(270,500,140,100);
  c.strokeStyle='#5e3e24'; c.lineWidth=2.2; c.beginPath(); c.moveTo(x0,y0+2); c.lineTo(402,y0-2); c.moveTo(x0,y0+9); c.lineTo(402,y0+5); c.stroke();
  for(let px=x0;px<402;px+=20){ c.fillStyle='#6e4a2c'; c.fillRect(px-1.5,y0-6,3,20); c.fillStyle='rgba(255,220,170,0.25)'; c.fillRect(px-1.5,y0-6,1,20); }
  // ahşap kılıç askısı
  const rx=304, ry=574; c.fillStyle='#6e4a2c'; c.fillRect(rx-12,ry-26,3,26); c.fillRect(rx+10,ry-26,3,26); c.fillRect(rx-13,ry-24,27,3); c.fillRect(rx-13,ry-12,27,3);
  for(let i=0;i<4;i++){ const sx=rx-8+i*5.5; c.fillStyle='#b48a5a'; c.fillRect(sx,ry-34,2.4,22); c.fillStyle='#5a3a22'; c.fillRect(sx-1.4,ry-15,5.2,1.6); }
  c.fillStyle='rgba(30,15,10,0.3)'; ell(c,rx+6,ry+1,16,3); c.fill();
  // saman kukla (palus)
  const dx=356, dy=586;
  c.fillStyle='rgba(30,15,10,0.3)'; ell(c,dx+8,dy+1,16,3.4); c.fill();
  c.fillStyle=lg(c,dx-3,0,dx+3,0,[[0,'#8a6440'],[1,'#4e321c']]); c.fillRect(dx-2.5,dy-56,5,56);
  c.fillRect(dx-16,dy-44,32,3.4);
  c.beginPath(); c.moveTo(dx-10,dy-50); c.quadraticCurveTo(dx-13,dy-30,dx-8,dy-14); c.lineTo(dx+8,dy-14); c.quadraticCurveTo(dx+13,dy-30,dx+10,dy-50); c.closePath();
  c.fillStyle=lg(c,dx-12,0,dx+12,0,[[0,'#f0d68e'],[0.5,'#d4b062'],[1,'#94763a']]); c.fill(); c.strokeStyle='#6a5226'; c.lineWidth=0.7; c.stroke();
  c.strokeStyle='#8a2a20'; c.lineWidth=1.6; c.beginPath(); c.moveTo(dx-11,dy-40); c.lineTo(dx+11,dy-40); c.moveTo(dx-10,dy-24); c.lineTo(dx+10,dy-24); c.stroke();
  circ(c,dx,dy-58,7); c.fillStyle='#e2c47a'; c.fill(); c.strokeStyle='#6a5226'; c.lineWidth=0.7; c.stroke();
  c.strokeStyle='#a8322a'; c.lineWidth=1.2; circ(c,dx,dy-32,5); c.stroke(); circ(c,dx,dy-32,1.8); c.fillStyle='#a8322a'; c.fill();
  c.strokeStyle='#c9a35a'; c.lineWidth=0.5; c.beginPath(); for(let i=0;i<7;i++){ c.moveTo(dx-9+i*3,dy-14); c.lineTo(dx-10+i*3.2,dy-9); } c.stroke();
}
