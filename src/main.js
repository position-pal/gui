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
import firebaseData from '../src/firebase-config.json'

const firebaseConfig = {
  apiKey: firebaseData.credentials.apiKey,
  authDomain: firebaseData.credentials.authDomain,
  projectId: firebaseData.credentials.projectId,
  storageBucket: firebaseData.credentials.storageBucket,
  messagingSenderId: firebaseData.credentials.messagingSenderId,
  appId: firebaseData.credentials.appId
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
