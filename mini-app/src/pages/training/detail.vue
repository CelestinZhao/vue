<template>
  <view :class="styles['detail-container']">
    <!-- 顶部卡片 -->
    <view :class="styles['detail-hero']" :style="{ background: store.currentTraining.bgGradient }">
      <view :class="styles['hero-icon']">{{ store.currentTraining.icon }}</view>
      <text :class="styles['hero-title']">{{ store.currentTraining.name }}</text>
      <text :class="styles['hero-desc']">{{ store.currentTraining.description }}</text>
      <view :class="styles['hero-stats']">
        <view :class="styles['hero-stat']">
          <text :class="styles['hero-stat-value']">{{ store.currentTraining.exercises.length }}</text>
          <text :class="styles['hero-stat-label']">个动作</text>
        </view>
        <view :class="styles['hero-stat']">
          <text :class="styles['hero-stat-value']">~{{ totalTime }}</text>
          <text :class="styles['hero-stat-label']">分钟</text>
        </view>
        <view :class="styles['hero-stat']">
          <text :class="styles['hero-stat-value']">~{{ store.estimatedTotalCalories }}</text>
          <text :class="styles['hero-stat-label']">千卡</text>
        </view>
      </view>
    </view>

    <!-- 动作流程 -->
    <view :class="styles['flow-section']">
      <text :class="styles['flow-title']">🎯 训练流程</text>
      <view :class="styles['flow-list']">
        <view
          :class="styles['flow-item']"
          v-for="(exercise, idx) in store.currentTraining.exercises"
          :key="exercise.id"
        >
          <view :class="styles['flow-line']" v-if="idx > 0"></view>
          <view :class="styles['flow-dot']" :style="{ background: store.currentTraining.color }">
            {{ exercise.emoji }}
          </view>
          <view :class="styles['flow-content']">
            <text :class="styles['flow-name']">{{ exercise.name }}</text>
            <text :class="styles['flow-detail']">运动{{ exercise.duration }}s → 休息{{ exercise.rest }}s</text>
            <text :class="styles['flow-cal']">消耗约 {{ Math.round(exercise.caloriesRate * exercise.duration / 60) }} 千卡</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 温馨提示 -->
    <view :class="['card', styles['tips-card']]">
      <text :class="styles['tips-title']">💝 温馨小提示</text>
      <view :class="styles['tips-list']">
        <text :class="styles['tip-item']">🌊 运动前记得先做好热身哦~</text>
        <text :class="styles['tip-item']">💧 训练中要及时补充水分~</text>
        <text :class="styles['tip-item']">🎵 搭配喜欢的音乐效果更好~</text>
        <text :class="styles['tip-item']">😊 根据自身情况调整节奏，不要勉强~</text>
      </view>
    </view>

    <!-- 开始训练按钮 -->
    <view :class="styles['bottom-bar']">
      <view :class="styles['start-btn']" :style="{ background: store.currentTraining.bgGradient }" @tap="startWorkout">
        <text :class="styles['start-text']">🚀 开始训练！冲鸭！</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useTrainingStore } from '../../stores/training'
import styles from './detail.module.less'

const store = useTrainingStore()

// 通过onLoad获取页面参数
onLoad((options) => {
  if (options && options.type) {
    store.selectTraining(options.type)
  }
})

// 预估总时间
const totalTime = computed(() => {
  let total = 0
  store.currentTraining.exercises.forEach(ex => {
    total += ex.duration + ex.rest
  })
  return Math.round(total / 60)
})

// 开始训练
function startWorkout() {
  uni.navigateTo({
    url: '/pages/workout/index'
  })
}
</script>
