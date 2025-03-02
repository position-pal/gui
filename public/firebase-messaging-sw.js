importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js')
import firebaseData from '../src/firebase-config.json'

const firebaseConfig = {
  apiKey: firebaseData.credentials.apiKey,
  authDomain: firebaseData.credentials.authDomain,
  projectId: firebaseData.credentials.projectId,
  storageBucket: firebaseData.credentials.storageBucket,
  messagingSenderId: firebaseData.credentials.messagingSenderId,
  appId: firebaseData.credentials.appId
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/notification-icon.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
