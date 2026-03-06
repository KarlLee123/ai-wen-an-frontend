// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 先定义 routes 数组
const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('../App.vue'),
  },
  {
    path: '/wenan',
    name: '文案生成',
    component: () => import('../views/WenAn.vue'),
  },
]

// 再创建 router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
