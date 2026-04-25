/**
 * ECharts 按需引入核心模块
 * 只注册项目实际用到的组件，大幅减小打包体积
 */
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
} from 'echarts/components'
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { EChartsType, EChartsOption } from 'echarts'
import { init } from 'echarts/core'

// 注册必须的组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
])

export function useECharts(chartRef: Ref<HTMLElement | null>) {
  const chartInstance = ref<EChartsType | null>(null)

  // 初始化图表
  const initChart = () => {
    if (chartRef.value) {
      chartInstance.value = init(chartRef.value)
    }
  }

  // 设置图表配置
  const setOption = (option: EChartsOption) => {
    if (chartInstance.value) {
      chartInstance.value.setOption(option)
    }
  }

  // 自适应窗口大小
  const resizeChart = () => {
    chartInstance.value?.resize()
  }

  onMounted(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeChart)
    chartInstance.value?.dispose()
    chartInstance.value = null
  })

  return {
    chartInstance,
    setOption,
    resizeChart,
  }
}
