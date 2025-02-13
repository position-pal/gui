import {
  createRouter,
  createWebHistory
} from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import Chat from '@/views/Chat.vue';
import NotFound from '@/views/NotFound.vue';

// add routes map, chat, profile, login
const routes = [{
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: NotFound,
  },
  {
    path: '/login',
    name: 'Login',
    component: NotFound,
  },
  {
    path: "/map",
    name: "Map",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes,
});

export default router;
