import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { axiosSetup } from '@/commons/axios.js'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

import { initializeApp } from 'firebase/app'


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

caches.open('firebase-config-cache').then(cache => {
  cache.put(
    new Request('/firebase-config'),
    new Response(JSON.stringify(firebaseConfig))
  );
});

initializeApp(firebaseConfig)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((res) => console.log(res))
    .catch((error) => {
      console.log('Service worker registration failed:', error);
    });
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
axiosSetup()
app.use(router)

app.mount('#app')
