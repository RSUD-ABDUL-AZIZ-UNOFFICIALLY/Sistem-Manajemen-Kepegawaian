// service-worker.js
const CACHE_NAME = 'simpeg-cache-v2.9.4';
const DYNAMIC_CACHE = 'simpeg-dynamic-v2.9.4';

// Daftar file statis yang harus ada di cache sejak awal (Pre-caching)
const ASSETS_TO_CACHE = [
  '/favicon.ico',
  '/asset/img/Lambang_KotaSingkawang.webp',
  '/asset/favicon.ico',
  '/asset/img/android-chrome-192x192.png',
  '/asset/img/simpeg.spairum.my.id_daily.png',
  '/asset/img/android-chrome-512x512.png',
  '/asset/img/portrait.png',
  '/asset/img/landscape.png',
  '/asset/css/index1.min.css',
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
  console.log('activate...');
  // const requestUrl = new URL(event.request.url);
  // const pagePath = requestUrl.pathname;

  // console.log(pagePath);
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
//   console.log('Fetch event:', event.request.url);
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         return response || fetch(event.request);
//       })
//   );
// });

// Helper untuk membersihkan redirected response guna menghindari error 'redirect mode not follow'
function cleanResponse(response) {
  if (!response || !response.redirected) {
    return response;
  }

  // Bungkus kembali response untuk mereset status 'redirected' menjadi false
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

// Event 3: FETCH - Mencegat request
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return; // Biarkan browser menangani request ini secara default tanpa intervensi SW
  }
  const requestUrl = new URL(event.request.url);
  // Perbaikan: Bypass request non-HTTP/HTTPS (seperti chrome-extension, data URIs, dll.)
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    return; // Biarkan browser menangani request ini secara default tanpa intervensi SW
  }
  // Strategi A: Network First untuk API (Data dinamis)
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const cleanedResponse = cleanResponse(networkResponse);
          if (cleanedResponse.ok) {
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, cleanedResponse.clone());
              return cleanedResponse;
            });
          }
          return cleanedResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cleanResponse(cachedResponse);
          });
        })
    );
  }
  // Strategi B: Cache First untuk Aset Statis (HTML, JS, CSS)
  else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Kembalikan dari cache jika ada (setelah dibersihkan), jika tidak, fetch dari jaringan
        if (cachedResponse) {
          return cleanResponse(cachedResponse);
        }

        return fetch(event.request).then((networkResponse) => {
          const cleanedResponse = cleanResponse(networkResponse);
          if (cleanedResponse.ok) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cleanedResponse.clone());
              return cleanedResponse;
            });
          }
          return cleanedResponse;
        });
      })
    );
  }
});
