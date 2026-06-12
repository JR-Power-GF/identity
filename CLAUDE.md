# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Identify Tool — Vue3 + Vite + TypeScript 工具类前端 Web 项目。

## Commands

```bash
# 开发
npm run dev              # 启动开发服务器（默认 :3000）

# 构建
npm run build            # 生产构建（类型检查 + vite build）
npm run build:dev        # 开发环境构建
npm run build:staging    # 测试环境构建
npm run build:prod       # 生产环境构建

# 代码质量
npm run type-check       # TypeScript 类型检查
npm run lint             # ESLint 检查并自动修复
npm run format           # Prettier 格式化 src/

# 预览
npm run preview          # 预览生产构建产物
```

## Architecture

### 技术栈

Vue3 (Composition API + `<script setup>`) · Vite 6 · TypeScript 5 · Vue Router 4 · Pinia 3 · Axios · Element Plus · ECharts

### 目录结构

```
src/
├── api/          # API 模块（按业务拆分文件，统一从 index.ts 导出）
├── assets/
│   └── styles/   # CSS 变量 → Reset → 工具类（variables.css → reset.css → global.css → index.css）
├── components/
│   └── common/   # 全局通用组件
├── composables/  # Vue 组合式函数（useLoading 等）
├── layouts/      # 布局组件
├── router/       # 路由配置 + 守卫（静态路由在此注册）
├── stores/       # Pinia Store（Setup Store 风格，使用函数式 defineStore）
├── types/        # 全局类型声明
├── utils/        # 工具函数 + Axios 封装（src/utils/http.ts）
└── views/        # 页面视图（每个页面一个文件夹，含 index.vue）
```

### UI 组件库 & 图表

- **Element Plus** — 全局注册，直接使用 `el-*` 组件
- **@element-plus/icons-vue** — 图标库
- **ECharts** — 通过 `src/composables/useECharts.ts` 封装使用

### 关键约定

- **路径别名**: `@/` 映射到 `src/`，在 tsconfig 和 vite.config 中已同步配置
- **Axios 封装**: `src/utils/http.ts` 导出 `http` 单例，包含 Token 自动注入、401 跳转、统一错误提示。API 模块在 `src/api/` 下按业务拆分
- **Store 风格**: 统一使用 Setup Store（`defineStore('name', () => { ... })`），不用 Options Store
- **样式体系**: 全局 CSS 变量定义在 `variables.css`，组件使用 scoped `<style>` + CSS 变量。禁止使用 Tailwind CSS
- **路由懒加载**: 使用 `loadView()` 辅助函数，视图文件约定为 `views/<page>/index.vue`
- **环境变量**: 通过 `import.meta.env.VITE_*` 访问，类型声明在 `env.d.ts`

### Figma 设计稿转页面规范

当通过 Figma MCP 获取设计稿后，必须按以下规范输出代码：

- **禁止输出 React / JSX 代码**，所有页面必须使用 Vue3 + `<script setup lang="ts">`
- **禁止使用 Tailwind CSS**，样式使用 Element Plus 组件 + scoped `<style>` + CSS 变量
- **组件选择**: 优先使用 Element Plus 组件（`el-button`、`el-table`、`el-form` 等），避免手写已有组件
- **页面文件**: 放在 `src/views/<page>/index.vue`，如需子组件放同级目录
- **API 调用**: 数据请求放 `src/api/` 模块，页面通过 composable 调用
- **设计令牌**: 颜色、间距、字体等统一使用 `variables.css` 中的 CSS 变量，不要硬编码

### 环境切换

| 命令 | `.env` 文件 | 用途 |
|------|------------|------|
| `npm run dev` | `.env.development` | 本地开发 |
| `npm run build:staging` | `.env.staging` | 测试/预发布 |
| `npm run build:prod` | `.env.production` | 生产 |

### 响应结构约定

后端 API 统一返回 `{ code, data, message }`，已在 `src/utils/http.ts` 的 `ApiResponse<T>` 接口中定义。业务 code 非 0/200 会自动 reject。
