import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging'
import axios from 'axios'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export async function askForNotificationPermission(userId) {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      })
      await saveTokenToBackend(userId, token)
      return token
    }
  } catch (error) {
    console.error('Error getting notification permission:', error)
  }
}

export async function deleteNotificationToken(userId) {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    })
    if (token) {
      await axios.post("api/notifications/invalidate", { user: userId, token: token })
      await deleteToken(messaging)
    }
  } catch (error) {
    console.error('Error deleting notification token:', error)
  }
}

export function setupForegroundNotifications(notificationComponent) {
  onMessage(messaging, (payload) => {
    notificationComponent.show({
      title: payload.notification.title,
      body: payload.data.body
    }, { reloadOnClose: true })
  })
}

async function saveTokenToBackend(userId, token) {
  await axios.post("api/notifications/register", { user: userId, token: token })
}
