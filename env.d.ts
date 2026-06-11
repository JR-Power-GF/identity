/// <reference types="vite/client" />

/**
 * 环境变量类型声明
 * 在 import.meta.env 上提供类型提示
 */
interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** API 基础路径 */
  readonly VITE_API_BASE_URL: string
  /** 开发服务器端口 */
  readonly VITE_PORT: string
  /** 当前运行环境 */
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
