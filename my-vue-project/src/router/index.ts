import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/user/UserView.vue'),
    },
    {
      path: '/on-updated-demo',
      name: 'onUpdatedDemo',
      component: () => import('../views/OnUpdatedDemo.vue'),
    },
  ],
})

export default router
