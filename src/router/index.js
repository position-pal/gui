import {
  createRouter,
  createWebHistory
} from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ChatPage from '@/views/ChatPage.vue';
import NotFound from '@/views/NotFound.vue';
import LoginPage from '@/views/LoginPage.vue';
import MapPage from '@/views/MapPage.vue';
import GroupPage from '@/views/GroupPage.vue';

const routes = [{
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/groups',
    name: 'Groups',
    component: GroupPage,
  },
  {
    path: "/map",
    name: "Map",
    component: MapPage,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: NotFound,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes,
});

export default router;
