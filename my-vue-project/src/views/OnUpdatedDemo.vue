<script setup lang="ts">
import { ref, watch } from 'vue'

// 计数器
const count = ref(0)
// 输入消息
const message = ref('')
// 更新日志列表
const updateLogs = ref<string[]>([])
// 更新次数
let updateCount = 0

/**
 * 使用 watch 替代 onUpdated：
 * - 显式监听 count 和 message，不会误监听 updateLogs，无需防循环
 * - 回调提供新旧值，可以精确记录是哪个数据发生了变化
 */
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  updateCount++
  const now = new Date().toLocaleTimeString('zh-CN')

  // 精确记录变化来源
  const changes: string[] = []
  if (newCount !== oldCount) changes.push(`count: ${oldCount} → ${newCount}`)
  if (newMessage !== oldMessage) changes.push(`message 已修改`)

  updateLogs.value.push(`[${now}] 第 ${updateCount} 次更新 (${changes.join(', ')})`)
  if (updateLogs.value.length > 20) {
    updateLogs.value.shift()
  }
})

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

const clearLogs = () => {
  updateLogs.value = []
  updateCount = 0
}
</script>

<template>
  <div class="on-updated-demo">
    <h1>watch 侦听器示例</h1>
    <p class="description">
      <code>watch</code> 可以显式监听指定的响应式数据，当数据变化时执行回调。<br />
      下方每次修改计数器或输入框内容，都会触发 <code>watch</code> 回调，并精确记录变化来源。
    </p>

    <!-- 计数器 -->
    <div class="section">
      <h2>计数器</h2>
      <div class="counter">
        <button @click="decrement">-</button>
        <span class="counter-value">{{ count }}</span>
        <button @click="increment">+</button>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="section">
      <h2>消息输入</h2>
      <t-input v-model="message" placeholder="输入一些文字试试..." clearable />
      <p v-if="message" class="message-preview">实时预览：{{ message }}</p>
    </div>

    <!-- 更新日志 -->
    <div class="section">
      <div class="log-header">
        <h2>watch 触发日志</h2>
        <button class="clear-btn" @click="clearLogs">清空日志</button>
      </div>
      <div class="log-container">
        <div v-if="updateLogs.length === 0" class="log-empty">
          暂无更新日志，请操作上方的计数器或输入框
        </div>
        <div v-for="(log, index) in updateLogs" :key="index" class="log-item">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.on-updated-demo {
  max-width: 600px;
  margin: 20px auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
  padding: 12px;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.description code {
  background: #e8f4fd;
  padding: 2px 6px;
  border-radius: 4px;
  color: #409eff;
  font-weight: 600;
}

.section {
  margin-bottom: 24px;
}

h2 {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}

.counter {
  display: flex;
  align-items: center;
  gap: 16px;
}

.counter button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #409eff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.counter button:hover {
  background: #337ecc;
}

.counter-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  min-width: 60px;
  text-align: center;
}

.message-preview {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  color: #606266;
  font-size: 14px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-btn {
  padding: 4px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  color: #606266;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.log-container {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 8px;
  background: #fafafa;
}

.log-empty {
  text-align: center;
  color: #c0c4cc;
  font-size: 14px;
  padding: 24px 0;
}

.log-item {
  padding: 6px 10px;
  font-size: 13px;
  color: #606266;
  font-family: 'Courier New', monospace;
  border-bottom: 1px dashed #ebeef5;
}

.log-item:last-child {
  border-bottom: none;
}
</style>
