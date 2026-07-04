const CACHE_NAME = 'vance-library-cdn-cache-v1';
const CDN_URLS = [
  'https://cdnjs.cloudflare.com',
  'https://unpkg.com'
];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  const isCDN = CDN_URLS.some(cdn => url.startsWith(cdn));
  
  if (isCDN && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return new Response('Offline CDN Resource', { status: 408 });
          });
        });
      })
    );
  }
});
