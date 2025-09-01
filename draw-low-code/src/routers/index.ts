/**
 * @name: 名称
 * @description: TODO 路由
 * @author: liudingbang
 * @date: 2025/9/1 14:38
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/pages/draw/DrawLowCode.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
