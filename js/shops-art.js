"use strict";
// ---------- DÜKKAN İÇLERİ ----------
const KEEPERS = {
  smith: {civ:true,garb:'apron',skin:'#c48a5c',hair:'bald',hairCol:'#2a1b11',beard:'full',cloth:'#5e3d24',body:{m:0.75,v:0.6,a:0.1,k:0,d:0,c:0},
          weapon:{t:'hammer'},armor:{t:'none'},helmet:{t:'none'},shield:{t:'none'}, pose:'work'},
  armor: {civ:true,garb:'robe',fem:true,skin:'#e0b48a',hair:'bun',hairCol:'#3b2414',beard:'none',cloth:'#2b6a72',body:{m:0.1,v:0.15,a:0.3,k:0,d:0,c:0},
          weapon:{t:'file'},armor:{t:'none'},helmet:{t:'none'},shield:{t:'none'}, pose:'polish'},
  shield:{civ:true,garb:'tunic',skin:'#d9a47a',hair:'short',hairCol:'#d8d2c6',beard:'full',cloth:'#6e6434',body:{m:0.2,v:0.35,a:0.1,k:0,d:0,c:0},
          weapon:{t:'brush',col:'#b52e22'},armor:{t:'none'},helmet:{t:'none'},shield:{t:'none'}, pose:'paint'},
};
const SHOPV = {sc:null, kind:'smith', preview:null, parts:new Particles(), lastQ:0};

function shopBg(x,W,H,kind){
  const R=rng(kind.length*13+5);
  if(kind==='smith'){
    masonry(x,0,0,W,H,'#4c3c32',R,11);
    x.fillStyle=lg(x,0,0,0,H,[[0,'rgba(8,4,4,0.75)'],[0.6,'rgba(8,4,4,0.35)'],[1,'rgba(8,4,4,0.55)']]); x.fillRect(0,0,W,H);
    x.fillStyle='#3a2414'; x.fillRect(0,0,W,12); x.fillStyle='#2a170b'; for(let i=0;i<W;i+=48) x.fillRect(i,12,10,6);
    // ocak
    x.beginPath(); x.moveTo(18,0); x.lineTo(112,0); x.lineTo(124,70); x.lineTo(6,70); x.closePath(); x.fillStyle=lg(x,0,0,0,70,[[0,'#2a1d18'],[1,'#4a3628']]); x.fill();
    masonry(x,6,70,118,H*0.8-70,'#6a5444',R,8);
    archPath(x,30,104,70,H*0.8-104); x.fillStyle='#120806'; x.fill(); voussoirs(x,30,104,70,'#7a6250');
    x.fillStyle='#2a1410'; x.fillRect(36,H*0.8-24,58,24);
    // duvarda silahlar
    x.fillStyle='#4a2e18'; x.fillRect(190,34,104,4); x.fillRect(190,96,104,4);
    ITEMS.weapon.list.forEach((it,i)=>{ x.save(); x.translate(200+i*17,38); x.scale(0.56,0.56); drawWeapon(x,it.g,0,0,0,{},0); x.restore(); });
    x.strokeStyle='#2a2a2e'; x.lineWidth=2; x.beginPath(); x.moveTo(300,30); x.lineTo(300,70); x.moveTo(306,30); x.lineTo(310,70); x.stroke();
    x.fillStyle=lg(x,0,H*0.8,0,H,[[0,'#3a2a20'],[1,'#22160f']]); x.fillRect(0,H*0.8,W,H*0.2);
    // örs
    const ax=182, ay=H*0.8+6;
    x.fillStyle=lg(x,ax-10,0,ax+10,0,[[0,'#7a5434'],[1,'#3a2414']]); x.fillRect(ax-9,ay-26,18,26);
    x.beginPath(); x.moveTo(ax-20,ay-38); x.lineTo(ax+10,ay-38); x.quadraticCurveTo(ax+24,ay-38,ax+28,ay-34); x.lineTo(ax+10,ay-31); x.lineTo(ax+6,ay-26); x.lineTo(ax-7,ay-26); x.lineTo(ax-10,ay-31); x.lineTo(ax-20,ay-31); x.closePath();
    x.fillStyle=lg(x,0,ay-39,0,ay-26,[[0,'#b0b8c0'],[0.25,'#5a6168'],[1,'#22262a']]); x.fill(); x.strokeStyle='#121416'; x.lineWidth=0.8; x.stroke();
  } else if(kind==='armor'){
    plaster(x,0,0,W,H*0.8,'#b99c78',R);
    x.fillStyle=lg(x,0,0,W,0,[[0,'rgba(20,10,5,0.45)'],[0.7,'rgba(20,10,5,0.1)'],[1,'rgba(20,10,5,0.35)']]); x.fillRect(0,0,W,H*0.8);
    x.fillStyle='#3a2614'; x.fillRect(318,14,52,58); x.fillStyle=lg(x,0,14,0,72,[[0,'#ffe9c0'],[1,'#f0b878']]); x.fillRect(322,18,44,50); x.fillStyle='#3a2614'; x.fillRect(343,18,2,50); x.fillRect(322,42,44,2);
    for(const sy of [52,98]){ x.fillStyle='#5a3a20'; x.fillRect(20,sy,270,5); x.fillStyle='rgba(20,10,5,0.4)'; x.fillRect(20,sy+5,270,4); }
    const hl=ITEMS.helmet.list; [[44,1],[84,2],[124,3],[164,4],[204,2],[244,3]].forEach(([hx,i],k)=>{ x.save(); x.translate(hx,(k<6?52:98)-9); drawHelmet(x,hl[i].g,8,{},0); x.restore(); });
    ITEMS.armor.list.slice(1).forEach((it,i)=>{ x.save(); drawArmorIcon(x,it.g,{cloth:'#9e2b22'},44+i*62,84,0.62); x.restore(); });
    x.fillStyle=lg(x,0,H*0.8,0,H,[[0,'#6a4a30'],[1,'#3a2414']]); x.fillRect(0,H*0.8,W,H*0.2);
    x.strokeStyle='rgba(30,15,8,0.4)'; x.lineWidth=0.8; x.beginPath(); for(let i=0;i<W;i+=26){ x.moveTo(i,H*0.8); x.lineTo(i-20,H); } x.stroke();
    x.fillStyle='#6a4628'; x.fillRect(160,H*0.8-36,96,8); x.fillStyle='#4a2e18'; x.fillRect(166,H*0.8-28,6,32); x.fillRect(244,H*0.8-28,6,32);
    x.save(); x.translate(226,H*0.8-42); drawHelmet(x,hl[3].g,7,{},0); x.restore();
  } else {
    x.fillStyle='#6a4a30'; x.fillRect(0,0,W,H);
    for(let i=0;i<W;i+=22){ x.fillStyle=shade('#6a4a30',(R()-0.5)*0.25); x.fillRect(i,0,21,H*0.8); x.fillStyle='rgba(20,10,5,0.5)'; x.fillRect(i+21,0,1,H*0.8); }
    x.fillStyle=lg(x,0,0,0,H,[[0,'rgba(10,5,2,0.55)'],[0.7,'rgba(10,5,2,0.15)']]); x.fillRect(0,0,W,H);
    const S=[{t:'round',r:15,base:'#a8322a',dark:'#5a1610',rim:'#d8b45a',boss:'#e8c56c',emblem:true},{t:'round',r:14,base:'#2f5a8a',dark:'#14283f',rim:'#c9ced4',boss:'#e0e4e8'},
             {t:'tower',w:22,h:38,base:'#2e5a3a',dark:'#14281a',rim:'#dcb75c',boss:'#e8c56c'},{t:'round',r:13,base:'#b07a42',dark:'#5e3b1a',rim:'#85807a',boss:'#a7a29a',planks:true},
             {t:'round',r:15,base:'#c28b44',dark:'#7a5424',rim:'#ecc47c',boss:'#f4d18a',emblem:true}];
    [[42,58],[100,46],[250,52],[300,40],[370,60]].forEach(([sx,sy],i)=>{ x.save(); x.translate(sx,sy); x.scale(1.45,1.45); drawShield(x,S[i],0,0,null,true); x.restore(); });
    x.fillStyle=lg(x,0,H*0.8,0,H,[[0,'#8a6a48'],[1,'#4a3220']]); x.fillRect(0,H*0.8,W,H*0.2);
    speckle(x,0,H*0.8,W,H*0.2,220,['#e8c890','#c9a46a'],R,0.8,2.2,0.5);
    x.fillStyle='#5a3a20'; x.fillRect(172,H*0.8-30,84,7); x.fillRect(178,H*0.8-23,6,27); x.fillRect(244,H*0.8-23,6,27);
    ell(x,214,H*0.8-31,30,6); x.fillStyle='#c9a46a'; x.fill(); ell(x,214,H*0.8-32,24,4.5); x.fillStyle='#a8322a'; x.fill();
    for(const [px,col] of [[186,'#a8322a'],[196,'#2f5a8a'],[244,'#e2b44a']]){ x.fillStyle='#4a3a2a'; x.fillRect(px-3,H*0.8-36,6,6); x.fillStyle=col; x.fillRect(px-2.4,H*0.8-36,4.8,1.6); }
  }
}

function shopFrame(t,dt){
  if(!SHOPV.sc) SHOPV.sc=makeScene($('cvShop'),400);
  const S=SHOPV.sc; if(!S.fit()) return; const c=S.ctx; S.begin(); const kind=SHOPV.kind, H=S.LH, fy=H*0.8+6;
  S.blit(S.layer('bg-'+kind,(x,W,HH)=>shopBg(x,W,HH,kind)));
  if(kind==='smith'){
    const fl=0.7+0.3*Math.sin(t/80)*Math.sin(t/33+2);
    glow(c,65,H*0.8-14,70,'#ff7a2a',0.45*fl); glow(c,65,H*0.8-10,30,'#ffd27a',0.5*fl);
    c.save(); c.globalCompositeOperation='lighter';
    for(let i=0;i<6;i++){ const ph=(t/340+i*0.31)%1, fx=42+i*10+Math.sin(t/120+i)*2, f0=H*0.8-4, h=(22-ph*10)*(0.8+0.2*Math.sin(t/70+i)), w=4.5*(1-ph*0.5)+1.5, tip=Math.sin(t/90+i*2)*2.5;
      c.fillStyle=lg(c,0,f0-h,0,f0,[[0,'rgba(255,240,180,0)'],[0.35,`rgba(255,200,90,${0.75*(1-ph*0.6)})`],[1,`rgba(255,100,30,${0.85*(1-ph*0.4)})`]]);
      c.beginPath(); c.moveTo(fx-w,f0); c.quadraticCurveTo(fx-w,f0-h*0.55,fx+tip,f0-h); c.quadraticCurveTo(fx+w,f0-h*0.55,fx+w,f0); c.closePath(); c.fill(); }
    c.restore();
    const q=((t/950)+0)%1; if(q>=0.6 && SHOPV.lastQ<0.6 && !SHOPV.angry){ for(let i=0;i<10;i++) SHOPV.parts.add({x:186,y:fy-39,vx:rnd(-1.6,1.6),vy:rnd(-2.2,-0.6),g:0.08,decay:0.035,size:0.9,col:'#ffd27a',kind:'spark'}); SFX.play('anvil'); }
    SHOPV.lastQ=q;
    glow(c,186,fy-40,24,'#ffb050',0.15*fl);
  } else if(kind==='armor'){
    c.save(); c.globalCompositeOperation='lighter'; c.fillStyle=lg(c,340,20,250,H,[[0,'rgba(255,220,160,0.22)'],[1,'rgba(255,220,160,0)']]);
    c.beginPath(); c.moveTo(322,18); c.lineTo(366,18); c.lineTo(300,H); c.lineTo(200,H); c.closePath(); c.fill(); c.restore();
  }
  // satıcı: normalde işinde; eli boş çıkınca sinirlenir
  const kp=KEEPERS[kind], ang=SHOPV.angry, ak=ang?(t-ang.t0)/ang.dur:2;
  if(ang && ak>=1) SHOPV.angry=null;
  const kst = ak<1 ? {facing:1,kind:'angry',p:ak,seed:4,anger:true,tint:'#ff3a1a',tintA:clamp((0.14+0.1*Math.sin(t/70))*Math.min(1,ak*6)*(ang.lvl>1?1.35:1),0,0.4)} : {facing:1,kind:kp.pose,seed:4};
  const KR=drawHero(c,150,fy,150,kp,kst,t);
  if(ak<1 && Math.random()<0.6){ const sd=Math.random()<0.5?-1:1; SHOPV.parts.add({x:KR.headW.x+sd*9,y:KR.headW.y-4,vx:sd*rnd(0.4,0.9),vy:rnd(-1.2,-0.6),decay:0.022,size:rnd(3.5,5.5),grow:0.16,col:'#f6f1ea',kind:'smoke',a:0.95}); }
  if(ak<1){ // öfke damarı işareti
    const sc=(1+0.18*Math.sin(t/55))*Math.min(1,ak*8); c.save(); c.translate(KR.headW.x+19,KR.headW.y-7); c.scale(sc,sc);
    c.lineCap='round'; for(const [col,w] of [['rgba(40,8,4,0.6)',4],['#ff3a22',2.4]]){ c.strokeStyle=col; c.lineWidth=w;
      for(let i=0;i<4;i++){ c.save(); c.rotate(i*Math.PI/2); c.beginPath(); c.moveTo(1.8,-6.5); c.quadraticCurveTo(1.8,-1.8,6.5,-1.8); c.stroke(); c.restore(); } }
    c.restore(); }
  if(ak<1 && ang.lvl>=3 && Math.random()<0.25) SHOPV.parts.add({x:KR.headW.x+rnd(-4,4),y:KR.headW.y-20,vx:rnd(-0.6,0.6),vy:rnd(-1.4,-0.8),g:0.03,decay:0.03,size:1,col:'#ff7a3a',kind:'spark'});
  SHOPV.parts.step(dt); SHOPV.parts.draw(c);
  const look=lookOf(P); if(SHOPV.preview) Object.assign(look,SHOPV.preview);
  if(SHOPV.pop){ const p=(t-SHOPV.pop)/500; if(p<1) glow(c,322,fy-60,80,'#ffe39a',0.35*(1-p)); else SHOPV.pop=0; }
  const hst={facing:-1,seed:7,stand:true}; if(ak<1 && ang.lvl>=2){ hst.kind='dodge'; hst.p=Math.min(1,ak*1.5); }
  drawHero(c,322,fy,150,look,hst,t);
  vignette(c,400,H,0.5);
}
