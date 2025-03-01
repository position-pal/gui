import {
  createRouter,
  createWebHistory
} from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ChatPage from '@/views/ChatPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import MapPage from '@/views/MapPage.vue';
import GroupPage from '@/views/GroupPage.vue';
import UpdateGroup from '@/views/UpdateGroup.vue'

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
    path: "/map/:groupId",
    name: "Map",
    component: MapPage,
    props: true,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
  {
    path: "/groups/:groupId",
    name: "UpdateGroup",
    component: UpdateGroup,
    props: true,
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
