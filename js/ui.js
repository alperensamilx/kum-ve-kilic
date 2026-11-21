"use strict";
// ---------- ARAYÜZ VE OYUN AKIŞI ----------
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const xpNeed = lvl => 80 + lvl*60;
const titleOf = f => TITLES[Math.min(TITLES.length-1, Math.floor((f.level-1)/2))];
const ico = (id,cls='') => `<svg class="ic ${cls}"><use href="#${id}"/></svg>`;
let P=null, draft=null, screen='title', lastPlace=null;

function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(P)); }catch(e){} }
function load(){ try{ const s=localStorage.getItem(SAVE_KEY); const p=s?JSON.parse(s):null; if(p && !p.look) p.look={...DEFAULT_LOOK}; return p; }catch(e){ return null; } }

function go(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  $('s-'+name).classList.add('on'); screen=name; window.scrollTo(0,0); document.body.className='scr-'+name;
  if(name==='city'){ renderHud(); cityEnter(lastPlace); lastPlace=null; }
}
function fadeTo(fn){ const f=$('fade'); f.classList.add('on'); setTimeout(()=>{ fn(); requestAnimationFrame(()=>requestAnimationFrame(()=>f.classList.remove('on'))); },290); }
function toCity(){ SFX.play('whoosh'); fadeTo(()=>go('city')); }

// ---------- KARAKTER OLUŞTURMA / ANTRENMAN ----------
const DOLL = {
  create:{cv:'cvCreate', variant:'create', src:()=>draftSrc()},
  train: {cv:'cvTrain',  variant:'train',  src:()=>draftSrc()},
  char:  {cv:'cvChar',   variant:'char',   src:()=>P},
};
const REACT = {str:{kind:'flex',dur:1100}, vit:{kind:'puff',dur:900}, agi:{kind:'hop',dur:650}, atk:{kind:'attack',act:'normal',dur:660}, def:{kind:'block',dur:850}, cha:{kind:'taunt',dur:1100}};
const EQ0 = {weapon:0,armor:0,helmet:0,shield:0};
function draftSrc(){ if(!draft) return null; return {...draft.cur, level:draft.fresh||!P?1:P.level, eq:draft.fresh||!P?EQ0:P.eq, look:draft.look}; }
function newDraft(base,pts,look,fresh=false){ return {base:{...base}, cur:{...base}, pts, look:{...look}, fresh}; }
function derived(s,fresh=draft&&draft.fresh){ const lvl=fresh||!P?1:P.level, eq=fresh||!P?EQ0:P.eq, f={...s,level:lvl,eq};
  return {hp:maxHp(f), sta:maxSta(f), dmg:Math.round(ITEMS.weapon.list[eq.weapon].v+s.str*2.2+DMG_BASE), arm:Math.round(armorOf(f)*0.7+s.def*1.2)}; }
function renderDerived(el,d){
  const a=derived(d.cur), b=derived(d.base), dl=k=>a[k]>b[k]?` <span class="d">+${a[k]-b[k]}</span>`:'';
  el.innerHTML=`<span class="chip">${ico('i-heart')}Can <b>${a.hp}</b>${dl('hp')}</span><span class="chip">${ico('i-bolt')}Enerji <b>${a.sta}</b>${dl('sta')}</span>`+
    `<span class="chip">${ico('i-sword')}Hasar <b>${a.dmg}</b>${dl('dmg')}</span><span class="chip">${ico('i-shield')}Zırh <b>${a.arm}</b>${dl('arm')}</span>`;
}
function renderStatEditor(el,d,ptsEl,doll,derEl){
  el.innerHTML=STATS.map(([k,n,ds,ic])=>`<div class="stat"><div class="si">${ico(ic)}</div><div class="nm">${n}<span class="ds">${ds}</span></div>
    <button class="btn" data-k="${k}" data-d="-1" ${d.cur[k]<=d.base[k]?'disabled':''} aria-label="${n} azalt">−</button>
    <div class="v ${d.cur[k]>d.base[k]?'up':''}">${d.cur[k]}</div>
    <button class="btn ${d.pts>0?'gold':''}" data-k="${k}" data-d="1" ${d.pts<=0?'disabled':''} aria-label="${n} artır">+</button></div>`).join('');
  ptsEl.textContent=d.pts; ptsEl.hidden=false; renderDerived(derEl,d);
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    const k=b.dataset.k, dd=+b.dataset.d;
    if(dd>0 && d.pts>0){ d.cur[k]++; d.pts--; SFX.play('tick',d.cur[k]-d.base[k]); buzz(8); doll.act={...REACT[k],t0:performance.now()}; }
    else if(dd<0 && d.cur[k]>d.base[k]){ d.cur[k]--; d.pts++; SFX.play('untick'); }
    renderStatEditor(el,d,ptsEl,doll,derEl);
  });
}
function renderLookEditor(){
  const L=draft.look, sw=(key,arr)=>`<div class="sw">${arr.map((col,i)=>`<button style="background:${col}" class="${L[key]===i?'on':''}" data-k="${key}" data-i="${i}" aria-label="${i+1}"></button>`).join('')}</div>`;
  const op=(key,arr)=>`<div class="opt">${arr.map((o,i)=>`<button class="${L[key]===i?'on':''}" data-k="${key}" data-i="${i}">${o.n}</button>`).join('')}</div>`;
  $('cLook').innerHTML=`<div class="lookrow"><span>Ten</span>${sw('skin',LOOK.skin)}</div><div class="lookrow"><span>Saç</span>${op('hair',LOOK.hair)}</div>
    <div class="lookrow"><span>Saç rengi</span>${sw('hairCol',LOOK.hairCol)}</div><div class="lookrow"><span>Sakal</span>${op('beard',LOOK.beard)}</div>
    <div class="lookrow"><span>Renk</span>${sw('cloth',LOOK.cloth)}</div><div class="lookrow"><span></span><button class="btn sm" id="lookRnd">${ico('i-dice')} Rastgele</button></div>`;
  $('cLook').querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{ L[b.dataset.k]=+b.dataset.i; SFX.play('select'); DOLL.create.act={kind:'puff',dur:600,t0:performance.now()}; renderLookEditor(); });
  $('lookRnd').onclick=()=>{ for(const [k,arr] of [['skin',LOOK.skin],['hair',LOOK.hair],['hairCol',LOOK.hairCol],['beard',LOOK.beard],['cloth',LOOK.cloth]]) L[k]=ri(0,arr.length-1);
    SFX.play('select'); DOLL.create.act={kind:'taunt',dur:900,t0:performance.now()}; renderLookEditor(); };
}
function startCreate(){
  draft=newDraft({str:1,atk:1,def:1,agi:1,vit:1,cha:1},START_PTS,DEFAULT_LOOK,true); DOLL.create.body=null; $('nameIn').value='';
  renderStatEditor($('cStats'),draft,$('cPts'),DOLL.create,$('cDerived')); renderLookEditor(); setTab('stats');
}
function setTab(tb){ document.querySelectorAll('#cTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===tb)); $('cStatsP').hidden=tb!=='stats'; $('cLookP').hidden=tb!=='look'; }
document.querySelectorAll('#cTabs button').forEach(b=>b.onclick=()=>setTab(b.dataset.t));
function finishCreate(){
  const name=$('nameIn').value.trim()||'İsimsiz';
  if(draft.pts>0 && !confirm(`${draft.pts} puan harcanmadı. Yine de devam edilsin mi?`)) return;
  P={name,level:1,xp:0,gold:50,pts:0,wins:0,losses:0,...draft.cur,eq:{weapon:0,armor:0,helmet:0,shield:0},champion:false,look:{...draft.look},introDone:false,shopMood:{}};
  save(); startFight(introFoe());   // oyun, eşit güçte bir esirle ilk düelloyla başlar
}
// İlk düello: senin kadar güçsüz, hiçbir eşyası olmayan bir esir
function introFoe(){
  const e=makeEnemy(1); e.name=pick(INTRO_NAMES); e.arch='Esir'; e.cloth=ARCH_CLOTH['Esir'];
  for(const k of ['str','atk','def','agi','vit','cha']) e[k]=1;
  let pts=START_PTS-2; const ks=['str','atk','def','agi','vit']; while(pts-->0) e[pick(ks)]++;
  e.eq={weapon:0,armor:0,helmet:0,shield:0};
  return {e, diff:'İlk Dövüş', mult:0.8, gold:40, xp:40, intro:true};
}
function openTrain(){
  const base={}; STATS.forEach(([k])=>base[k]=P[k]); draft=newDraft(base,P.pts,P.look); DOLL.train.body=null;
  renderStatEditor($('tStats'),draft,$('tPts'),DOLL.train,$('tDerived'));
  $('tNote').textContent = P.pts>0 ? 'Her puan vücudunda görünür: güç kas, dayanıklılık gövde katar.' : 'Puan kazanmak için arenada zafer kazan; her seviye +3 puan.';
  lastPlace='train'; go('train');
}
function confirmTrain(){ Object.assign(P,draft.cur); P.pts=draft.pts; save(); toCity(); }

// ---------- ŞEHİR VE GLADYATÖR ----------
function renderHud(){
  $('hName').textContent=P.name; $('hTitle').textContent=titleOf(P)+(P.champion?' · Şampiyon':'');
  $('hLvl').textContent=P.level; $('hGold').textContent=P.gold; $('hXp').style.width=(100*P.xp/xpNeed(P.level))+'%';
  const b=$('hPts'); b.hidden=!(P.pts>0); b.textContent=P.pts;
}
function openChar(){
  DOLL.char.body=null; $('chName').textContent=P.name; $('chTitle').textContent=`Seviye ${P.level} · ${titleOf(P)}`;
  $('chXpT').textContent=`${P.xp} / ${xpNeed(P.level)} tecrübe`; $('chXp').style.width=(100*P.xp/xpNeed(P.level))+'%';
  const d=derived(P,false);
  $('chStats').innerHTML=STATS.map(([k,n,,ic])=>`<div class="kv"><span>${ico(ic,'s')} ${n}</span><b>${P[k]}</b></div>`).join('')+
    `<div class="kv"><span>${ico('i-heart','s')} Can / ${ico('i-bolt','s')} Enerji</span><b>${d.hp} / ${d.sta}</b></div>`;
  $('chEquip').innerHTML=SLOTS.map(s=>{ const it=item(P,s); return `<div class="eqrow"><canvas data-s="${s}"></canvas><div><b>${it.n}</b><small>${ITEMS[s].label}</small></div><span class="tag">${it.v?'+'+it.v+' '+ITEMS[s].unit:'—'}</span></div>`; }).join('');
  $('chRec').innerHTML=`<div class="kv"><span>Galibiyet</span><b>${P.wins}</b></div><div class="kv"><span>Mağlubiyet</span><b>${P.losses}</b></div>`+(P.champion?`<div class="kv"><span>Unvan</span><b style="color:var(--gold)">Arena Şampiyonu</b></div>`:'');
  lastPlace=null; go('char'); drawIcons($('chEquip'),s=>item(P,s));
}
function drawIcons(root,getItem){
  root.querySelectorAll('canvas[data-s]').forEach(cv=>{ const r=cv.getBoundingClientRect(), d=DPR(), w=r.width||cv.clientWidth||56, h=r.height||w;
    cv.width=Math.round(w*d); cv.height=Math.round(h*d);
    const c=cv.getContext('2d'); c.setTransform(d,0,0,d,0,0); const s=cv.dataset.s, it=getItem(s,cv.dataset.i);
    drawItemIcon(c,s,it.g,w/2,h/2,w*0.86,lookOf(P)); });
}

// ---------- DÜKKANLAR ----------
let shopTab='weapon';
function openShop(kind){
  SHOPV.kind=kind; SHOPV.preview=null; SHOPV.sel=null; SHOPV.bought=false; SHOPV.angry=null; SHOPV.leaving=false; shopTab=SHOPS[kind].slots[0]; lastPlace=kind;
  const mood=(P.shopMood||{})[kind]||0;
  say(mood>0 ? SHOPS[kind].back : pick(SHOPS[kind].lines)); go('shop'); renderShop();
}
function say(t,angry=false){ const el=$('sSpeech'); el.innerHTML=`<b>${SHOPS[SHOPV.kind].keeper}</b>${t}`; el.classList.toggle('angry',angry); if(angry){ el.style.animation='none'; void el.offsetWidth; el.style.animation=''; } }
// Eli boş çıkınca satıcı sinirlenir; her eli boş çıkış öfkeyi artırır, alışveriş sıfırlar
function leaveShop(stay=false){
  if(SHOPV.leaving) return;
  const kind=SHOPV.kind, sh=SHOPS[kind];
  const prices=sh.slots.flatMap(s=>ITEMS[s].list.filter((it,i)=>i>P.eq[s]).map(it=>it.c));
  if(SHOPV.bought || !prices.length){ toCity(); return; }
  P.shopMood=P.shopMood||{}; const mood=(P.shopMood[kind]||0)+1; P.shopMood[kind]=mood; save();
  const lvl=Math.min(3,mood), broke=P.gold<Math.min(...prices);
  say(broke && lvl<3 ? BROKE_LINE : sh.angry[lvl-1], true);
  SHOPV.angry={t0:performance.now(), dur:1700, lvl}; SHOPV.leaving=true; SHOPV.preview=null;
  SFX.play('grumble'); if(lvl>=2) SFX.play('boo'); buzz(lvl>=2?[40,40,70]:30);
  window.scrollTo({top:0,behavior:'smooth'});
  if(!stay) setTimeout(()=>{ SHOPV.leaving=false; toCity(); },1650);
}
function renderShop(){
  const sh=SHOPS[SHOPV.kind]; $('sTitle').textContent=sh.title; $('sGold').textContent=P.gold;
  $('sTabs').innerHTML = sh.slots.length>1 ? sh.slots.map(s=>`<button class="btn sm ${s===shopTab?'gold':''}" data-s="${s}">${ITEMS[s].label}</button>`).join('') : '';
  $('sTabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{ shopTab=b.dataset.s; SHOPV.preview=null; SHOPV.sel=null; renderShop(); });
  const cur=P.eq[shopTab], list=ITEMS[shopTab].list, unit=ITEMS[shopTab].unit;
  $('sList').innerHTML=list.map((it,i)=>{
    if(i===0) return '';
    const diff=it.v-list[cur].v, own=i===cur, old=i<cur;
    const right = own ? `<span class="tag on">${ico('i-check','s')} Kuşanıldı</span>` : old ? `<span class="tag">Eski</span>` :
      `<button class="btn sm ${P.gold>=it.c?'gold':''}" data-buy="${i}" ${P.gold<it.c?'disabled':''}>${ico('i-coin','s')} ${it.c}</button>`;
    return `<div class="item ${own?'':old?'old':''} ${SHOPV.sel===i?'sel':''}" data-i="${i}"><canvas data-s="${shopTab}" data-i="${i}"></canvas>
      <div><b>${it.n}</b><div class="st">+${it.v} ${unit}${!own&&!old&&diff>0?` · <span class="up">+${diff} daha iyi</span>`:''}</div></div>${right}</div>`;
  }).join('');
  drawIcons($('sList'),(s,i)=>ITEMS[s].list[+i]);
  $('sList').querySelectorAll('.item').forEach(el=>el.onclick=e=>{
    if(e.target.closest('[data-buy]')) return;
    const i=+el.dataset.i; SHOPV.sel=i; SHOPV.preview={[shopTab]:ITEMS[shopTab].list[i].g}; SFX.play('select');
    $('sList').querySelectorAll('.item').forEach(x=>x.classList.toggle('sel',x===el));
  });
  $('sList').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.buy, it=ITEMS[shopTab].list[i]; if(P.gold<it.c) return;
    const old=ITEMS[shopTab].list[P.eq[shopTab]]; P.gold-=it.c; P.gold+=Math.floor(old.c*0.3); P.eq[shopTab]=i;
    SHOPV.bought=true; (P.shopMood||(P.shopMood={}))[SHOPV.kind]=0; save();
    SFX.play('equip'); buzz(20); SHOPV.preview=null; SHOPV.sel=null; SHOPV.pop=performance.now();
    say(pick(['Hayırlı olsun! Kumda şanını yürütsün.','İyi seçim. Seni koruyacak.','Bununla kalabalık adını haykıracak.']));
    renderShop();
  });
}

// ---------- ARENA ----------
function makeEnemy(lvl,boss){
  const archName=boss?'Şampiyon':pick(Object.keys(ARCH)), w=boss?{str:2,atk:2,def:2,agi:2,vit:2,cha:1}:ARCH[archName];
  const name=boss?'Altın Pençe Varro':pick(NAMES), h=hashStr(name+lvl);
  const e={name,arch:archName,level:lvl,str:1,atk:1,def:1,agi:1,vit:1,cha:1,eq:{},cloth:ARCH_CLOTH[archName],
    look:boss?{skin:2,hair:2,hairCol:0,beard:2,cloth:0}:{skin:h%4,hair:(h>>>3)%4,hairCol:(h>>>6)%4,beard:(h>>>9)%3,cloth:0}};
  let pts=START_PTS+(lvl-1)*3+(boss?6:0); const keys=Object.keys(w), tot=keys.reduce((s,k)=>s+w[k],0);
  while(pts-->0){ let r=Math.random()*tot; for(const k of keys){ r-=w[k]; if(r<=0){ e[k]++; break; } } }
  const tier=(slot,div)=>clamp(Math.floor((lvl-1+rnd(-1,1))/div),0,ITEMS[slot].list.length-1);
  e.eq={weapon:tier('weapon',2.4),armor:tier('armor',2.8),helmet:tier('helmet',3),shield:archName==='Kale'?clamp(tier('shield',3)+1,0,3):tier('shield',4)};
  if(boss) e.eq={weapon:4,armor:4,helmet:4,shield:3};
  return e;
}
let foeList=[];
function openArena(){
  const L=P.level; lastPlace='arena';
  foeList=[{e:makeEnemy(Math.max(1,L-1)),diff:'Kolay',mult:0.7},{e:makeEnemy(L),diff:'Orta',mult:1},{e:makeEnemy(L+2),diff:'Zor',mult:1.6}];
  if(L>=10 && !P.champion) foeList.push({e:makeEnemy(L+3,true),diff:'Şampiyonluk',mult:4});
  $('foes').innerHTML=foeList.map((f,i)=>{ f.gold=Math.round((30+f.e.level*18)*f.mult); f.xp=Math.round((30+f.e.level*12)*f.mult);
    return `<button class="btn foe ${f.mult===4?'boss':''}" data-i="${i}"><canvas></canvas><div><b>${f.e.name}</b><div class="st">Sv.${f.e.level} · ${f.e.arch} · ${item(f.e,'weapon').n}</div></div>
      <div><span class="tag ${f.mult>=1.6?'on':''}">${f.diff}</span><div class="rw"><span>${ico('i-coin','s')} ${f.gold}</span><span>${ico('i-star','s')} ${f.xp}</span></div></div></button>`; }).join('');
  go('arena'); drawGate();
  $('foes').querySelectorAll('button').forEach(b=>{ drawPortrait(b.querySelector('canvas'),foeList[+b.dataset.i].e,-1); b.onclick=()=>startFight(foeList[+b.dataset.i]); });
}
function drawGate(){ // arena kapısı üst görseli (durağan)
  const S=makeScene($('cvGate'),400); if(!S.fit()) return; S.begin(); const c=S.ctx;
  c.drawImage(S.layer('a',arenaBg),0,0,400,S.LH);
  c.fillStyle=lg(c,0,0,0,S.LH,[[0,'rgba(20,10,5,0)'],[0.7,'rgba(20,10,5,0.1)'],[1,'rgba(20,10,5,0.7)']]); c.fillRect(0,0,400,S.LH);
  vignette(c,400,S.LH,0.5);
}
document.querySelectorAll('#acts button').forEach(b=>b.onclick=()=>playerAct(b.dataset.a));

function endFight(won){
  const f=F.foe, crowdBonus=1+F.crowd/200; let gold,xp,lines=[];
  if(won){ gold=Math.round(f.gold*crowdBonus*(1+P.cha*0.02)); xp=f.xp; P.wins++;
    if(f.mult===4){ P.champion=true; lines.push(`<p class="note">${ico('i-crown')} <b>ARENA ŞAMPİYONU OLDUN!</b> Özgürlüğünü kazandın.</p>`); } }
  else { gold=-Math.floor(P.gold*0.15); xp=Math.round(f.xp*0.25); P.losses++; lines.push('<p class="note muted">Hekimler seni toparladı. Bedelini altınla ödedin.</p>'); }
  if(f.intro){ P.introDone=true; lines.push(won ? `<p class="note">${ico('i-crowd')} Kalabalık adını ilk kez duydu. <b>Kızılkum'a hoş geldin!</b> Kazandığın altınla dükkânlara uğra.</p>`
    : `<p class="note">Kaybettin ama hayattasın. <b>Kızılkum'a hoş geldin.</b> Antrenman ve teçhizatla güçlen, sonra arenaya dön.</p>`); }
  P.gold=Math.max(0,P.gold+gold); P.xp+=xp;
  const rows=`<div class="kv"><span>${ico('i-coin','s')} Altın</span><b>${gold>=0?'+':''}${gold}</b></div><div class="kv"><span>${ico('i-star','s')} Tecrübe</span><b>+${xp}</b></div><div class="kv"><span>${ico('i-crowd','s')} Seyirci coşkusu</span><b>%${Math.round(F.crowd)}</b></div>`;
  SFX.play(won?'win':'lose'); let leveled=false;
  while(P.xp>=xpNeed(P.level)){ P.xp-=xpNeed(P.level); P.level++; P.pts+=3; if(!leveled){ SFX.play('levelup'); leveled=true; } lines.push(`<p class="note">${ico('i-star')} <b>Seviye ${P.level}!</b> +3 özellik puanı. Antrenman alanına uğra.</p>`); }
  save(); RESULT.win=won; RESULT.t0=performance.now(); RESULT.parts=new Particles();
  $('rTitle').textContent=won?'Zafer':'Yenilgi'; $('rTitle').className='res-title '+(won?'win':'lose');
  $('rBody').innerHTML=rows+lines.join(''); F=null; lastPlace='arena'; fadeTo(()=>go('result'));
}

// ---------- AKIŞ ----------
function continueGame(){ P=load(); if(!P) return; if(!P.introDone && !P.wins && !P.losses){ startFight(introFoe()); return; } SFX.play('gong'); fadeTo(()=>go('city')); }
function resetGame(){ if(!confirm('Tüm ilerleme silinecek. Emin misin?')) return; try{ localStorage.removeItem(SAVE_KEY); }catch(e){} P=null; showTitle(); }
function showTitle(){ $('btnContinue').style.display=load()?'':'none'; go('title'); }
const _go=go; go=function(name){ if(name==='create') startCreate(); _go(name); };

document.addEventListener('pointerdown',SFX.init);
const muteBtn=$('mute'), setMuteIcon=()=>muteBtn.querySelector('use').setAttribute('href',SFX.muted?'#i-mute':'#i-vol');
setMuteIcon(); muteBtn.onclick=()=>{ SFX.init(); SFX.toggle(); setMuteIcon(); SFX.play('click'); };
document.addEventListener('click',e=>{ if(e.target.closest('.btn:not(#acts .btn):not(#mute):not([data-k]):not([data-buy])')) SFX.play('click'); });

let lastT=0;
function loop(t){
  requestAnimationFrame(loop); const dt=Math.min(50,(t-lastT)||16); lastT=t;
  try{
    if(screen==='title') titleFrame(t,dt); else if(screen==='city') cityFrame(t,dt);
    else if(screen==='create'||screen==='train'||screen==='char') dollFrame(DOLL[screen],t,dt);
    else if(screen==='shop') shopFrame(t,dt); else if(screen==='fight') fightFrame(t,dt); else if(screen==='result') resultFrame(t,dt);
  }catch(e){ console.error(e); }
}
// Test için: ?dbg=ekran (kayıt yapılmaz)
const DBG=new URLSearchParams(location.search).get('dbg');
if(DBG){
  const _save=save; save=()=>{};
  P={name:'Demirpençe',level:6,xp:120,gold:900,pts:3,wins:7,losses:2,str:9,atk:6,def:5,agi:4,vit:7,cha:5,eq:{weapon:2,armor:2,helmet:2,shield:2},champion:false,look:{skin:1,hair:0,hairCol:0,beard:1,cloth:0}};
  const grow=(st,kind)=>()=>{ go('create'); Object.assign(draft.cur,st); draft.pts=0; renderStatEditor($('cStats'),draft,$('cPts'),DOLL.create,$('cDerived'));
    if(kind) DOLL.create.act={...REACT[kind],dur:9000,t0:performance.now()+1500}; };
  const m={intro:()=>{ Object.assign(P,{level:1,xp:0,gold:50,pts:0,wins:0,losses:0,str:3,atk:3,def:2,agi:2,vit:4,cha:1,eq:{...EQ0},introDone:false}); startFight(introFoe()); },
    angry:()=>{ P.shopMood={smith:1}; openShop('smith'); setTimeout(()=>{ leaveShop(true); setInterval(()=>{ SHOPV.angry={t0:performance.now()-450,dur:1700,lvl:2}; },900); },2500); },
    create:()=>go('create'),city:()=>go('city'),grow1:grow({str:9,vit:2}),grow2:grow({vit:9,str:2}),grow3:grow({agi:6,atk:5}),grow4:grow({str:6,vit:5,cha:5},'str'),char:openChar,train:openTrain,smith:()=>openShop('smith'),armor:()=>openShop('armor'),shield:()=>openShop('shield'),arena:openArena,
    fight:()=>{ openArena(); startFight(foeList[1]); }, win:()=>{ openArena(); F={foe:foeList[1],crowd:70,p:{},e:{}}; endFight(true); }, lose:()=>{ openArena(); F={foe:foeList[1],crowd:20,p:{},e:{}}; endFight(false); }};
  (m[DBG]||showTitle)();
} else showTitle();
requestAnimationFrame(loop);
if('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.Capacitor){
  if(DBG){ navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{}); if(window.caches) caches.keys().then(k=>k.forEach(n=>caches.delete(n))).catch(()=>{}); }
  else navigator.serviceWorker.register('sw.js').catch(()=>{});
}
