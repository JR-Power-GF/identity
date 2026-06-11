import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 应用全局状态 Store
 * 管理全局 UI 状态，如侧边栏折叠、主题等
 */
export const useAppStore = defineStore('app', () => {
  /** 侧边栏是否折叠 */
  const sidebarCollapsed = ref(false)

  /** 切换侧边栏状态 */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { sidebarCollapsed, toggleSidebar }
})
