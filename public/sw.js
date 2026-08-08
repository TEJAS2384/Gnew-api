const CACHE_NAME = 'tez-news-cache-v2';
const urlsToCache = ['/', '/index.html'];

// 1. Install Service Worker (Caching static assets)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 2. Activate Service Worker (Cleaning old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Offline Content (Offline PWA support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('/index.html');
    })
  );
});

// 4. 🔔 Push Event for Mobile Background Notifications & App Badging
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: '🔥 T-News Breaking Update', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || '🔥 T-News Breaking Update';
  const options = {
    body: data.body || 'Tap to read live breaking news.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };

  // Set App Badge on Phone Home Screen Icon (1, 2, 3...)
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1).catch(() => {});
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// 5. 👆 Notification Click Handler (Open app & clear badge)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Clear App Badge when opened
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch(() => {});
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url || '/');
    })
  );
});