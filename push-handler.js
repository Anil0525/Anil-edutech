/* push-handler.js — web push events. Loaded from sw.js via importScripts('/push-handler.js') */
self.addEventListener('push', function (event) {
  var d = {};
  try { d = event.data ? event.data.json() : {}; }
  catch (e) { d = { title: 'Anil EduTech', body: event.data ? event.data.text() : '' }; }
  var title = d.title || 'Anil EduTech';
  event.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    icon: d.icon || '/logo.png',
    badge: '/logo.png',
    tag: d.tag || 'ae-push',
    data: { url: d.url || 'https://aniledutech.in' },
    vibrate: [200, 100, 200]
  }));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || 'https://aniledutech.in';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(self.location.origin) === 0 && 'focus' in c) {
          if ('navigate' in c && url !== c.url) { c.navigate(url).catch(function () {}); }
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
