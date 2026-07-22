/* PiekAtleet service worker — cachet de app-shell zodat de app offline opent.
   Data-sync gaat buiten de SW om (local-first in app.js). */
var CACHE = 'piekatleet-v5'; // bump bij ELKE deploy — vervangt de hele shell atomisch
var SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './program.js',
  './config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];
var CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // CDN mee-awaiten (opaque response is prima), maar een CDN-fout mag installatie nooit blokkeren
      return Promise.all([
        cache.add(new Request(CDN, { mode: 'no-cors' })).catch(function () {}),
        cache.addAll(SHELL)
      ]);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  // alleen binnen de eigen app-scope cachen — nooit de Supabase-API (zelfde origin, ander pad)
  var scopePath = new URL(self.registration.scope).pathname;
  var isShell = url.origin === location.origin && url.pathname.indexOf(scopePath) === 0;
  var isCdn = req.url === CDN;
  if (!isShell && !isCdn) return; // Supabase-API e.d.: direct naar netwerk

  // stale-while-revalidate: cache direct, vernieuw op de achtergrond
  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (cached) {
        var fetching = fetch(req).then(function (resp) {
          if (resp && (resp.ok || resp.type === 'opaque')) cache.put(req, resp.clone());
          return resp;
        }).catch(function () { return cached; });
        if (cached) return cached;
        return fetching.then(function (resp) {
          // navigatie zonder cache én zonder netwerk → shell
          if (!resp && req.mode === 'navigate') return cache.match('./index.html');
          return resp;
        });
      });
    })
  );
});
