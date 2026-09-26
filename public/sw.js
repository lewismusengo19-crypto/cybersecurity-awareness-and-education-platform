// Cybersecurity Awareness and Education Platform - Service Worker
const SHELL_CACHE = 'cyber-academy-shell-v1';
const CONTENT_CACHE = 'cyber-academy-content-v1';

// App shell assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Non-fatal precache item error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== SHELL_CACHE && key !== CONTENT_CACHE) {
            console.log('[SW] Removing deprecated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper to determine if a request is educational content (videos, images, docs, media)
function isEducationalAsset(url) {
  const parsed = new URL(url);
  const pathname = parsed.pathname.toLowerCase();
  
  // Local uploads (videos, images, pdfs)
  if (pathname.startsWith('/uploads/')) return true;
  
  // Unsplash or external educational images
  if (parsed.hostname.includes('unsplash.com') || parsed.hostname.includes('mixkit.co')) return true;

  // Media file extensions
  if (pathname.match(/\.(mp4|webm|jpg|jpeg|png|gif|webp|svg|pdf|mp3|wav)$/)) return true;

  return false;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests and browser extensions
  if (req.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // 1. Navigation requests: App Shell (HTML)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put('/', responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline navigation fallback: return cached index.html or root
          const cache = await caches.open(SHELL_CACHE);
          const cached = await cache.match('/') || await cache.match('/index.html');
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline - Cyber Academy</title></head><body style="background:#0f172a;color:white;font-family:sans-serif;padding:2rem;text-align:center;"><h2>Offline Mode</h2><p>Please launch the app while online once to prime offline storage.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Educational Content (Videos, Images, PDFs, Infographics)
  if (isEducationalAsset(req.url)) {
    event.respondWith(
      caches.open(CONTENT_CACHE).then(async (cache) => {
        // Check cache first
        const cachedResponse = await cache.match(req, { ignoreSearch: true });
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network, then cache response for future offline use
        try {
          const networkResponse = await fetch(req);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(req, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // If network failed and nothing in cache, return fallback if available
          return cachedResponse || new Response('Educational resource currently unavailable offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
      })
    );
    return;
  }

  // 3. API calls (e.g. Gemini daily tip)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CONTENT_CACHE).then((cache) => cache.put(req, clone));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CONTENT_CACHE);
          const cached = await cache.match(req);
          if (cached) return cached;
          return new Response(JSON.stringify({ offline: true, message: 'Offline mode' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 4. Default Static Assets (JS, CSS, fonts, icons): Stale While Revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// Communication with frontend client
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Preload and cache an educational asset explicitly
  if (event.data.type === 'CACHE_EDUCATIONAL_ASSET' && event.data.url) {
    const assetUrl = event.data.url;
    caches.open(CONTENT_CACHE).then((cache) => {
      fetch(assetUrl, { mode: 'cors' })
        .then((response) => {
          if (response && (response.status === 200 || response.type === 'opaque')) {
            cache.put(assetUrl, response);
            if (event.source) {
              event.source.postMessage({
                type: 'ASSET_CACHED_SUCCESS',
                url: assetUrl,
                id: event.data.id
              });
            }
          }
        })
        .catch((err) => {
          console.warn('[SW] Failed to cache asset explicitly:', assetUrl, err);
        });
    });
  }
});
