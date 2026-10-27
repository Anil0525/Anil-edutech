/* Anil EduTech service worker — network-first so every device gets the latest version */
const VERSION = 'ae-2026-10-27-1'; // change this string on every deploy to force-refresh all devices
const CACHE = 'ae-cache-' + VERSION;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase, Razorpay, ads etc. untouched
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req, { cache: 'no-cache' });
      if (fresh && fresh.ok) { const c = await caches.open(CACHE); c.put(req, fresh.clone()); }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req) || (req.mode === 'navigate' && await caches.match('/'));
      if (cached) return cached;
      throw err;
    }
  })());
});

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; }
  catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Anil EduTech', {
    body: d.body || '',
    icon: d.icon || '/logo.png',
    badge: '/logo.png',
    tag: d.tag || 'ae-push',
    vibrate: [200, 100, 200],
    data: { url: d.url || 'https://aniledutech.in' }
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || 'https://aniledutech.in';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) {
      if (c.url.indexOf(self.location.origin) === 0 && 'focus' in c) {
        if ('navigate' in c && url !== c.url) c.navigate(url).catch(() => {});
        return c.focus();
      }
    }
    return clients.openWindow(url);
  }));
});
