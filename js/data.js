"use strict";
// ---------- OYUN VERİSİ ----------
const STATS = [
  ['str','Güç','Hasar · kas kütlesi','i-fist'],
  ['atk','Saldırı','İsabet şansı','i-sword'],
  ['def','Savunma','Hasar azaltma','i-shield'],
  ['agi','Çeviklik','Kaçınma · enerji','i-wind'],
  ['vit','Dayanıklılık','Can · iri gövde','i-heart'],
  ['cha','Karizma','Alay · seyirci','i-crown'],
];

// g: görünüm tanımı (çizim için)
const ITEMS = {
  weapon:{label:'Silah', unit:'hasar', list:[
    {n:'Paslı Kısa Kılıç', v:3,  c:0,    g:{t:'sword', len:24, w:4.2, blade:'#8f877b', edge:'#bdb3a3', guard:'#5b4632', grip:'#4a3020', pommel:'#6b5440', rust:true}},
    {n:'Tunç Kılıç',       v:6,  c:120,  g:{t:'sword', len:29, w:4.6, leaf:true, blade:'#c48d42', edge:'#f3cd8a', guard:'#8e6126', grip:'#5a3418', pommel:'#c48d42'}},
    {n:'Demir Mızrak',     v:9,  c:320,  g:{t:'spear', len:80, head:14, blade:'#a9b2ba', edge:'#eef2f4', shaft:'#7d5833'}},
    {n:'Çift Ağızlı Balta',v:13, c:700,  g:{t:'axe',   len:40, blade:'#bfc6cc', edge:'#f6f8fa', shaft:'#6e4a2c'}},
    {n:'Kara Çelik Kılıç', v:18, c:1400, g:{t:'sword', len:35, w:5,   blade:'#3f4552', edge:'#a8c0e0', guard:'#2b2e36', grip:'#3a2230', pommel:'#5d6580', sheen:'#86a8dc'}},
    {n:'Şafak Kılıcı',     v:24, c:2600, g:{t:'sword', len:37, w:5.4, blade:'#eec055', edge:'#fff4cc', guard:'#c08a22', grip:'#7a2a1a', pommel:'#ffd96e', glow:'#ffcf5a'}},
  ]},
  armor:{label:'Zırh', unit:'zırh', list:[
    {n:'Keten Tunik', v:0,  c:0,    g:{t:'none'}},
    {n:'Deri Zırh',   v:3,  c:100,  g:{t:'leather', base:'#7d4b27', dark:'#4b2b14', trim:'#b98349'}},
    {n:'Zincir Zırh', v:6,  c:300,  g:{t:'chain',   base:'#8f979e', dark:'#565d64', trim:'#c2c8cd'}},
    {n:'Pul Zırh',    v:9,  c:650,  g:{t:'scale',   base:'#7f8f68', dark:'#46553c', trim:'#cfa64c'}},
    {n:'Plaka Zırh',  v:13, c:1300, g:{t:'plate',   base:'#c7cdd3', dark:'#77818b', trim:'#e2bb5d'}},
  ]},
  helmet:{label:'Miğfer', unit:'zırh', list:[
    {n:'Yok',              v:0, c:0,    g:{t:'none'}},
    {n:'Deri Başlık',      v:1, c:60,   g:{t:'cap',      base:'#7d4b27', dark:'#4b2b14', hi:'#b07a46'}},
    {n:'Tunç Miğfer',      v:3, c:220,  g:{t:'bronze',   base:'#c38c44', dark:'#7a5222', hi:'#f6d696'}},
    {n:'Demir Miğfer',     v:5, c:520,  g:{t:'iron',     base:'#a8b0b8', dark:'#5c646c', hi:'#f0f4f7', plume:'#a52a20'}},
    {n:'Şampiyon Miğferi', v:8, c:1150, g:{t:'champion', base:'#e0b24a', dark:'#86601a', hi:'#fff2c0', plume:'#c32b20'}},
  ]},
  shield:{label:'Kalkan', unit:'zırh', list:[
    {n:'Yok',          v:0, c:0,   g:{t:'none'}},
    {n:'Ahşap Kalkan', v:2, c:80,  g:{t:'round', r:14, base:'#b07a42', dark:'#5e3b1a', rim:'#85807a', boss:'#a7a29a', planks:true}},
    {n:'Tunç Kalkan',  v:4, c:260, g:{t:'round', r:15, base:'#c28b44', dark:'#7a5424', rim:'#ecc47c', boss:'#f4d18a', emblem:true}},
    {n:'Kule Kalkanı', v:7, c:720, g:{t:'tower', w:25, h:42, base:'#9c2b23', dark:'#5a1610', rim:'#dcb75c', boss:'#e8c56c', tint:true}},
  ]},
};
const SLOTS = ['weapon','armor','helmet','shield'];

const SHOPS = {
  smith: {title:'Demirci', keeper:'Usta Brakos', slots:['weapon'], icon:'i-hammer',
          lines:['Demir ateşteyken dövülür. Ne lazım, evlat?','Kılıcın kadar keskin ol, gladyatör.','Bu ağızlar kemik keser, emin ol.'],
          angry:['Bir şey almadan mı? Ocağı boşuna mı yaktım!','Yine eli boş! Çekicimi kafana indirmeden git!','Bir daha gelirsen seni örsün üstünde döverim!'],
          back:'Yine mi sen? Bu sefer bir şey alacak mısın, yoksa yine laf mı?'},
  armor: {title:'Zırhçı', keeper:'Kassia', slots:['armor','helmet'], icon:'i-helmet',
          lines:['Her halkayı elimle ördüm. Dene bakalım.','Miğfersiz çıkan, kafasız döner.','Zırhtan tasarruf eden, kumda yatar.'],
          angry:['Bakıp bakıp gidenlerden misin? Tüh!','Zırhımı elleyip çıkıyorsun. Kumda yat da gör!','Kapıdan bir daha bakarsan miğferi suratına geçiririm!'],
          back:'Ah, gene sen. Bu sefer alacaksan konuşalım.'},
  shield:{title:'Kalkancı', keeper:'Yaşlı Doruk', slots:['shield'], icon:'i-shield',
          lines:['İyi kalkan, iyi dosttan değerlidir.','Meşe ve tunç. Kırk yıllık zanaat.','Darbe gelince arkasına saklan, utanma.'],
          angry:['Gençler... Bakarlar, almazlar. Hıh!','Boyam kurudu seni beklerken! Defol!','Kalkansız arenaya çık da gör gününü, nankör!'],
          back:'Hıh. Yine geldin. Bakalım bu sefer...'},
};

// Görünüm seçenekleri
const LOOK = {
  skin:   ['#f0cba6','#d9a374','#b27a4e','#7f5236'],
  hair:   [{n:'Kısa',s:'short'},{n:'Uzun',s:'long'},{n:'Kel',s:'bald'},{n:'Topuz',s:'bun'}],
  hairCol:['#2a1b11','#5d3618','#9b6a36','#d6bd86'],
  beard:  [{n:'Yok',s:'none'},{n:'Kirli',s:'stubble'},{n:'Gür',s:'full'}],
  cloth:  ['#9e2b22','#2b4f90','#2e6b3d','#5d3482','#b8862a'],
};
const DEFAULT_LOOK = {skin:1, hair:0, hairCol:0, beard:1, cloth:0};

const NAMES = ['Kemikkıran','Kızıl Boğa','Sessiz Yılan','Taşyumruk','Gölge','Demir Ayı','Kurtdişi','Akrep','Yaralı Kartal','Tunç Dev','Kum Fırtınası','Boynuz','Kara Tilki','Çelikkol','Yabanöfke','Kuzgun','Dağ Aslanı','Zehirli Diken'];
const ARCH = {
  'Kaba Kuvvet':{str:3,vit:2,atk:1,def:1,agi:0.5,cha:0.5},
  'Düellocu':{atk:3,agi:2.5,str:1.5,def:0.5,vit:1,cha:1},
  'Kale':{def:3,vit:3,str:1.5,atk:1,agi:0.3,cha:0.2},
  'Şovmen':{cha:3,agi:2,atk:1.5,str:1.5,def:1,vit:1},
};
const BROKE_LINE = 'Cebinde beş kuruş yokken vaktimi mi çalıyorsun?';
const INTRO_NAMES = ['Zincirli Bran','Sefil Taro','Tutsak Mirko','Aç Doran','Kırık Diş'];
const ARCH_CLOTH = {'Esir':'#7a6a52','Kaba Kuvvet':'#5b5a24','Düellocu':'#2b4f90','Kale':'#4e5862','Şovmen':'#7a2f6b','Şampiyon':'#1d1814'};
const TITLES = ['Esir','Acemi','Kum Savaşçısı','Arena Kurdu','Kalabalığın Gözdesi','Şampiyon Adayı','Arena Efsanesi'];
const SAVE_KEY = 'kumVeKilic_v1';
const START_PTS = 10, ARENA_LEN = 9;
const CITY_NAME = 'Kızılkum';
