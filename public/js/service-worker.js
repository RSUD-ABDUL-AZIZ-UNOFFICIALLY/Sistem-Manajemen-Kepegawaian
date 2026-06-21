// service-worker.js
const CACHE_NAME = 'simpeg-cache-v1';
const DYNAMIC_CACHE = 'simpeg-dynamic-v1';

// Daftar file statis yang harus ada di cache sejak awal (Pre-caching)
const ASSETS_TO_CACHE = [
  '/',
  '/asset/img/Lambang_KotaSingkawang.webp',
  '/asset/favicon.ico',
  '/asset/img/android-chrome-192x192.png',
  '/asset/img/simpeg.spairum.my.id_daily.png',
  '/asset/img/android-chrome-512x512.png',
  '/asset/img/portrait.png',
  '/asset/img/landscape.png',
  '/asset/css/index.css',
  '/asset/js/manifest.json'
];

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//       caches.open('app-cache')
//         .then((cache) => {
//           return cache.addAll([
//             '/favicon.ico',
//             '/asset/img/android-chrome-192x192.png',
//             '/asset/img/android-chrome-512x512.png',
//             '/asset/img/Lambang_KotaSingkawang.webp',
//             '/asset/img/portrait.png',
//             '/asset/img/landscape.png',
//           ]);
//         })
//     );
//   });

// Event 1: INSTALL - Mengunduh aset statis ke dalam cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Membuka cache statis...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});
// Event 2: ACTIVATE - Membersihkan cache versi lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  });