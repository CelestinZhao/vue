import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 训练类型定义
 * cardio - 有氧运动
 * yoga - 瑜伽
 * strength - 力量训练
 */

// 训练动作数据
const trainingData = {
  cardio: {
    name: '🏃 有氧燃脂',
    icon: '🏃',
    color: '#FF6B81',
    bgGradient: 'linear-gradient(135deg, #FF6B81, #FF9AA2)',
    description: '燃烧卡路里，提升心肺功能',
    caloriesPerMinute: 10, // 每分钟消耗卡路里（基准值）
    exercises: [
      { id: 'c1', name: '开合跳', duration: 45, rest: 15, caloriesRate: 12, emoji: '⭐' },
      { id: 'c2', name: '高抬腿', duration: 40, rest: 20, caloriesRate: 11, emoji: '🦵' },
      { id: 'c3', name: '波比跳', duration: 30, rest: 30, caloriesRate: 15, emoji: '💥' },
      { id: 'c4', name: '跳绳模拟', duration: 45, rest: 15, caloriesRate: 13, emoji: '🪢' },
      { id: 'c5', name: '快速踏步', duration: 40, rest: 20, caloriesRate: 9, emoji: '👟' },
      { id: 'c6', name: '登山跑', duration: 35, rest: 25, caloriesRate: 14, emoji: '⛰️' }
    ]
  },
  yoga: {
    name: '🧘 元气瑜伽',
    icon: '🧘',
    color: '#B5EAD7',
    bgGradient: 'linear-gradient(135deg, #B5EAD7, #C7F0DB)',
    description: '舒展身心，提升柔韧性',
    caloriesPerMinute: 4,
    exercises: [
      { id: 'y1', name: '猫牛式', duration: 60, rest: 10, caloriesRate: 3, emoji: '🐱' },
      { id: 'y2', name: '下犬式', duration: 45, rest: 15, caloriesRate: 4, emoji: '🐶' },
      { id: 'y3', name: '战士一式', duration: 40, rest: 20, caloriesRate: 5, emoji: '⚔️' },
      { id: 'y4', name: '树式', duration: 45, rest: 15, caloriesRate: 3, emoji: '🌳' },
      { id: 'y5', name: '三角式', duration: 40, rest: 20, caloriesRate: 4, emoji: '📐' },
      { id: 'y6', name: '婴儿式', duration: 60, rest: 10, caloriesRate: 2, emoji: '👶' }
    ]
  },
  strength: {
    name: '💪 力量塑形',
    icon: '💪',
    color: '#FFDAC1',
    bgGradient: 'linear-gradient(135deg, #FFDAC1, #FFE8D6)',
    description: '增强肌肉力量，塑造完美体型',
    caloriesPerMinute: 8,
    exercises: [
      { id: 's1', name: '深蹲', duration: 40, rest: 20, caloriesRate: 8, emoji: '🦿' },
      { id: 's2', name: '俯卧撑', duration: 35, rest: 25, caloriesRate: 9, emoji: '💪' },
      { id: 's3', name: '平板支撑', duration: 45, rest: 15, caloriesRate: 6, emoji: '🧱' },
      { id: 's4', name: '弓步蹲', duration: 40, rest: 20, caloriesRate: 8, emoji: '🏋️' },
      { id: 's5', name: '仰卧起坐', duration: 35, rest: 25, caloriesRate: 7, emoji: '🔥' },
      { id: 's6', name: '臀桥', duration: 40, rest: 20, caloriesRate: 6, emoji: '🌉' }
    ]
  }
}

export const useTrainingStore = defineStore('training', () => {
  // 当前选择的训练类型
  const currentType = ref('cardio')
  // 当前训练中的动作索引
  const currentExerciseIndex = ref(0)
  // 训练是否正在进行
  const isTraining = ref(false)
  // 训练是否暂停
  const isPaused = ref(false)
  // 已消耗的卡路里
  const caloriesBurned = ref(0)
  // 训练已经过的秒数
  const elapsedSeconds = ref(0)
  // 当前动作是否在休息期
  const isResting = ref(false)
  // 当前动作计时器秒数
  const currentTimer = ref(0)
  // 训练历史记录
  const trainingHistory = ref([])
  // 用户体重（用于卡路里计算，单位kg）
  const userWeight = ref(60)
  // 本周训练天数
  const weeklyTrainingDays = ref(0)

  // 获取所有训练类型
  const trainingTypes = computed(() => {
    return Object.entries(trainingData).map(([key, value]) => ({
      type: key,
      ...value
    }))
  })

  // 当前训练类型的详细数据
  const currentTraining = computed(() => {
    return trainingData[currentType.value] || trainingData.cardio
  })

  // 当前动作
  const currentExercise = computed(() => {
    const exercises = currentTraining.value.exercises
    if (currentExerciseIndex.value < exercises.length) {
      return exercises[currentExerciseIndex.value]
    }
    return null
  })

  // 训练总进度（百分比）
  const trainingProgress = computed(() => {
    const total = currentTraining.value.exercises.length
    if (total === 0) return 0
    return Math.round((currentExerciseIndex.value / total) * 100)
  })

  // 预估总消耗卡路里
  const estimatedTotalCalories = computed(() => {
    const exercises = currentTraining.value.exercises
    let total = 0
    exercises.forEach(ex => {
      // 卡路里 = 卡路里率 * 运动时间(秒) / 60 * 体重系数
      total += (ex.caloriesRate * ex.duration / 60) * (userWeight.value / 60)
    })
    return Math.round(total)
  })

  // 实时卡路里消耗计算
  function calculateCalories(seconds, caloriesRate) {
    // 卡路里 = 卡路里率 * 时间(秒) / 60 * 体重系数
    const weightFactor = userWeight.value / 60
    return (caloriesRate * seconds / 60) * weightFactor
  }

  // 选择训练类型
  function selectTraining(type) {
    currentType.value = type
  }

  // 开始训练
  function startTraining() {
    isTraining.value = true
    isPaused.value = false
    currentExerciseIndex.value = 0
    caloriesBurned.value = 0
    elapsedSeconds.value = 0
    isResting.value = false
    if (currentExercise.value) {
      currentTimer.value = currentExercise.value.duration
    }
  }

  // 暂停/继续训练
  function togglePause() {
    isPaused.value = !isPaused.value
  }

  // 每秒更新（由页面定时器调用）
  function tick() {
    if (!isTraining.value || isPaused.value || !currentExercise.value) return

    elapsedSeconds.value++
    currentTimer.value--

    // 如果不在休息期，计算卡路里消耗
    if (!isResting.value) {
      const cal = calculateCalories(1, currentExercise.value.caloriesRate)
      caloriesBurned.value += cal
    }

    // 倒计时结束
    if (currentTimer.value <= 0) {
      if (!isResting.value) {
        // 运动结束，进入休息
        isResting.value = true
        currentTimer.value = currentExercise.value.rest
      } else {
        // 休息结束，进入下一个动作
        isResting.value = false
        currentExerciseIndex.value++
        if (currentExerciseIndex.value >= currentTraining.value.exercises.length) {
          // 训练完成
          finishTraining()
          return
        }
        currentTimer.value = currentExercise.value.duration
      }
    }
  }

  // 完成训练
  function finishTraining() {
    isTraining.value = false
    isPaused.value = false

    // 保存训练记录
    const record = {
      id: Date.now(),
      type: currentType.value,
      name: currentTraining.value.name,
      calories: Math.round(caloriesBurned.value),
      duration: elapsedSeconds.value,
      date: new Date().toLocaleDateString('zh-CN'),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    trainingHistory.value.unshift(record)

    // 保存到本地存储
    saveHistory()
  }

  // 停止训练
  function stopTraining() {
    if (caloriesBurned.value > 0) {
      finishTraining()
    } else {
      isTraining.value = false
      isPaused.value = false
    }
  }

  // 保存历史到本地
  function saveHistory() {
    try {
      uni.setStorageSync('training_history', JSON.stringify(trainingHistory.value.slice(0, 50)))
    } catch (e) {
      console.error('保存训练记录失败', e)
    }
  }

  // 加载历史记录
  function loadHistory() {
    try {
      const data = uni.getStorageSync('training_history')
      if (data) {
        trainingHistory.value = JSON.parse(data)
      }
    } catch (e) {
      console.error('加载训练记录失败', e)
    }
  }

  // 加载用户体重
  function loadUserWeight() {
    try {
      const weight = uni.getStorageSync('user_weight')
      if (weight) {
        userWeight.value = Number(weight)
      }
    } catch (e) {
      console.error('加载用户体重失败', e)
    }
  }

  // 保存用户体重
  function saveUserWeight(weight) {
    userWeight.value = weight
    try {
      uni.setStorageSync('user_weight', String(weight))
    } catch (e) {
      console.error('保存用户体重失败', e)
    }
  }

  // 获取今日训练统计
  const todayStats = computed(() => {
    const today = new Date().toLocaleDateString('zh-CN')
    const todayRecords = trainingHistory.value.filter(r => r.date === today)
    return {
      count: todayRecords.length,
      calories: todayRecords.reduce((sum, r) => sum + r.calories, 0),
      duration: todayRecords.reduce((sum, r) => sum + r.duration, 0)
    }
  })

  // 获取本周训练统计
  const weekStats = computed(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekRecords = trainingHistory.value.filter(r => {
      const parts = r.date.split('/')
      const recordDate = new Date(parts[0], parts[1] - 1, parts[2])
      return recordDate >= weekStart
    })

    const uniqueDays = new Set(weekRecords.map(r => r.date))

    return {
      count: weekRecords.length,
      days: uniqueDays.size,
      calories: weekRecords.reduce((sum, r) => sum + r.calories, 0),
      duration: weekRecords.reduce((sum, r) => sum + r.duration, 0)
    }
  })

  return {
    currentType,
    currentExerciseIndex,
    isTraining,
    isPaused,
    caloriesBurned,
    elapsedSeconds,
    isResting,
    currentTimer,
    trainingHistory,
    userWeight,
    weeklyTrainingDays,
    trainingTypes,
    currentTraining,
    currentExercise,
    trainingProgress,
    estimatedTotalCalories,
    todayStats,
    weekStats,
    selectTraining,
    startTraining,
    togglePause,
    tick,
    stopTraining,
    finishTraining,
    loadHistory,
    loadUserWeight,
    saveUserWeight
  }
})
