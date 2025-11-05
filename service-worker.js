const CACHE_NAME = 'switch-omatic-pager-v1';
// Lista dos arquivos essenciais para o funcionamento offline
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'icon-192x192.png',
    // Não temos icon-512x512.png, mas mantemos o placeholder se você for adicioná-lo
    'icon-512x512.png', 
    // CDNs externas que o aplicativo usa
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://fonts.googleapis.com/css2?family=VT323&display=swap'
];

// Instalação: armazena todos os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Arquivos em cache durante a instalação');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
          console.error('Service Worker: Falha ao armazenar URLs em cache', err);
      })
  );
});

// Fetch: serve arquivos do cache primeiro
self.addEventListener('fetch', event => {
  // Estratégia Cache, then Network (Cache First)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        // Tenta buscar na rede se não estiver no cache
        return fetch(event.request).catch(() => {
            // Retorna algo útil se a rede falhar e o arquivo não estiver em cache
            // Aqui, simplesmente falhamos, pois é uma ferramenta offline.
        });
      })
  );
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
