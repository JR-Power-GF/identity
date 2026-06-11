import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

/** 后端统一响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/** 创建 Axios 实例的配置项 */
interface CreateHttpOptions {
  /** 基础 URL，默认取环境变量 */
  baseURL?: string
  /** 超时时间 (ms)，默认 15s */
  timeout?: number
}

/**
 * 封装 Axios 请求类
 * - 统一管理请求 / 响应拦截
 * - 自动携带 Token
 * - 统一错误处理
 */
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

        // 业务状态码判断（根据实际后端约定调整）
        if (code === 0 || code === 200) {
          return response.data as unknown as AxiosResponse
        }

        // 401 Token 过期 → 清除登录态并跳转
        if (code === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
          return Promise.reject(new Error('登录已过期，请重新登录'))
        }

        // 其他业务错误
        return Promise.reject(new Error(message || '请求失败'))
      },
      (error) => {
        // 网络层错误提示
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

  /** GET 请求 */
  get<T = unknown>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, { params, ...config })
  }

  /** POST 请求 */
  post<T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config)
  }

  /** PUT 请求 */
  put<T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config)
  }

  /** DELETE 请求 */
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config)
  }
}

/** 导出全局唯一 HTTP 实例 */
export const http = new Http()
