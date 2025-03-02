import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import axios from 'axios'
import firebaseData from '../firebase-config.json'


const firebaseConfig = {
  apiKey: firebaseData.credentials.apiKey,
  authDomain: firebaseData.credentials.authDomain,
  projectId: firebaseData.credentials.projectId,
  storageBucket: firebaseData.credentials.storageBucket,
  messagingSenderId: firebaseData.credentials.messagingSenderId,
  appId: firebaseData.credentials.appId
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export async function askForNotificationPermission(userId) {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: firebaseData.vapidKey
      })

      await saveTokenToBackend(userId, token)

      return token
    }
  } catch (error) {
    console.error('Error getting notification permission:', error)
  }
}


export function setupForegroundNotifications(notificationComponent) {
  onMessage(messaging, (payload) => {
    notificationComponent.show({
      title: payload.notification.title,
      body: payload.notification.body
    })
  })
}

async function saveTokenToBackend(userId, token) {
  await axios.post("api/notifications/register", { user: userId, token: token })
}
