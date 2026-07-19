const CACHE_NAME = 'fanta-hub-v9';
const ASSETS = [
    './index.html',
    'https://cdn-icons-png.flaticon.com/512/861/861512.png'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installazione...');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Attivato. Rimozione vecchie cache...');
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Escludiamo le richieste API o verso Google Script dal caching per non congelare i dati live
    if (e.request.url.includes('script.google.com')) {
        return fetch(e.request);
    }
    
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Background sync per aggiornare gli asset in background
                fetch(e.request).then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
                    }
                }).catch(() => {});
                return cachedResponse;
            }
            return fetch(e.request);
        })
    );
});

// Ascolta il messaggio per forzare l'aggiornamento immediato dell'interfaccia
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
