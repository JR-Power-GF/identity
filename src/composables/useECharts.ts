import { ref, onMounted, onBeforeUnmount, shallowRef, type Ref } from 'vue'
import * as echarts from 'echarts'

/**
 * ECharts 组合式函数
 * @param elRef - 挂载图表的 DOM 元素 ref
 */
export function useECharts(elRef: Ref<HTMLElement | undefined>) {
  const chartInstance = shallowRef<echarts.ECharts>()
  const loading = ref(false)

  /** 初始化图表实例 */
  function initChart() {
    if (!elRef.value) return
    chartInstance.value = echarts.init(elRef.value)
  }

  /** 设置图表配置 */
  function setOption(option: echarts.EChartsOption) {
    if (!chartInstance.value) initChart()
    chartInstance.value?.setOption(option, true)
  }

  /** 显示/隐藏 loading */
  function showLoading() {
    loading.value = true
    chartInstance.value?.showLoading()
  }

  function hideLoading() {
    loading.value = false
    chartInstance.value?.hideLoading()
  }

  /** 响应窗口大小变化 */
  function handleResize() {
    chartInstance.value?.resize()
  }

  onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    chartInstance.value?.dispose()
  })

  return {
    chartInstance,
    loading,
    setOption,
    showLoading,
    hideLoading,
    handleResize,
  }
}
