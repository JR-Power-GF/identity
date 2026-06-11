/**
 * 通用工具函数
 */

/**
 * 防抖函数
 * @param fn 要防抖的函数
 * @param delay 延迟时间 (ms)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 * @param fn 要节流的函数
 * @param interval 间隔时间 (ms)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval = 300,
): (...args: Parameters<T>) => void {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn(...args)
    }
  }
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式模板，默认 YYYY-MM-DD HH:mm:ss
 */
export function formatDate(
  date: Date | number | string,
  format = 'YYYY-MM-DD HH:mm:ss',
): string {
  const d = new Date(date)
  const pad = (n: number) => String(n).padStart(2, '0')

  const tokens: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  }

  let result = format
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(token, value)
  }
  return result
}

/**
 * 深拷贝（结构化克隆）
 * 现代浏览器推荐使用 structuredClone
 */
export function deepClone<T>(obj: T): T {
  return structuredClone(obj)
}

/**
 * 从 URL 中解析查询参数
 */
export function parseQuery(url: string): Record<string, string> {
  const search = url.includes('?') ? url.split('?')[1] : ''
  return Object.fromEntries(new URLSearchParams(search))
}
