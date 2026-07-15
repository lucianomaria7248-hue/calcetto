// Questo script dice al dispositivo che l'app è pronta per funzionare offline e per l'installazione
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installazione completata');
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Attivato');
});

self.addEventListener('fetch', (e) => {
    // Intercetta le richieste di rete. Al momento lasciamo passare tutto, 
    // serve solo per abilitare l'installazione della PWA.
});
