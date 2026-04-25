<template>
  <view :class="styles['profile-container']">
    <!-- 个人头像区域 -->
    <view :class="styles['profile-header']">
      <view :class="styles['avatar-wrapper']">
        <view :class="styles.avatar">🐱</view>
        <view :class="styles['avatar-ring']"></view>
      </view>
      <text :class="styles.username">健身小可爱</text>
      <text :class="styles['user-motto']">每天进步一点点 ✨</text>
    </view>

    <!-- 数据概览 -->
    <view :class="['card', styles['stats-card']]">
      <view :class="styles['stats-row']">
        <view :class="styles['stats-item']">
          <text :class="styles['stats-value']">{{ store.trainingHistory.length }}</text>
          <text :class="styles['stats-label']">总训练次数</text>
        </view>
        <view :class="styles['stats-divider']"></view>
        <view :class="styles['stats-item']">
          <text :class="styles['stats-value']">{{ totalCalories }}</text>
          <text :class="styles['stats-label']">总消耗千卡</text>
        </view>
        <view :class="styles['stats-divider']"></view>
        <view :class="styles['stats-item']">
          <text :class="styles['stats-value']">{{ formatTotalTime }}</text>
          <text :class="styles['stats-label']">总训练时长</text>
        </view>
      </view>
    </view>

    <!-- 体重设置 -->
    <view :class="['card', styles['setting-card']]" @tap="showWeightDialog">
      <view :class="styles['setting-row']">
        <view :class="styles['setting-left']">
          <text :class="styles['setting-icon']">⚖️</text>
          <view :class="styles['setting-info']">
            <text :class="styles['setting-title']">体重设置</text>
            <text :class="styles['setting-desc']">用于精确计算卡路里消耗</text>
          </view>
        </view>
        <view :class="styles['setting-right']">
          <text :class="styles['setting-value']">{{ store.userWeight }}kg</text>
          <text :class="styles['setting-arrow']">›</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view :class="['card', styles['menu-card']]">
      <view :class="styles['menu-item']" @tap="showTrainingHistory">
        <text :class="styles['menu-icon']">📊</text>
        <text :class="styles['menu-title']">训练记录</text>
        <text :class="styles['menu-badge']" v-if="store.trainingHistory.length > 0">{{ store.trainingHistory.length }}</text>
        <text :class="styles['menu-arrow']">›</text>
      </view>
      <view :class="styles['menu-divider']"></view>
      <view :class="styles['menu-item']" @tap="clearHistory">
        <text :class="styles['menu-icon']">🗑️</text>
        <text :class="styles['menu-title']">清除训练记录</text>
        <text :class="styles['menu-arrow']">›</text>
      </view>
      <view :class="styles['menu-divider']"></view>
      <view :class="styles['menu-item']" @tap="shareApp">
        <text :class="styles['menu-icon']">💌</text>
        <text :class="styles['menu-title']">分享给好友</text>
        <text :class="styles['menu-arrow']">›</text>
      </view>
      <view :class="styles['menu-divider']"></view>
      <view :class="styles['menu-item']">
        <text :class="styles['menu-icon']">💡</text>
        <text :class="styles['menu-title']">关于萌动健身</text>
        <text :class="styles['menu-extra']">v1.0.0</text>
        <text :class="styles['menu-arrow']">›</text>
      </view>
    </view>

    <!-- 训练历史弹窗 -->
    <view :class="styles['history-modal']" v-if="showHistory" @tap.self="showHistory = false">
      <view :class="styles['history-content']">
        <view :class="styles['history-header']">
          <text :class="styles['history-title']">📊 训练记录</text>
          <text :class="styles['history-close']" @tap="showHistory = false">✕</text>
        </view>
        <scroll-view scroll-y :class="styles['history-scroll']">
          <view v-if="store.trainingHistory.length === 0" :class="styles['history-empty']">
            <text :class="styles['empty-icon']">🏃</text>
            <text :class="styles['empty-text']">还没有训练记录呢~</text>
            <text :class="styles['empty-sub']">快去开始第一次训练吧！</text>
          </view>
          <view
            :class="styles['history-item']"
            v-for="record in store.trainingHistory"
            :key="record.id"
          >
            <view :class="styles['history-item-left']">
              <text :class="styles['history-name']">{{ record.name }}</text>
              <text :class="styles['history-date']">{{ record.date }} {{ record.time }}</text>
            </view>
            <view :class="styles['history-item-right']">
              <text :class="styles['history-cal']">🔥{{ record.calories }}千卡</text>
              <text :class="styles['history-dur']">⏱{{ formatDuration(record.duration) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 自定义底部 TabBar -->
    <CustomTabBar current="pages/profile/index" />

    <!-- 底部装饰 -->
    <view :class="styles['footer-decor']">
      <text :class="styles['decor-text']">💖 坚持运动，遇见更好的自己 💖</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTrainingStore } from '../../stores/training'
import CustomTabBar from '../../components/CustomTabBar.vue'
import styles from './index.module.less'

const store = useTrainingStore()
const showHistory = ref(false)

onMounted(() => {
  store.loadHistory()
  store.loadUserWeight()
  uni.hideTabBar()
})

// 总消耗卡路里
const totalCalories = computed(() => {
  return store.trainingHistory.reduce((sum, r) => sum + r.calories, 0)
})

// 格式化总时长
const formatTotalTime = computed(() => {
  const total = store.trainingHistory.reduce((sum, r) => sum + r.duration, 0)
  if (total < 60) return total + 's'
  const hours = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  if (hours > 0) return hours + 'h' + mins + 'm'
  return mins + 'm'
})

// 设置体重
function showWeightDialog() {
  uni.showModal({
    title: '设置体重',
    editable: true,
    placeholderText: '请输入体重（kg）',
    success: (res) => {
      if (res.confirm && res.content) {
        const weight = parseFloat(res.content)
        if (weight > 0 && weight < 300) {
          store.saveUserWeight(weight)
          uni.showToast({ title: '设置成功 ✅', icon: 'none' })
        } else {
          uni.showToast({ title: '请输入有效的体重', icon: 'none' })
        }
      }
    }
  })
}

// 显示训练记录
function showTrainingHistory() {
  showHistory.value = true
}

// 清除记录
function clearHistory() {
  if (store.trainingHistory.length === 0) {
    uni.showToast({ title: '暂无记录', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认清除？',
    content: '清除后训练记录将无法恢复',
    confirmColor: '#FF6B81',
    success: (res) => {
      if (res.confirm) {
        store.trainingHistory = []
        uni.setStorageSync('training_history', '[]')
        uni.showToast({ title: '已清除 🗑️', icon: 'none' })
      }
    }
  })
}

// 分享
function shareApp() {
  uni.showToast({ title: '可通过右上角菜单分享哦~', icon: 'none' })
}

// 格式化时长
function formatDuration(seconds) {
  if (seconds < 60) return seconds + 's'
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return min + '\'' + (sec > 0 ? sec + '"' : '')
}
</script>
