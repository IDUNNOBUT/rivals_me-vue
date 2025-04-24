import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Define links as constants for use throughout the app
export const LINKS = {
  home: '/',
  auth: '/auth',
  user: '/:id'
};

// Define routes
const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: LINKS.home
  },
  {
    path: LINKS.auth,
    component: () => import('../views/Auth/Auth.vue')
  },
  {
    path: LINKS.home,
    component: () => import('../views/Home/Home.vue')
  },
  {
    path: LINKS.user,
    component: () => import('../views/User/User.vue')
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 