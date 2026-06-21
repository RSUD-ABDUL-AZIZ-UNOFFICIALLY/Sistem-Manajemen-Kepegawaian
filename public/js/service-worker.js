// service-worker.js
const CACHE_NAME = 'simpeg-cache-v2.8.1';
const DYNAMIC_CACHE = 'simpeg-dynamic-v2.8.1';

// Daftar file statis yang harus ada di cache sejak awal (Pre-caching)
const ASSETS_TO_CACHE = [
  '/',
  '/daily',
  '/asset/js/template/sidebar.js',
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
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         return response || fetch(event.request);
//       })
//   );
// });
// Event 3: FETCH - Mencegat request
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategi A: Network First untuk API (Data dinamis)
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Simpan response terbaru ke cache dinamis
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Jika offline, ambil data terakhir dari cache dinamis
          return caches.match(event.request);
        })
    );
  }
  // Strategi B: Cache First untuk Aset Statis (HTML, JS, CSS)
  else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Kembalikan dari cache jika ada, jika tidak, fetch dari jaringan
        return cachedResponse || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});