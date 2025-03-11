importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js')

/* Get the Firebase configuration from the cache */
async function getFirebaseConfig() {
  const cache = await caches.open('firebase-config-cache');
  const response = await cache.match('/firebase-config');
  if (response) {
    return response.json();
  }
  return null;
}

/* Initialize Firebase. */
getFirebaseConfig().then(config => {
  if (config) {
    firebase.initializeApp(config);
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/icons/notification-icon.png'
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } else {
    console.error("Firebase configuration not found in cache");
  }
});
