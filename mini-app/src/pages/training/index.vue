<template>
  <view :class="styles['training-container']">
    <!-- 顶部标签切换 -->
    <view :class="styles['type-tabs']">
      <view
        :class="[styles['type-tab'], { [styles.active]: store.currentType === item.type }]"
        v-for="item in store.trainingTypes"
        :key="item.type"
        :style="store.currentType === item.type ? { background: item.bgGradient } : {}"
        @tap="switchType(item.type)"
      >
        <text :class="styles['tab-icon']">{{ item.icon }}</text>
        <text :class="styles['tab-name']">{{ item.name.replace(item.icon + ' ', '') }}</text>
      </view>
    </view>

    <!-- 训练信息卡片 -->
    <view :class="['card', styles['training-info-card']]" :style="{ borderTop: '6rpx solid ' + store.currentTraining.color }">
      <view :class="styles['info-header']">
        <view>
          <text :class="styles['info-title']">{{ store.currentTraining.name }}</text>
          <text :class="styles['info-desc']">{{ store.currentTraining.description }}</text>
        </view>
        <view :class="styles['info-stats']">
          <text :class="styles['info-cal']">🔥 约{{ store.estimatedTotalCalories }}千卡</text>
          <text :class="styles['info-time']">⏱ {{ totalTime }}分钟</text>
        </view>
      </view>
    </view>

    <!-- 动作列表 -->
    <view :class="styles['section-header']">
      <text :class="styles['section-title']">💫 训练动作（{{ store.currentTraining.exercises.length }}个）</text>
    </view>

    <view :class="styles['exercise-list']">
      <view
        :class="[styles['exercise-item'], 'card']"
        v-for="(exercise, idx) in store.currentTraining.exercises"
        :key="exercise.id"
      >
        <view :class="styles['exercise-index']">{{ idx + 1 }}</view>
        <view :class="styles['exercise-emoji']">{{ exercise.emoji }}</view>
        <view :class="styles['exercise-info']">
          <text :class="styles['exercise-name']">{{ exercise.name }}</text>
          <view :class="styles['exercise-tags']">
            <text :class="styles.tag">⏱ {{ exercise.duration }}s</text>
            <text :class="[styles.tag, styles.rest]">😌 休息{{ exercise.rest }}s</text>
          </view>
        </view>
        <view :class="styles['exercise-cal']">
          <text :class="styles['cal-value']">~{{ Math.round(exercise.caloriesRate * exercise.duration / 60) }}</text>
          <text :class="styles['cal-unit']">千卡</text>
        </view>
      </view>
    </view>

    <!-- 自定义底部 TabBar -->
    <CustomTabBar current="pages/training/index" />

    <!-- 底部开始按钮 -->
    <view :class="styles['bottom-bar']">
      <view :class="styles['start-btn']" :style="{ background: store.currentTraining.bgGradient }" @tap="startTraining">
        <text :class="styles['start-icon']">🚀</text>
        <text :class="styles['start-text']">开始训练</text>
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

// 切换训练类型
function switchType(type) {
  store.selectTraining(type)
}

// 预估总时间
const totalTime = computed(() => {
  let total = 0
  store.currentTraining.exercises.forEach(ex => {
    total += ex.duration + ex.rest
  })
  return Math.round(total / 60)
})

// 开始训练
function startTraining() {
  store.selectTraining(store.currentType)
  uni.navigateTo({
    url: '/pages/workout/index'
  })
}
</script>
