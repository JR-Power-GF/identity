import { ref } from 'vue'

/**
 * 通用 loading 状态管理 Composable
 * 适用于接口请求、异步操作的加载状态追踪
 */
export function useLoading(defaultValue = false) {
  const loading = ref(defaultValue)

  /** 开始加载 */
  function startLoading() {
    loading.value = true
  }

  /** 结束加载 */
  function endLoading() {
    loading.value = false
  }

  /**
   * 包裹异步函数，自动管理 loading 状态
   * @param fn 异步函数
   */
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
