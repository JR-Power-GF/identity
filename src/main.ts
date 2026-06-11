import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

// 全局样式（变量 → reset → 工具类）
import '@/assets/styles/index.css'

const app = createApp(App)

// 状态管理
app.use(createPinia())

// UI 组件库
app.use(ElementPlus)

// 路由
app.use(router)

// 挂载
app.mount('#app')
