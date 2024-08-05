// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('app-cache')
        .then((cache) => {
          return cache.addAll([
            '/favicon.ico',
            '/asset/img/android-chrome-192x192.png',
            '/asset/img/android-chrome-512x512.png',
            '/asset/img/Lambang_KotaSingkawang.webp',
            '/asset/img/portrait.png',
            '/asset/img/landscape.png',
          ]);
        })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  });