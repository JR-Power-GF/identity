import { http } from '@/utils/http'

/** 用户信息类型 */
export interface UserInfo {
  id: number
  username: string
  avatar: string
}

/** 用户相关 API 模块 */
export const userApi = {
  /** 获取当前用户信息 */
  getInfo() {
    return http.get<UserInfo>('/user/info')
  },

  /** 登录 */
  login(data: { username: string; password: string }) {
    return http.post<{ token: string }>('/auth/login', data)
  },

  /** 登出 */
  logout() {
    return http.post('/auth/logout')
  },
}
