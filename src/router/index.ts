import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'Home' },
    children: [
      {
        path: '/Info',
        component: () => import('@/views/InfoPage.vue'),
        meta: { title: 'Info' }
      },
      {
        path: '/ItemList',
        component: () => import('@/views/ItemListPage.vue'),
        meta: { title: 'ItemList' }
      },
      {
        path: '/Fund',
        component: () => import('@/views/FundPage.vue'),
        meta: {title:'Fund'}
      },
      {
        path: '/Images',
        component: () => import('@/views/ImagesPage.vue'),
        meta: { title: 'Images' }
      },
      {
        path: '/Comment',
        component: () => import('@/views/CommentPage.vue'),
        meta: { title: 'Comment' }
      },
      {
        path: '/User',
        component: () => import('@/views/UserPage.vue'),
        meta: { title: 'User' }
      },
    ]
  },
  {
    path: '/',
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
