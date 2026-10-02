// sw.js - Service Worker for Chrome Background Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for background push message triggers from the main page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = event.data.title || 'Mini Clinic Notification';
    const options = {
      body: event.data.body || 'Your queue status has updated.',
      icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'queue-status-alert',
      renotify: true,
      requireInteraction: true
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
