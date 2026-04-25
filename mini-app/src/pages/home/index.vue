<template>
  <view :class="styles['home-container']">
    <!-- 顶部欢迎区域 -->
    <view :class="styles['welcome-section']">
      <view :class="styles['welcome-bg']">
        <view :class="[styles.bubble, styles.b1]">🌟</view>
        <view :class="[styles.bubble, styles.b2]">✨</view>
        <view :class="[styles.bubble, styles.b3]">💖</view>
      </view>
      <view :class="styles['welcome-content']">
        <text :class="styles['welcome-hello']">Hello~ 🎀</text>
        <text :class="styles['welcome-title']">今天也要元气满满哦！</text>
        <view :class="styles['today-stats']">
          <view :class="styles['stat-item']">
            <text :class="styles['stat-value']">{{ store.todayStats.count }}</text>
            <text :class="styles['stat-label']">今日训练</text>
          </view>
          <view :class="styles['stat-divider']"></view>
          <view :class="styles['stat-item']">
            <text :class="styles['stat-value']">{{ store.todayStats.calories }}</text>
            <text :class="styles['stat-label']">消耗千卡</text>
          </view>
          <view :class="styles['stat-divider']"></view>
          <view :class="styles['stat-item']">
            <text :class="styles['stat-value']">{{ formatDuration(store.todayStats.duration) }}</text>
            <text :class="styles['stat-label']">运动时长</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 卡路里目标卡片 -->
    <view :class="['card', styles['calorie-card']]">
      <view :class="styles['calorie-header']">
        <text :class="styles['calorie-title']">🔥 今日燃脂目标</text>
        <text :class="styles['calorie-goal']">{{ store.todayStats.calories }} / 300 千卡</text>
      </view>
      <view :class="styles['progress-bar-bg']">
        <view :class="styles['progress-bar-fill']" :style="{ width: calorieProgress + '%' }">
          <view :class="styles['progress-glow']"></view>
        </view>
      </view>
      <text :class="styles['calorie-encourage']" v-if="calorieProgress < 100">
        {{ encourageText }} 💪
      </text>
      <text :class="[styles['calorie-encourage'], styles.done]" v-else>
        🎉 太棒啦！今日目标已达成！
      </text>
    </view>

    <!-- 快速开始训练 -->
    <view :class="styles['section-header']">
      <text :class="styles['section-title']">⚡ 快速开始</text>
      <text :class="styles['section-sub']">选择喜欢的训练吧~</text>
    </view>

    <view :class="styles['quick-training-list']">
      <view
        :class="styles['training-card']"
        v-for="item in store.trainingTypes"
        :key="item.type"
        :style="{ background: item.bgGradient }"
        @tap="goToTrainingDetail(item.type)"
      >
        <view :class="styles['training-card-icon']">{{ item.icon }}</view>
        <view :class="styles['training-card-info']">
          <text :class="styles['training-card-name']">{{ item.name }}</text>
          <text :class="styles['training-card-desc']">{{ item.description }}</text>
        </view>
        <view :class="styles['training-card-meta']">
          <text :class="styles['meta-cal']">🔥 约{{ getEstimatedCal(item.type) }}千卡</text>
          <text :class="styles['meta-time']">⏱ {{ getEstimatedTime(item.type) }}分钟</text>
        </view>
        <view :class="styles['training-card-arrow']">▶</view>
      </view>
    </view>

    <!-- 本周概览 -->
    <view :class="['card', styles['week-card']]">
      <text :class="styles['week-title']">📅 本周训练概览</text>
      <view :class="styles['week-stats']">
        <view :class="styles['week-stat-item']">
          <view :class="styles['week-stat-icon']">📆</view>
          <text :class="styles['week-stat-value']">{{ store.weekStats.days }}</text>
          <text :class="styles['week-stat-label']">训练天数</text>
        </view>
        <view :class="styles['week-stat-item']">
          <view :class="styles['week-stat-icon']">🏅</view>
          <text :class="styles['week-stat-value']">{{ store.weekStats.count }}</text>
          <text :class="styles['week-stat-label']">训练次数</text>
        </view>
        <view :class="styles['week-stat-item']">
          <view :class="styles['week-stat-icon']">🔥</view>
          <text :class="styles['week-stat-value']">{{ store.weekStats.calories }}</text>
          <text :class="styles['week-stat-label']">总消耗千卡</text>
        </view>
      </view>
      <!-- 星期打卡条 -->
      <view :class="styles['week-dots']">
        <view
          :class="[styles['week-dot'], { [styles.active]: day.done }]"
          v-for="(day, idx) in weekDays"
          :key="idx"
        >
          <text :class="styles['dot-label']">{{ day.label }}</text>
          <view :class="styles['dot-circle']">{{ day.done ? '⭐' : '○' }}</view>
        </view>
      </view>
    </view>

    <!-- 自定义底部 TabBar -->
    <CustomTabBar current="pages/home/index" />

    <!-- 最近训练记录 -->
    <view :class="styles['section-header']" v-if="store.trainingHistory.length > 0">
      <text :class="styles['section-title']">📝 最近训练</text>
    </view>
    <view :class="['card', styles['record-card']]" v-for="record in recentRecords" :key="record.id">
      <view :class="styles['record-row']">
        <text :class="styles['record-name']">{{ record.name }}</text>
        <text :class="styles['record-cal']">🔥 {{ record.calories }}千卡</text>
      </view>
      <view :class="[styles['record-row'], styles.sub]">
        <text :class="styles['record-date']">{{ record.date }} {{ record.time }}</text>
        <text :class="styles['record-duration']">⏱ {{ formatDuration(record.duration) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTrainingStore } from '../../stores/training'
import CustomTabBar from '../../components/CustomTabBar.vue'
import styles from './index.module.less'

const store = useTrainingStore()

onMounted(() => {
  store.loadHistory()
  store.loadUserWeight()
  uni.hideTabBar()
})

// 卡路里进度
const calorieProgress = computed(() => {
  return Math.min(100, Math.round((store.todayStats.calories / 300) * 100))
})

// 鼓励语
const encourageText = computed(() => {
  const p = calorieProgress.value
  if (p === 0) return '还没开始运动呢，加油哦~'
  if (p < 30) return '已经迈出第一步啦，继续加油~'
  if (p < 60) return '进度不错哦，冲鸭！'
  if (p < 90) return '马上就要达标啦，再坚持一下~'
  return '就差一点点啦，冲冲冲！'
})

// 最近记录（最多5条）
const recentRecords = computed(() => {
  return store.trainingHistory.slice(0, 5)
})

// 本周每天的打卡状态
const weekDays = computed(() => {
  const labels = ['日', '一', '二', '三', '四', '五', '六']
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  return labels.map((label, idx) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + idx)
    const dateStr = day.toLocaleDateString('zh-CN')
    const done = store.trainingHistory.some(r => r.date === dateStr)
    return { label, done }
  })
})

// 获取预估卡路里
function getEstimatedCal(type) {
  const data = store.trainingTypes.find(t => t.type === type)
  if (!data) return 0
  let total = 0
  data.exercises.forEach(ex => {
    total += (ex.caloriesRate * ex.duration / 60) * (store.userWeight / 60)
  })
  return Math.round(total)
}

// 获取预估时间
function getEstimatedTime(type) {
  const data = store.trainingTypes.find(t => t.type === type)
  if (!data) return 0
  let total = 0
  data.exercises.forEach(ex => {
    total += ex.duration + ex.rest
  })
  return Math.round(total / 60)
}

// 格式化时长
function formatDuration(seconds) {
  if (seconds < 60) return seconds + 's'
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return min + '\'' + (sec > 0 ? sec + '"' : '')
}

// 跳转训练详情
function goToTrainingDetail(type) {
  store.selectTraining(type)
  uni.navigateTo({
    url: '/pages/training/detail?type=' + type
  })
}
</script>
