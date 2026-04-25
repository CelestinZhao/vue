import { graphic } from 'echarts/core'
import type { EChartsOption } from 'echarts'

// 折线图配置 - 近7天访问趋势
export const lineChartOption: EChartsOption = {
  title: {
    text: '近7天访问趋势',
    textStyle: { fontSize: 14, fontWeight: 'bold' as const, color: '#333' },
  },
  tooltip: { trigger: 'axis' },
  legend: { data: ['访问量', '新用户'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 1234, 1290, 1330, 1520],
      areaStyle: { opacity: 0.3 },
      itemStyle: { color: '#5470c6' },
    },
    {
      name: '新用户',
      type: 'line',
      smooth: true,
      data: [320, 432, 401, 534, 590, 630, 720],
      areaStyle: { opacity: 0.3 },
      itemStyle: { color: '#91cc75' },
    },
  ],
}

// 柱状图配置 - 各渠道销售额
export const barChartOption: EChartsOption = {
  title: {
    text: '各渠道销售额（万元）',
    textStyle: { fontSize: 14, fontWeight: 'bold' as const, color: '#333' },
  },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['直销', '电商', '代理商', '零售', '海外', '其他'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销售额',
      type: 'bar',
      barWidth: '50%',
      data: [320, 580, 420, 260, 190, 130],
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#5470c6' },
          { offset: 1, color: '#91cc75' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}

// 饼图配置 - 用户设备分布
export const pieChartOption: EChartsOption = {
  title: {
    text: '用户设备分布',
    textStyle: { fontSize: 14, fontWeight: 'bold' as const, color: '#333' },
  },
  tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', right: '5%', top: 'center' },
  series: [
    {
      name: '设备类型',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' as const } },
      data: [
        { value: 5248, name: '移动端', itemStyle: { color: '#5470c6' } },
        { value: 3120, name: '桌面端', itemStyle: { color: '#91cc75' } },
        { value: 1560, name: '平板', itemStyle: { color: '#fac858' } },
        { value: 420, name: '其他', itemStyle: { color: '#ee6666' } },
      ],
    },
  ],
}

// 雷达图配置 - 产品综合评分
export const radarChartOption: EChartsOption = {
  title: {
    text: '产品综合评分',
    textStyle: { fontSize: 14, fontWeight: 'bold' as const, color: '#333' },
  },
  tooltip: {},
  legend: { data: ['本季度', '上季度'], bottom: 0 },
  radar: {
    indicator: [
      { name: '功能性', max: 100 },
      { name: '易用性', max: 100 },
      { name: '稳定性', max: 100 },
      { name: '性能', max: 100 },
      { name: '安全性', max: 100 },
      { name: '扩展性', max: 100 },
    ],
    radius: '65%',
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [88, 92, 85, 90, 78, 82],
          name: '本季度',
          areaStyle: { opacity: 0.3, color: '#5470c6' },
          lineStyle: { color: '#5470c6' },
          itemStyle: { color: '#5470c6' },
        },
        {
          value: [75, 80, 88, 82, 85, 70],
          name: '上季度',
          areaStyle: { opacity: 0.3, color: '#91cc75' },
          lineStyle: { color: '#91cc75' },
          itemStyle: { color: '#91cc75' },
        },
      ],
    },
  ],
}
