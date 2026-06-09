// Anil EduTech — Service Worker
// Handles local push notifications

const CACHE_NAME = 'ae-cache-v1';

// Install
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Notification click — open site
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url)
    ? e.notification.data.url
    : 'https://aniledutech.in';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes('aniledutech.in') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
