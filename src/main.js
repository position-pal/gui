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

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
axiosSetup()
app.use(router)

app.mount('#app')
