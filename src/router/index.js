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
import { getLoggedInUser } from '@/scripts/user.js'

const routes = [{
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/groups',
    name: 'Groups',
    component: GroupPage,
    meta: {requiresAuth: true},
  },
  {
    path: "/map/:groupId",
    name: "Map",
    component: MapPage,
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/chat/:groupId',
    name: 'Chat',
    component: ChatPage,
    meta: {requiresAuth: true},
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {requiresAuth: true},
  },
  {
    path: "/groups/:groupId",
    name: "UpdateGroup",
    component: UpdateGroup,
    props: true,
    meta: {requiresAuth: true},
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const user = getLoggedInUser();
    if (!user) {
      next({ name: 'LoginPage' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
