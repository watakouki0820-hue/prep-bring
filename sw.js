// sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 古いSWを即座に追い出す
  event.waitUntil(clients.claim());
});

// fetchイベントを空でも入れることで、ブラウザに「常駐」の必要性を伝える
self.addEventListener('fetch', (event) => {});

// ★ 重要：予約通知が発火したときの挙動を安定させる
self.addEventListener('show', (event) => {
    console.log("Notification shown in background");
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('/');
    })
  );
});