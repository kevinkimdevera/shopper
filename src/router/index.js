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

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;