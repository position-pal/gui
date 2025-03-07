importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js')

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/notification-icon.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
