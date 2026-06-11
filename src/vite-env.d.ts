/// <reference types="vite/client" />

/**
 * Vue 组件类型声明
 * 让 TypeScript 识别 .vue 文件
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
