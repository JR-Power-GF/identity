import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

/**
 * 使用 import.meta.glob 收集所有视图组件
 * Vite 在构建时会自动将匹配的文件打包为懒加载 chunk
 */
const viewModules = import.meta.glob<{ default: unknown }>(['../views/**/*.vue'])

/**
 * 路由懒加载辅助函数
 * 通过 glob 映射拿到匹配的动态导入函数，规避 Vite 动态 import 的层级限制
 */
const loadView = (path: string) => {
  const moduleKey = Object.keys(viewModules).find(
    (key) => key.endsWith(`${path}.vue`),
  )
  if (!moduleKey) {
    throw new Error(`[Router] 未找到视图文件: ${path}.vue`)
  }
  return viewModules[moduleKey]
}

/** 静态路由（无需权限） */
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: loadView('home/index'),
    meta: { title: '首页' },
  },
  {
    path: '/about',
    name: 'About',
    component: loadView('about/index'),
    meta: { title: '关于' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  // 路由切换时滚动到顶部
  scrollBehavior: () => ({ top: 0 }),
})

/**
 * 全局前置守卫
 * - 设置页面标题
 * - 后续可扩展权限校验逻辑
 */
router.beforeEach((to) => {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'App'
  document.title = to.meta.title ? `${to.meta.title} - ${appTitle}` : appTitle
})

export default router
