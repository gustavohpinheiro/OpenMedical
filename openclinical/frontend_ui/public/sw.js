// Service Worker para OpenClinical PWA Mobile Offline
const CACHE_NAME = 'openclinical-cache-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/favicon-32.png',
  '/icons/atalho-dose-pediatrica-192.png',
];

// Pré-carrega a casca do app e todos os arquivos do build listados em precache-manifest.json
// (gerado pelo vite.config.ts), para funcionar offline já após o primeiro acesso.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(ASSETS_TO_CACHE);
      try {
        const resposta = await fetch('/precache-manifest.json', { cache: 'no-store' });
        if (resposta.ok) {
          await cache.addAll(await resposta.json());
        }
      } catch (erro) {
        // Sem manifesto (ex.: servidor de desenvolvimento): os arquivos entram no cache conforme forem usados
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Estratégia network-first: conteúdo e cálculos clínicos atualizados têm prioridade;
// o cache serve apenas como fallback offline (evita servir versões antigas indefinidamente).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copia = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
  );
});
