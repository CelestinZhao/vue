<script setup lang="ts">
import { ref, watch } from 'vue'
import styles from './DashboardView.module.less'

/**
 * v-model 双向绑定原理：
 *   父组件使用 v-model:title="dashboardTitle"
 *   等价于 :title="dashboardTitle" @update:title="dashboardTitle = $event"
 *
 *   子组件通过 defineProps 接收 modelValue（或自定义名称），
 *   通过 emit('update:modelValue', newVal) 通知父组件更新
 */

// 自定义 v-model 绑定名为 title（即 v-model:title）
const props = defineProps<{
  title: string
}>()

const emit = defineEmits<{
  'update:title': [value: string] // v-model 要求的事件格式
}>()

const $style: { [key: string]: string } = styles

// 子组件内部维护一个编辑中的临时值
const inputValue = ref(props.title)
// 记录原始值，用于重置
const originalTitle = ref(props.title)

// 当父组件外部修改 title 时，同步到子组件内部
watch(
  () => props.title,
  (newVal) => {
    inputValue.value = newVal
  },
)

// 实时同步：每次输入都通过 emit 通知父组件（双向绑定核心）
const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  inputValue.value = val
  emit('update:title', val)
}

// 重置为原始标题
const handleReset = () => {
  inputValue.value = originalTitle.value
  emit('update:title', originalTitle.value)
}
</script>

<template>
  <div :class="$style['title-editor']">
    <span :class="$style['title-editor-label']">仪表盘标题</span>
    <input
      :class="$style['title-editor-input']"
      :value="inputValue"
      placeholder="请输入仪表盘标题"
      @input="handleInput"
    />
    <button :class="$style['title-editor-reset']" @click="handleReset">重置</button>
  </div>
</template>
