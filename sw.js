// Anil EduTech Service Worker
const CACHE = 'ae-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Anil EduTech', {
      body: data.body || 'New notification',
      icon: '/logo.png',
      badge: '/logo.png',
      tag: data.tag || 'ae',
      data: { url: data.url || 'https://aniledutech.in' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://aniledutech.in';
  e.waitUntil(clients.openWindow(url));
});
