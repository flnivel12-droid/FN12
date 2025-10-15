const CACHE_NAME = 'fortaleza-nivel-12-v1';

// Instalar o service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Só interceptar requisições GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requisições para APIs externas e chrome-extension
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.includes('api/') ||
      event.request.url.includes('_next/static/chunks/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna a resposta
        if (response) {
          return response;
        }
        
        // Fetch da rede e cache para próxima vez
        return fetch(event.request)
          .then((response) => {
            // Só fazer cache de respostas válidas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para página offline se disponível
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Atualizar o service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});