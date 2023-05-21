// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('app-cache')
        .then((cache) => {
          return cache.addAll([
            '/favicon.ico',
            '/',
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