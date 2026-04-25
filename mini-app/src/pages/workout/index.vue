<template>
  <view :class="styles['workout-container']" :style="{ background: bgColor }">
    <!-- 训练完成页 -->
    <view :class="styles['finish-page']" v-if="isFinished">
      <view :class="styles['finish-confetti']">🎉</view>
      <text :class="styles['finish-title']">太棒啦！训练完成！</text>
      <view :class="styles['finish-mascot']">🎊🏆🎊</view>

      <view :class="styles['finish-stats-card']">
        <view :class="styles['finish-stat']">
          <text :class="styles['finish-stat-icon']">🔥</text>
          <text :class="styles['finish-stat-value']">{{ Math.round(store.caloriesBurned) }}</text>
          <text :class="styles['finish-stat-label']">消耗千卡</text>
        </view>
        <view :class="styles['finish-stat']">
          <text :class="styles['finish-stat-icon']">⏱</text>
          <text :class="styles['finish-stat-value']">{{ formatTime(store.elapsedSeconds) }}</text>
          <text :class="styles['finish-stat-label']">训练时长</text>
        </view>
        <view :class="styles['finish-stat']">
          <text :class="styles['finish-stat-icon']">💪</text>
          <text :class="styles['finish-stat-value']">{{ store.currentTraining.exercises.length }}</text>
          <text :class="styles['finish-stat-label']">完成动作</text>
        </view>
      </view>

      <text :class="styles['finish-encourage']">{{ finishEncourage }}</text>

      <view :class="styles['finish-btns']">
        <view :class="[styles['finish-btn'], styles.primary]" @tap="goHome">
          <text>🏠 返回首页</text>
        </view>
        <view :class="[styles['finish-btn'], styles.secondary]" @tap="restartTraining">
          <text>🔄 再来一组</text>
        </view>
      </view>
    </view>

    <!-- 训练进行中 -->
    <view :class="styles['workout-page']" v-else>
      <!-- 顶部状态栏 -->
      <view :class="styles['workout-top']">
        <view :class="styles['top-left']" @tap="onBack">
          <text :class="styles['back-icon']">✕</text>
        </view>
        <text :class="styles['top-title']">{{ store.currentTraining.name }}</text>
        <view :class="styles['top-right']">
          <text :class="styles['top-progress']">{{ store.currentExerciseIndex + 1 }}/{{ store.currentTraining.exercises.length }}</text>
        </view>
      </view>

      <!-- 进度条 -->
      <view :class="styles['progress-track']">
        <view
          :class="styles['progress-fill']"
          :style="{ width: progressWidth + '%' }"
        ></view>
      </view>

      <!-- 实时卡路里显示 -->
      <view :class="styles['calorie-display']">
        <view :class="styles['calorie-flame']">🔥</view>
        <view :class="styles['calorie-number-wrapper']">
          <text :class="styles['calorie-number']">{{ displayCalories }}</text>
          <text :class="styles['calorie-unit']">千卡</text>
        </view>
        <text :class="styles['calorie-label']">实时消耗</text>
      </view>

      <!-- 当前动作展示 -->
      <view :class="styles['current-exercise']" v-if="store.currentExercise">
        <view :class="[styles['exercise-status'], { [styles.resting]: store.isResting }]">
          <text :class="styles['status-text']">{{ store.isResting ? '😌 休息一下~' : '💪 加油！' }}</text>
        </view>

        <view :class="styles['exercise-emoji-big']">{{ store.currentExercise.emoji }}</view>
        <text :class="styles['exercise-name-big']">{{ store.currentExercise.name }}</text>

        <!-- 倒计时圆环 -->
        <view :class="styles['timer-ring-wrapper']">
          <view :class="styles['timer-ring']">
            <svg :class="styles['timer-svg']" viewBox="0 0 200 200">
              <circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-width="8"
              />
              <circle
                cx="100" cy="100" r="90"
                fill="none"
                :stroke="store.isResting ? '#B5EAD7' : '#FF6B81'"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
                transform="rotate(-90 100 100)"
                style="transition: stroke-dashoffset 1s linear"
              />
            </svg>
            <view :class="styles['timer-content']">
              <text :class="styles['timer-seconds']">{{ store.currentTimer }}</text>
              <text :class="styles['timer-label']">{{ store.isResting ? '休息中' : '秒' }}</text>
            </view>
          </view>
        </view>

        <!-- 下一个动作预告 -->
        <view :class="styles['next-exercise']" v-if="nextExercise">
          <text :class="styles['next-label']">下一个 👉</text>
          <text :class="styles['next-name']">{{ nextExercise.emoji }} {{ nextExercise.name }}</text>
        </view>
      </view>

      <!-- 底部控制按钮 -->
      <view :class="styles['workout-controls']">
        <view :class="[styles['control-btn'], styles.stop]" @tap="onStop">
          <text>⏹</text>
          <text :class="styles['control-label']">结束</text>
        </view>
        <view :class="[styles['control-btn'], styles.main, { [styles.paused]: store.isPaused }]" @tap="togglePause">
          <text :class="styles['main-icon']">{{ store.isPaused ? '▶️' : '⏸️' }}</text>
        </view>
        <view :class="[styles['control-btn'], styles.skip]" @tap="skipExercise">
          <text>⏭</text>
          <text :class="styles['control-label']">跳过</text>
        </view>
      </view>

      <!-- 底部信息 -->
      <view :class="styles['workout-footer']">
        <text :class="styles['footer-time']">⏱ {{ formatTime(store.elapsedSeconds) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTrainingStore } from '../../stores/training'
import styles from './index.module.less'

const store = useTrainingStore()
const isFinished = ref(false)
let timer = null

onMounted(() => {
  store.startTraining()
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

// 启动计时器
function startTimer() {
  stopTimer()
  timer = setInterval(() => {
    if (!store.isTraining) {
      // 训练完成
      isFinished.value = true
      stopTimer()
      return
    }
    store.tick()
  }, 1000)
}

// 停止计时器
function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 监听训练状态
watch(() => store.isTraining, (val) => {
  if (!val && store.caloriesBurned > 0) {
    isFinished.value = true
    stopTimer()
  }
})

// 背景颜色
const bgColor = computed(() => {
  if (isFinished.value) return 'linear-gradient(180deg, #FFF5F5, #FFE8EC)'
  if (store.isResting) return 'linear-gradient(180deg, #E8FFF3, #F0FFF8)'
  return 'linear-gradient(180deg, #FFF5F5, #FFE8EC)'
})

// 显示卡路里（保留一位小数）
const displayCalories = computed(() => {
  return store.caloriesBurned.toFixed(1)
})

// 进度宽度
const progressWidth = computed(() => {
  const total = store.currentTraining.exercises.length
  if (total === 0) return 0
  return Math.round(((store.currentExerciseIndex) / total) * 100)
})

// 倒计时圆环
const circumference = 2 * Math.PI * 90

const dashOffset = computed(() => {
  if (!store.currentExercise) return circumference
  const total = store.isResting
    ? store.currentExercise.rest
    : store.currentExercise.duration
  const remaining = store.currentTimer
  const progress = 1 - (remaining / total)
  return circumference * (1 - progress)
})

// 下一个动作
const nextExercise = computed(() => {
  const nextIdx = store.currentExerciseIndex + 1
  if (nextIdx < store.currentTraining.exercises.length) {
    return store.currentTraining.exercises[nextIdx]
  }
  return null
})

// 完成鼓励语
const finishEncourage = computed(() => {
  const cal = Math.round(store.caloriesBurned)
  if (cal > 100) return '🌟 超强表现！你是健身小达人！'
  if (cal > 50) return '💪 非常棒！坚持就是胜利！'
  return '😊 良好的开始！继续加油哦~'
})

// 格式化时间
function formatTime(seconds) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

// 暂停/继续
function togglePause() {
  store.togglePause()
}

// 停止训练
function onStop() {
  uni.showModal({
    title: '确认结束训练？',
    content: '当前进度将被保存',
    confirmText: '确认结束',
    confirmColor: '#FF6B81',
    success: (res) => {
      if (res.confirm) {
        store.stopTraining()
        isFinished.value = true
        stopTimer()
      }
    }
  })
}

// 跳过当前动作
function skipExercise() {
  store.currentExerciseIndex++
  store.isResting = false
  if (store.currentExerciseIndex >= store.currentTraining.exercises.length) {
    store.finishTraining()
    isFinished.value = true
    stopTimer()
    return
  }
  store.currentTimer = store.currentExercise.duration
}

// 返回首页
function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  })
}

// 重新开始
function restartTraining() {
  isFinished.value = false
  store.startTraining()
  startTimer()
}

// 返回
function onBack() {
  uni.showModal({
    title: '确认退出训练？',
    content: '当前训练将不会被保存',
    confirmText: '确认退出',
    confirmColor: '#FF6B81',
    success: (res) => {
      if (res.confirm) {
        stopTimer()
        store.isTraining = false
        uni.navigateBack()
      }
    }
  })
}
</script>
