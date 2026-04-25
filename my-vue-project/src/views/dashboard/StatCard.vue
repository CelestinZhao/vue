
<script setup lang="ts">
import { computed } from 'vue'
import styles from './DashboardView.module.less'

// 定义 Props 类型
interface Props {
  label: string
  value: string
  trend: string
  trendUp: boolean
  icon: string
  color: string
  selected?: boolean // 是否被选中（由父组件控制）
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
})

// 定义向父组件发出的事件
const emit = defineEmits<{
  select: [label: string] // 点击卡片时，向父组件传递卡片的 label
}>()

const $style: { [key: string]: string } = styles

// 计算卡片类名，选中时附加高亮样式
const cardClass = computed(() => [
  $style['stat-card'],
  props.selected ? $style['stat-card-selected'] : '',
])

// 点击卡片，触发 select 事件
const handleClick = () => {
  emit('select', props.label)
}
</script>

<template>
  <div :class="cardClass" @click="handleClick">
    <div :class="[$style['stat-card-icon'], $style[color]]">
      {{ icon }}
    </div>
    <div :class="$style['stat-card-info']">
      <div :class="$style['stat-card-label']">{{ label }}</div>
      <div :class="$style['stat-card-value']">{{ value }}</div>
      <div :class="[$style['stat-card-trend'], trendUp ? $style.up : $style.down]">
        {{ trendUp ? '↑' : '↓' }} {{ trend }} 较上周
      </div>
    </div>
    <!-- 选中标记 -->
    <span v-if="selected" :class="$style['stat-card-badge']">已选中</span>
  </div>
</template>
