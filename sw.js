/* PiekAtleet service worker — cachet de app-shell zodat de app offline opent.
   Data-sync gaat buiten de SW om (local-first in app.js). */
var CACHE = 'piekatleet-v19'; // bump bij ELKE deploy — vervangt de hele shell atomisch
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

  // CDN (versie zit in de URL, verandert nooit) → cache-first
  if (isCdn) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (resp) {
          if (resp && (resp.ok || resp.type === 'opaque')) {
            var clone = resp.clone();
            caches.open(CACHE).then(function (c) { c.put(req, clone); });
          }
          return resp;
        });
      })
    );
    return;
  }

  // App-shell → NETWORK-FIRST met cache als vangnet.
  // Zo krijg je online altijd de nieuwste versie (geen "update pas de 2e keer openen"),
  // en offline/traag netwerk valt na 3,5 s terug op de opgeslagen kopie.
  e.respondWith(new Promise(function (resolve) {
    var settled = false;
    function done(resp) { if (!settled) { settled = true; resolve(resp); } }

    var timer = setTimeout(function () {
      if (settled) return;
      caches.match(req).then(function (cached) { if (cached) done(cached); });
    }, 3500);

    fetch(req).then(function (resp) {
      clearTimeout(timer);
      if (resp && resp.ok) {
        var clone = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(req, clone); });
      }
      done(resp);
    }).catch(function () {
      clearTimeout(timer);
      caches.match(req).then(function (cached) {
        if (cached) return done(cached);
        if (req.mode === 'navigate') {
          return caches.match('./index.html').then(function (shell) {
            done(shell || new Response('Offline', { status: 503 }));
          });
        }
        done(new Response('Offline', { status: 503 }));
      });
    });
  }));
});
