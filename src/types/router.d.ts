import 'vue-router'

/** 扩展路由元信息类型，提供类型提示 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 是否需要登录 */
    requiresAuth?: boolean
  }
}
