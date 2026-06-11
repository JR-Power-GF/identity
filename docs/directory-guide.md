# 项目目录结构说明

> 本文档详细解释每个文件夹的职责、应存放的内容以及实际开发中的作用。

---

## 📂 顶层配置文件

| 文件 | 作用 |
|------|------|
| `package.json` | 项目元信息、依赖声明、npm scripts 定义 |
| `vite.config.ts` | Vite 构建配置：路径别名、开发代理、打包分包策略 |
| `tsconfig.json` | TypeScript 项目引用入口，串联 app 和 node 两个子配置 |
| `tsconfig.app.json` | 业务代码 TS 配置，定义 `@/` 路径别名 |
| `tsconfig.node.json` | Vite/Node 侧 TS 配置（构建工具本身用） |
| `eslint.config.js` | ESLint flat config，集成 Vue + TS + Prettier 规则 |
| `.prettierrc.json` | Prettier 格式化规则（分号、引号、缩进等） |
| `index.html` | SPA 唯一 HTML 入口，Vite 以此为入口注入 JS |
| `CLAUDE.md` | Claude Code 项目指引，供 AI 助手理解项目上下文 |

---

## 📂 src/ — 源码根目录

所有业务代码都在 `src/` 下，通过 Vite 编译和打包。

---

### `src/api/` — 接口请求模块

**职责**：按业务领域拆分 API 调用，与后端接口一一对应。

**应该写什么**：
- 每个业务领域一个文件，如 `user.ts`、`product.ts`、`order.ts`
- 每个文件定义该领域相关的所有接口函数
- 统一从 `index.ts` 导出，页面中只需 `import { userApi } from '@/api'`

**不应该写什么**：
- ❌ 业务逻辑（判断、计算、状态变更）
- ❌ UI 相关代码

**示例**：
```ts
// src/api/product.ts
import { http } from '@/utils/http'

export const productApi = {
  getList(params: { page: number; size: number }) {
    return http.get<ProductList>('/products', params)
  },
  getDetail(id: number) {
    return http.get<ProductDetail>(`/products/${id}`)
  },
}
```

**作用**：接口层与页面解耦，后端接口变更时只需改这里。

---

### `src/assets/` — 静态资源

存放不经编译处理的原始静态文件，Vite 会原样处理。

#### `src/assets/styles/` — 样式文件

| 文件 | 内容 | 作用 |
|------|------|------|
| `variables.css` | CSS 变量（颜色、字体、间距、圆角、阴影） | 设计令牌，全局样式一致性的基础 |
| `reset.css` | 浏览器默认样式重置 | 消除跨浏览器差异 |
| `global.css` | 全局工具类（`.flex-center`、`.ellipsis` 等） | 通用布局/文字截断等快捷 class |
| `index.css` | 样式入口文件，按顺序 import 上面三个 | 在 `main.ts` 中统一引入一次 |

**应该写什么**：
- `variables.css` → 所有设计相关的值（主色、字号、间距），后续换肤也改这里
- `global.css` → 任何页面都可能复用的原子化 class
- 新增全局样式文件时记得在 `index.css` 中 import

**不应该写什么**：
- ❌ 组件特有样式（应写在组件的 `<style scoped>` 中）

#### `src/assets/images/` — 图片资源

**应该写什么**：
- 页面中使用的静态图片：背景图、Banner、占位图、Logo 等
- 格式建议：WebP（优先）> PNG（需要透明度）> JPG（照片类）

**不应该写什么**：
- ❌ 图标类的小 SVG（放 `icons/`）
- ❌ 用户上传的文件（那是后端/CDN 的事）

#### `src/assets/icons/` — 图标资源

**应该写什么**：
- 项目中使用的 SVG 图标
- 第三方图标库的本地图标文件
- 如果使用图标方案（如 unplugin-icons），图标源文件也放这里

**不应该写什么**：
- ❌ 照片类大图（放 `images/`）

---

### `src/components/` — 组件

#### `src/components/common/` — 全局通用组件

**职责**：在多个页面或模块中复用的通用 UI 组件。

**应该写什么**：
- 无业务耦合的纯 UI 组件：按钮封装、弹窗、加载状态、空状态、分页器等
- 每个组件一个文件夹，含 `index.vue` + 同名 TS：

```
common/
├── AppButton/
│   └── index.vue
├── AppModal/
│   └── index.vue
└── AppEmpty/
    └── index.vue
```

**不应该写什么**：
- ❌ 只有某个页面用到的组件（放对应 `views/` 下的 `components/`）
- ❌ 包含具体业务逻辑的组件

---

### `src/composables/` — 组合式函数（Hooks）

**职责**：提取可复用的有状态逻辑，供多个组件共享。

**应该写什么**：
- 以 `use` 开头的函数，封装可复用的响应式逻辑
- 每个 composable 一个文件

**已有**：
- `useLoading.ts` — 通用 loading 状态管理

**可扩展示例**：
```
composables/
├── useLoading.ts      # 加载状态
├── usePermission.ts   # 权限判断
├── usePagination.ts   # 分页逻辑
└── useClipboard.ts    # 剪贴板操作
```

**与 utils/ 的区别**：
- `utils/` → 无状态的纯函数（防抖、格式化）
- `composables/` → 有状态的响应式逻辑（ref、computed、watch）

---

### `src/layouts/` — 布局组件

**职责**：定义页面的整体骨架布局。

**应该写什么**：
- 不同页面类型对应的布局壳：默认布局、空白布局、后台管理布局等

**示例**：
```
layouts/
├── DefaultLayout.vue   # 带头部导航 + 内容区
├── BlankLayout.vue     # 无导航，全屏（如登录页）
└── AdminLayout.vue     # 侧边栏 + 顶栏 + 内容区
```

**作用**：路由配置中按 `meta.layout` 决定使用哪个布局，避免每个页面重复写头部/侧边栏。

---

### `src/router/` — 路由配置

**职责**：管理所有页面路由、路由守卫、权限控制。

**应该写什么**：
- `index.ts` — 路由定义 + 守卫（已有）
- 静态路由（无需权限的页面）直接写在 `constantRoutes` 中
- 需要权限的动态路由可后续通过 `addRoute()` 实现

**已有功能**：
- 路由懒加载（`loadView` 辅助函数）
- 全局前置守卫（自动设置页面标题）
- `RouteMeta` 类型扩展（`title`、`requiresAuth`）

**约定**：
- 页面文件统一放在 `src/views/<page-name>/index.vue`
- 路由 `name` 使用 PascalCase

---

### `src/stores/` — 状态管理（Pinia）

**职责**：集中管理跨组件共享的应用状态。

**应该写什么**：
- 每个业务领域一个 Store 文件
- 统一使用 **Setup Store 风格**（`defineStore('name', () => { ... })`）
- 从 `index.ts` 统一导出

**已有**：
| Store | 管理内容 |
|-------|---------|
| `user.ts` | 用户信息、登录态、Token 持久化 |
| `app.ts` | 全局 UI 状态（侧边栏折叠等） |

**可扩展示例**：
```
stores/
├── index.ts       # 统一导出
├── user.ts        # 用户状态
├── app.ts         # 应用 UI 状态
├── permission.ts  # 权限/菜单状态
└── settings.ts    # 用户偏好设置
```

**不应该写什么**：
- ❌ 只在单个组件内使用的状态（直接用组件内 `ref` 即可）
- ❌ 与后端交互的请求逻辑（放 `api/`）

---

### `src/types/` — 全局类型声明

**职责**：存放跨模块复用的 TypeScript 类型定义和 `.d.ts` 声明文件。

**应该写什么**：
- 全局通用的 interface / type
- 第三方库的类型补充声明（`.d.ts`）
- 扩展 Vue/Router 等的类型

**已有**：
- `router.d.ts` — 扩展 `RouteMeta` 类型

**可扩展示例**：
```
types/
├── router.d.ts        # 路由元信息类型
├── global.d.ts        # 全局通用类型
├── env.d.ts           # 环境变量类型（在根目录 env.d.ts 中）
└── api.d.ts           # API 通用响应类型
```

---

### `src/utils/` — 工具函数

**职责**：无副作用的纯函数集合，与 Vue 响应式无关。

**应该写什么**：
- 纯输入 → 纯输出的函数
- 与框架无关的通用逻辑

**已有**：
| 文件 | 内容 |
|------|------|
| `http.ts` | Axios 实例封装、拦截器、统一错误处理 |
| `index.ts` | 防抖、节流、日期格式化、深拷贝、URL 参数解析 |

**可扩展示例**：
```
utils/
├── index.ts       # 通用工具函数
├── http.ts        # Axios 请求封装
├── storage.ts     # localStorage/sessionStorage 封装
└── validator.ts   # 表单校验规则（手机号、邮箱等）
```

---

### `src/views/` — 页面视图

**职责**：每个路由对应的页面级组件。

**应该写什么**：
- 每个页面一个文件夹，内含 `index.vue` 作为入口
- 页面专用的子组件放在同目录的 `components/` 下

**已有**：
```
views/
├── home/
│   └── index.vue          # 首页
└── about/
    └── index.vue          # 关于页
```

**可扩展示例**：
```
views/
├── home/
│   ├── index.vue
│   └── components/        # 首页专属子组件
│       └── HeroBanner.vue
├── login/
│   └── index.vue          # 登录页
├── dashboard/
│   ├── index.vue          # 仪表盘
│   └── components/
│       └── StatsCard.vue
└── NotFound.vue           # 404 页面
```

**与 components/ 的区别**：
- `views/` → 路由对应的页面入口，通过路由懒加载
- `components/common/` → 跨页面复用的通用组件
- `views/xxx/components/` → 仅某页面使用的私有子组件

---

## 数据流向总览

```
用户操作
  ↓
views/（页面组件）── 调用 ──→ api/（接口函数）
  ↓                              ↓
stores/（状态管理）←── 返回数据 ──→ utils/http.ts（Axios 封装）
  ↓
components/（UI 组件）←── 响应式数据 ──→ composables/（复用逻辑）
  ↓
assets/（样式/图片/图标）
```

> **原则**：页面负责组装，Store 负责状态，API 负责通信，组件负责展示，工具负责辅助。每层各司其职，互不越界。
