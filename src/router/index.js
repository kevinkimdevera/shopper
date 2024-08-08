// Router
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@pages/Home.vue')
      }
    ]
  }
];

// Base URL From env
const baseURL = import.meta.env.VITE_APP_BASE_URL;

console.log(baseURL);

const router = createRouter({
  history: createWebHistory(baseURL),
  routes,
});

export default router;