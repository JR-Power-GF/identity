# Vue3 工具类前端项目架构模板

> 基于当前 identity 项目整理，可直接复用于新项目初始化。

---

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue 3 | ^3.5 | Composition API + `<script setup>` |
| 语言 | TypeScript | ~5.8 | 全量 TS，类型安全 |
| 构建 | Vite 6 | ^6.3 | 开发服务器 + 生产构建 |
| 路由 | Vue Router 4 | ^4.5 | 懒加载 + 守卫 |
| 状态 | Pinia 3 | ^3.0 | Setup Store 风格 |
| 请求 | Axios | ^1.9 | 封装拦截器、Token、错误处理 |
| UI 库 | Element Plus | latest | 组件 + 图标（@element-plus/icons-vue） |
| 图表 | ECharts | latest | 封装为 useECharts composable |
| 代码检查 | ESLint 9 | ^9.22 | Vue + TS + Prettier 规则 |
| 格式化 | Prettier | 3.5 | 统一代码风格 |

---

## 二、目录结构

```
project/
├── docs/                          # 项目文档
├── public/                        # 静态资源（不经过 Vite 处理）
├── src/
│   ├── api/                       # API 模块
│   │   ├── index.ts               #   统一出口
│   │   └── user.ts                #   按业务拆分（示例）
│   ├── assets/
│   │   ├── icons/                 # SVG 图标
│   │   ├── images/                # 图片资源
│   │   └── styles/
│   │       ├── variables.css      #   CSS 变量（设计令牌）
│   │       ├── reset.css          #   浏览器样式重置
│   │       ├── global.css         #   全局工具类
│   │       └── index.css          #   样式入口（按序引入）
│   ├── components/
│   │   └── common/                # 全局通用组件
│   ├── composables/               # 组合式函数
│   │   ├── useLoading.ts          #   Loading 状态管理
│   │   └── useECharts.ts          #   ECharts 封装
│   ├── layouts/                   # 布局组件
│   ├── router/
│   │   └── index.ts               # 路由配置 + 守卫
│   ├── stores/                    # Pinia Store
│   │   ├── index.ts               #   统一出口
│   │   ├── app.ts                 #   全局 UI 状态
│   │   └── user.ts                #   用户登录态
│   ├── types/                     # 全局类型声明
│   │   └── router.d.ts            #   路由 meta 类型扩展
│   ├── utils/
│   │   ├── http.ts                #   Axios 封装（导出 http 单例）
│   │   └── index.ts               #   通用工具函数
│   ├── views/                     # 页面视图
│   │   ├── home/
│   │   │   └── index.vue          #   首页
│   │   └── about/
│   │       └── index.vue          #   关于页
│   ├── App.vue                    # 根组件
│   ├── main.ts                    # 应用入口
│   └── vite-env.d.ts              # Vite 环境类型
├── .env                           # 通用环境变量
├── .env.development               # 开发环境
├── .env.staging                   # 测试环境
├── .env.production                # 生产环境
├── .gitignore
├── .prettierrc.json               # Prettier 配置
├── CLAUDE.md                      # AI 开发指南
├── env.d.ts                       # 环境变量类型声明
├── eslint.config.js               # ESLint Flat Config
├── index.html                     # HTML 入口
├── package.json
├── tsconfig.json                  # TS 配置入口（引用子配置）
├── tsconfig.app.json              # 应用 TS 配置（含路径别名）
├── tsconfig.node.json             # Node 端 TS 配置
├── vite.config.ts                 # Vite 配置
└── README.md
```

---

## 三、配置文件模板

### 3.1 package.json

```json
{
  "name": "project-name",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",
    "type-check": "vue-tsc --build",
    "lint": "eslint . --fix",
    "format": "prettier --write src/"
  },
  "dependencies": {
    "axios": "^1.9.0",
    "element-plus": "latest",
    "@element-plus/icons-vue": "latest",
    "echarts": "latest",
    "pinia": "^3.0.2",
    "vue": "^3.5.13",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@tsconfig/node22": "^22.0.1",
    "@types/node": "^22.15.0",
    "@vitejs/plugin-vue": "^5.2.3",
    "@vue/eslint-config-prettier": "^10.2.0",
    "@vue/eslint-config-typescript": "^14.5.0",
    "eslint": "^9.22.0",
    "eslint-plugin-vue": "~10.0.0",
    "npm-run-all2": "^7.0.2",
    "prettier": "3.5.3",
    "typescript": "~5.8.0",
    "vite": "^6.3.0",
    "vue-tsc": "^2.2.0"
  }
}
```

### 3.2 vite.config.ts

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            axios: ['axios'],
          },
        },
      },
    },
  }
})
```

### 3.3 tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.app.json" }
  ]
}
```

### 3.4 tsconfig.app.json

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3.5 tsconfig.node.json

```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "nightwatch.conf.*",
    "playwright.config.*"
  ],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

### 3.6 eslint.config.js

```javascript
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import prettierConfig from '@vue/eslint-config-prettier'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  prettierConfig,
]
```

### 3.7 .prettierrc.json

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "endOfLine": "auto"
}
```

### 3.8 .gitignore

```gitignore
# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules

# Build output
dist

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files with secrets
.env.local
.env.*.local

# TypeScript cache
*.tsbuildinfo
```

### 3.9 环境变量文件

**`.env`** — 所有环境通用

```env
VITE_APP_TITLE=项目名称
VITE_APP_ENV=base
```

**`.env.development`**

```env
NODE_ENV=development
VITE_APP_ENV=development
VITE_PORT=3000
VITE_API_BASE_URL=http://localhost:8080
```

**`.env.staging`**

```env
VITE_APP_ENV=staging
VITE_PORT=3000
VITE_API_BASE_URL=https://staging-api.example.com
```

**`.env.production`**

```env
VITE_APP_ENV=production
VITE_PORT=3000
VITE_API_BASE_URL=https://api.example.com
```

### 3.10 env.d.ts — 环境变量类型声明

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_PORT: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 四、核心模块模板

### 4.1 main.ts — 应用入口

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

// 全局样式（变量 → reset → 工具类）
import '@/assets/styles/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.mount('#app')
```

### 4.2 utils/http.ts — Axios 封装

```typescript
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

/** 后端统一响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

interface CreateHttpOptions {
  baseURL?: string
  timeout?: number
}

class Http {
  private instance: AxiosInstance

  constructor(options: CreateHttpOptions = {}) {
    this.instance = axios.create({
      baseURL: options.baseURL || import.meta.env.VITE_API_BASE_URL,
      timeout: options.timeout || 15000,
      headers: { 'Content-Type': 'application/json' },
    })
    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  /** 请求拦截器：自动附加 Token */
  private setupRequestInterceptor(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
  }

  /** 响应拦截器：统一处理业务状态码与网络错误 */
  private setupResponseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message } = response.data
        if (code === 0 || code === 200) {
          return response.data as unknown as AxiosResponse
        }
        if (code === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
          return Promise.reject(new Error('登录已过期，请重新登录'))
        }
        return Promise.reject(new Error(message || '请求失败'))
      },
      (error) => {
        const msg =
          error.code === 'ECONNABORTED'
            ? '请求超时，请稍后重试'
            : error.response?.status === 404
              ? '请求资源不存在'
              : error.response?.status === 500
                ? '服务器内部错误'
                : error.message || '网络异常'
        console.error(`[HTTP Error] ${msg}`)
        return Promise.reject(new Error(msg))
      },
    )
  }

  get<T = unknown>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, { params, ...config })
  }

  post<T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config)
  }

  put<T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config)
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config)
  }
}

export const http = new Http()
```

### 4.3 router/index.ts — 路由配置

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const viewModules = import.meta.glob<{ default: unknown }>(['../views/**/*.vue'])

/** 路由懒加载辅助 */
const loadView = (path: string) => {
  const moduleKey = Object.keys(viewModules).find((key) => key.endsWith(`${path}.vue`))
  if (!moduleKey) throw new Error(`[Router] 未找到视图文件: ${path}.vue`)
  return viewModules[moduleKey]
}

/** 静态路由 */
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: loadView('home/index'),
    meta: { title: '首页' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
})

/** 全局前置守卫 */
router.beforeEach((to) => {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'App'
  document.title = to.meta.title ? `${to.meta.title} - ${appTitle}` : appTitle
})

export default router
```

### 4.4 types/router.d.ts — 路由 Meta 类型扩展

```typescript
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
  }
}
```

### 4.5 stores/ — Pinia Store 示例

**stores/app.ts** — 全局 UI 状态

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { sidebarCollapsed, toggleSidebar }
})
```

**stores/user.ts** — 用户状态

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const isLoggedIn = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearAuth() {
    token.value = ''
    localStorage.removeItem('token')
  }

  return { token, isLoggedIn, setToken, clearAuth }
})
```

**stores/index.ts** — 统一出口

```typescript
export { useUserStore } from './user'
export { useAppStore } from './app'
```

### 4.6 api/ — API 模块示例

**api/user.ts**

```typescript
import { http } from '@/utils/http'

export interface UserInfo {
  id: number
  username: string
  avatar: string
}

export const userApi = {
  getInfo() {
    return http.get<UserInfo>('/user/info')
  },
  login(data: { username: string; password: string }) {
    return http.post<{ token: string }>('/auth/login', data)
  },
  logout() {
    return http.post('/auth/logout')
  },
}
```

**api/index.ts** — 统一出口

```typescript
export { userApi } from './user'
```

### 4.7 composables/ — 组合式函数

**composables/useLoading.ts**

```typescript
import { ref } from 'vue'

export function useLoading(defaultValue = false) {
  const loading = ref(defaultValue)

  function startLoading() { loading.value = true }
  function endLoading() { loading.value = false }

  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    startLoading()
    try {
      return await fn()
    } finally {
      endLoading()
    }
  }

  return { loading, startLoading, endLoading, withLoading }
}
```

**composables/useECharts.ts**

```typescript
import { ref, onMounted, onBeforeUnmount, shallowRef, type Ref } from 'vue'
import * as echarts from 'echarts'

export function useECharts(elRef: Ref<HTMLElement | undefined>) {
  const chartInstance = shallowRef<echarts.ECharts>()
  const loading = ref(false)

  function initChart() {
    if (!elRef.value) return
    chartInstance.value = echarts.init(elRef.value)
  }

  function setOption(option: echarts.EChartsOption) {
    if (!chartInstance.value) initChart()
    chartInstance.value?.setOption(option, true)
  }

  function showLoading() {
    loading.value = true
    chartInstance.value?.showLoading()
  }

  function hideLoading() {
    loading.value = false
    chartInstance.value?.hideLoading()
  }

  function handleResize() {
    chartInstance.value?.resize()
  }

  onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    chartInstance.value?.dispose()
  })

  return { chartInstance, loading, setOption, showLoading, hideLoading, handleResize }
}
```

---

## 五、样式体系

### 5.1 设计令牌（variables.css）

```css
:root {
  /* 主色 */
  --color-primary: #409eff;
  --color-primary-light: #66b1ff;
  --color-primary-dark: #3a8ee6;

  /* 功能色 */
  --color-success: #67c23a;
  --color-warning: #e6a23c;
  --color-danger: #f56c6c;
  --color-info: #909399;

  /* 文字色 */
  --color-text-primary: #303133;
  --color-text-regular: #606266;
  --color-text-secondary: #909399;
  --color-text-placeholder: #c0c4cc;

  /* 背景色 */
  --color-bg-page: #f5f7fa;
  --color-bg-card: #ffffff;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);

  /* 边框 */
  --color-border: #dcdfe6;
  --color-border-light: #e4e7ed;

  /* 字体 */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji';
  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-round: 9999px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* 布局 */
  --header-height: 56px;
  --sidebar-width: 220px;
  --sidebar-collapsed-width: 64px;
}
```

### 5.2 样式加载顺序

```
variables.css → reset.css → global.css → Element Plus 样式 → 组件 scoped 样式
```

> **注意**：Element Plus 样式在 `main.ts` 中引入，加载在 `index.css` 之后，确保可覆盖全局默认值。

### 5.3 CSS Reset（reset.css）

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: var(--font-size-base); -webkit-font-smoothing: antialiased; }
body { font-family: var(--font-family); color: var(--color-text-primary); background-color: var(--color-bg-page); line-height: 1.5; }
a { color: var(--color-primary); text-decoration: none; }
img { max-width: 100%; height: auto; }
ul, ol { list-style: none; }
button, input, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; border: none; background: none; }
```

### 5.4 全局工具类（global.css）

```css
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.page-container { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }
```

---

## 六、关键约定

| 约定 | 说明 |
|------|------|
| **路径别名** | `@/` → `src/`，tsconfig 和 vite.config 同步配置 |
| **API 模块** | 按 `src/api/<业务>.ts` 拆分，统一从 `index.ts` 导出 |
| **Store 风格** | Setup Store（`defineStore('name', () => {...})`），不用 Options Store |
| **视图文件** | `views/<page>/index.vue`，路由用 `loadView()` 懒加载 |
| **样式规范** | 全局 CSS 变量 + 组件 scoped `<style>`，不使用 CSS Modules |
| **响应结构** | 后端统一 `{ code, data, message }`，`http.ts` 中定义 `ApiResponse<T>` |
| **环境变量** | `import.meta.env.VITE_*`，类型声明在 `env.d.ts` |
| **Composable** | `use` 前缀命名，放 `src/composables/`，返回 ref 和方法 |

---

## 七、新建项目步骤

```bash
# 1. 创建项目目录
mkdir my-project && cd my-project

# 2. 初始化 package.json（复制上面的模板内容）
# 3. 按目录结构创建文件夹
mkdir -p src/{api,assets/{icons,images,styles},components/common,composables,layouts,router,stores,types,utils,views/home}

# 4. 复制模板文件（参考上面各模块）
#    - 配置文件：vite.config.ts, tsconfig.*, eslint.config.js, .prettierrc.json, .gitignore, .env*
#    - 核心模块：main.ts, App.vue, router/index.ts, utils/http.ts
#    - 样式：variables.css, reset.css, global.css, index.css
#    - 类型：env.d.ts, vite-env.d.ts, types/router.d.ts

# 5. 安装依赖
npm install

# 6. 启动开发
npm run dev

# 7. 初始化 Git
git init && git add . && git commit -m "init: 项目初始化"
```
