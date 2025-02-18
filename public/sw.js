self.addEventListener("push", function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    data: data.data,
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // 🔹 Cierra la notificación al hacer clic

  // 🔹 Abrir la URL en una nueva pestaña
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
