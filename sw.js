// Çevrimdışı çalışma için basit önbellek. Oyunu güncellediğinde VERSION'ı artır (yayinla.sh bunu otomatik yapar).
const VERSION = 'kvk-20261121122501';
const FILES = ['./', './index.html', './manifest.webmanifest', './css/style.css',
  './js/data.js', './js/gfx.js', './js/sfx.js', './js/hero.js', './js/body.js', './js/gear.js', './js/scenes.js',
  './js/city-art.js', './js/city-shops.js', './js/shops-art.js', './js/city.js', './js/fight.js', './js/ui.js',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
