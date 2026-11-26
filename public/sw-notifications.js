self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetPath =
    (event.notification &&
      event.notification.data &&
      event.notification.data.url) ||
    '/?tab=today&source=reminder';

  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            client.postMessage({ type: 'LUCIDA_OPEN_TODAY' });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
        return undefined;
      })
  );
});
