import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 全局样式（变量 → reset → 工具类）
import '@/assets/styles/index.css'

const app = createApp(App)

// 状态管理
app.use(createPinia())

// 路由
app.use(router)

// 挂载
app.mount('#app')
