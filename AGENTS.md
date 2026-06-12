# AI Video Detector SaaS Frontend Rules

## Product

- Product name: VeriFrame AI.
- Product type: AI Video Detector SaaS.
- Goal: Implement a high-fidelity desktop web prototype from the Figma design.
- No backend is required. 不用
- Use realistic mock data only.

## Tech Stack

- Vue 3 (Composition API + `<script setup lang="ts">`).
- TypeScript 5.
- Vite 6.
- Vue Router 4（懒加载）.
- Pinia 3（Setup Store 风格）.
- Axios（封装在 `src/utils/http.ts`，导出 `http` 单例）.
- Element Plus for UI components and icons.
- ECharts for charts（封装在 `src/composables/useECharts.ts`）.
- Custom CSS / scoped CSS for custom styles.
- **Do not use Tailwind CSS.**
- **Do not output React / JSX code.**

## Directory Structure

```
src/
├── api/          # API 模块（按业务拆分，统一从 index.ts 导出）
├── assets/
│   ├── icons/    # SVG 图标
│   ├── images/   # 图片
│   └── styles/   # variables.css → reset.css → global.css → index.css
├── components/
│   └── common/   # 全局通用组件
├── composables/  # 组合式函数（useLoading, useECharts 等）
├── layouts/      # 布局组件
├── router/       # 路由配置 + 守卫
├── stores/       # Pinia Store（Setup Store 风格）
├── types/        # 全局类型声明
├── utils/        # 工具函数 + Axios 封装（http.ts）
└── views/        # 页面视图（views/<page>/index.vue）
```

## Commands

```bash
npm run dev              # 开发服务器 :3000
npm run build            # 生产构建（类型检查 + vite build）
npm run build:staging    # 测试环境构建
npm run build:prod       # 生产环境构建
npm run type-check       # TS 类型检查
npm run lint             # ESLint 检查 + 自动修复
npm run format           # Prettier 格式化 src/
```

## Coding Conventions

### MUST（必须遵循）

- 使用 Vue3 `<script setup lang="ts">` + Composition API，不使用 Options API.
- 使用 Setup Store（`defineStore('name', () => { ... })`），不使用 Options Store.
- 样式使用 scoped `<style>` + 项目 CSS 变量（定义在 `variables.css`）.
- 路径别名 `@/` 映射到 `src/`.
- API 模块按业务拆分在 `src/api/`，统一从 `index.ts` 导出.
- 页面文件放在 `src/views/<page>/index.vue`.
- 路由使用 `loadView()` 懒加载.
- 环境变量通过 `import.meta.env.VITE_*` 访问.
- 后端响应统一为 `{ code: number, data: T, message: string }`.
- 优先使用 Element Plus 组件（`el-button`、`el-table`、`el-form` 等）.
- 图表使用 `useECharts` composable，不直接创建 ECharts 实例.
- HTTP 请求使用 `src/utils/http.ts` 导出的 `http` 单例.

### MUST NOT（禁止）

- ❌ 禁止输出 React / JSX 代码.
- ❌ 禁止使用 Tailwind CSS 或其他原子化 CSS 框架.
- ❌ 禁止使用 Options API.
- ❌ 禁止在组件中硬编码颜色值，使用 CSS 变量.
- ❌ 禁止直接使用 `axios`，必须通过 `@/utils/http` 的 `http` 实例.
- ❌ 禁止在 `.vue` 文件中使用 `class` 风格组件.
- ❌ 禁止使用截图作为整个 UI 的背景.

## Figma MCP Workflow

- Use Figma MCP in read-only mode unless the user explicitly asks to edit Figma.
- Do not create Figma pages.
- Do not modify the Figma file.
- For Figma implementation tasks, first read Figma metadata, variables, screenshots, and design context.
- If a Figma Section is too large, inspect metadata first, then fetch design context screen by screen.
- Treat Figma as the visual source of truth.
- Convert Figma structure into clean reusable Vue 3 components using Element Plus.
- Use editable HTML/CSS/Vue UI, not screenshot backgrounds.

## Figma Design → Vue3 Code Rules

当从 Figma 设计稿生成页面时：

1. 获取设计稿的结构、颜色、间距、组件信息.
2. 用 Vue3 + Element Plus 重写，不输出 React.
3. 颜色、间距映射到 `variables.css` 中的 CSS 变量.
4. 优先用 Element Plus 组件替代手写 UI.
5. 页面放 `src/views/<page>/index.vue`，子组件放同级目录.
6. 数据请求放 `src/api/` 模块.

## Layout Rules

- Desktop only.
- Target desktop width: 1440px.
- Do not implement mobile layouts.
- Do not implement tablet layouts.
- Prefer flexbox/grid and reusable layout components.
- Avoid absolute positioning unless necessary for a small decorative element.
- Use an 8px spacing system.
- Use cards, subtle shadows, rounded corners, and clean dashboard spacing.

## Visual Style

- Modern B2B SaaS.
- White and light gray backgrounds.
- Deep navy/slate primary color.
- Blue-violet accent.
- Risk colors:
  - Low risk: green.
  - Medium risk: amber.
  - High risk: red.
- Clean typography, likely Inter/system sans.
- Unify styles based on Element Plus default specification.
- Override custom styles via scoped CSS to match the Figma design.

## Components

Create reusable Vue 3 components, encapsulating Element Plus base components where applicable and unifying the design specification for:

- Button, encapsulating Element Plus Button.
- Input, encapsulating Element Plus Input.
- Card, encapsulating Element Plus Card.
- Badge, encapsulating Element Plus Badge.
- RiskBadge.
- RiskScore.
- Sidebar.
- TopHeader.
- AppShell.
- MetricCard.
- DataTable, encapsulating Element Plus Table.
- UploadDropzone, encapsulating Element Plus Upload.
- VideoPlaceholder.
- EvidenceTimeline, encapsulating Element Plus Timeline.
- BillingPlanCard.
- SettingsSection.
- ApiKeyRow.

## Screens

Implement:

- Landing page.
- Sign in.
- Sign up.
- Dashboard overview.
- Upload video.
- Upload processing state.
- Analysis results report.
- Video evidence timeline.
- Reports history table.
- Usage and billing.
- Settings.
- API keys / developer settings.

## Code Style

- Prettier：无分号、单引号、2 空格缩进、尾逗号、行宽 100.
- ESLint：Vue Essential + TypeScript + Prettier.
- 组件命名：PascalCase.
- 文件命名：kebab-case 或 PascalCase（.vue 文件）.

## Validation

- Run `npm run build` after meaningful changes.
- Fix all TypeScript and build errors.
- Summarize changed files after each task.
