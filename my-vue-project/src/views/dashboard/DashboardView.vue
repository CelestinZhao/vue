<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { lineChartOption, barChartOption, pieChartOption, radarChartOption } from './chartOptions'
import styles from './DashboardView.module.less'
import StatCard from './StatCard.vue'
import ChartTitleEditor from './ChartTitleEditor.vue'

const $style: { [key: string]: string } = styles

// 当前时间
const currentTime = ref('')
let timer: ReturnType<typeof setInterval> | null = null
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// v-model 双向绑定示例：仪表盘标题（父组件持有数据，子组件编辑）
const dashboardTitle = ref<string>('数据可视化仪表盘')

// 父组件状态：当前选中的卡片 label
const selectedLabel = ref<string>('')
// 父组件状态：来自子组件的通知消息
const noticeMessage = ref<string>('')

// 处理子组件 emit 的 select 事件
const handleStatSelect = (label: string) => {
  if (selectedLabel.value === label) {
    // 再次点击取消选中
    selectedLabel.value = ''
    noticeMessage.value = ''
  } else {
    selectedLabel.value = label
    noticeMessage.value = `你选中了「${label}」卡片`
  }
}

// 统计卡片数据
const stats = [
  {
    label: '总访问量',
    value: '128,560',
    trend: '+12.5%',
    trendUp: true,
    icon: '📊',
    color: 'blue',
  },
  {
    label: '今日销售额',
    value: '¥86,420',
    trend: '+8.3%',
    trendUp: true,
    icon: '💰',
    color: 'green',
  },
  {
    label: '活跃用户',
    value: '23,841',
    trend: '-2.1%',
    trendUp: false,
    icon: '👥',
    color: 'orange',
  },
  { label: '转化率', value: '4.68%', trend: '+0.5%', trendUp: true, icon: '🎯', color: 'red' },
]

// 图表 DOM 引用
const lineChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)
const pieChartRef = ref<HTMLElement | null>(null)
const radarChartRef = ref<HTMLElement | null>(null)

// 初始化各图表
const { setOption: setLineOption } = useECharts(lineChartRef)
const { setOption: setBarOption } = useECharts(barChartRef)
const { setOption: setPieOption } = useECharts(pieChartRef)
const { setOption: setRadarOption } = useECharts(radarChartRef)

onMounted(() => {
  setLineOption(lineChartOption)
  setBarOption(barChartOption)
  setPieOption(pieChartOption)
  setRadarOption(radarChartOption)
})
</script>

<template>
  <div :class="$style.dashboard">
    <!-- 顶部标题栏 -->
    <div :class="$style['dashboard-header']">
      <h1>{{ dashboardTitle }}</h1>
      <span :class="$style['dashboard-header-time']">{{ currentTime }}</span>
    </div>

    <!--
      v-model 双向绑定示例：
        父组件用 v-model:title 绑定 dashboardTitle
        子组件内部修改输入框时，通过 emit('update:title') 同步回父组件
        父组件的 h1 标题会实时更新
    -->
    <ChartTitleEditor v-model:title="dashboardTitle" />

    <!-- 父组件接收子组件事件后的通知消息 -->
    <transition name="fade">
      <div v-if="noticeMessage" :class="$style['dashboard-notice']">📌 {{ noticeMessage }}</div>
    </transition>

    <!-- 统计卡片：使用子组件 StatCard，通过 props 传递数据，监听子组件 select 事件 -->
    <div :class="$style['dashboard-stats']">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :trend="stat.trend"
        :trend-up="stat.trendUp"
        :icon="stat.icon"
        :color="stat.color"
        :selected="selectedLabel === stat.label"
        @select="handleStatSelect"
      />
    </div>

    <!-- 图表区域 -->
    <div :class="$style['dashboard-charts']">
      <div :class="$style['chart-card']">
        <div ref="lineChartRef" :class="$style['chart-card-chart']" />
      </div>
      <div :class="$style['chart-card']">
        <div ref="barChartRef" :class="$style['chart-card-chart']" />
      </div>
      <div :class="$style['chart-card']">
        <div ref="pieChartRef" :class="$style['chart-card-chart']" />
      </div>
      <div :class="$style['chart-card']">
        <div ref="radarChartRef" :class="$style['chart-card-chart']" />
      </div>
    </div>
  </div>
</template>
