import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { UserInfo } from '@/api/user'

/**
 * 用户状态 Store
 * 管理登录态、用户信息
 */
export const useUserStore = defineStore('user', () => {
  /** 用户信息 */
  const userInfo = ref<UserInfo | null>(null)
  /** 登录 Token */
  const token = ref<string>(localStorage.getItem('token') || '')

  /** 是否已登录 */
  const isLoggedIn = computed(() => !!token.value)

  /** 设置 Token 并持久化 */
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  /** 设置用户信息 */
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  /** 清除登录态 */
  function clearAuth() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { userInfo, token, isLoggedIn, setToken, setUserInfo, clearAuth }
})

/** 需要从 vue 引入 computed */
import { computed } from 'vue'
