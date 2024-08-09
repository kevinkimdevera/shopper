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
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            name: 'categories.index',
            component: () => import('@pages/Categories/Index.vue')
          },
          {
            path: ':id',
            name: 'categories.view',
            props: true,
            component: () => import('@pages/Categories/View.vue')
          }
        ]
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            name: 'products.index',
            component: () => import('@pages/Products/Index.vue')
          }
        ]
      },
      {
        path: 'manage',
        children: [
          {
            path: '',
            name: 'manage.index',
            component: () => import('@pages/Manage/Index.vue')
          },
          {
            path: ':id',
            name: 'manage.show',
            props: true,
            component: () => import('@pages/Manage/View.vue')
          }
        ]
      }
    ]
  }
];

// Base URL From env
const baseURL = import.meta.env.VITE_APP_BASE_URL;

const router = createRouter({
  history: createWebHistory(baseURL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

export default router;