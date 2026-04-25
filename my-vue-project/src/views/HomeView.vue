<script setup lang="ts">
import { ref, computed } from 'vue'

// 导入外部的CSS Modules样式文件
import styles from './HomeView.module.less'

// 使用外部CSS Modules样式
const $style: { [key: string]: string } = styles

const count = ref(0)
const message = ref('欢迎使用Vue CSS Modules + Less!')

const increment = () => {
  count.value++
}

const changeMessage = () => {
  message.value = 'CSS Modules使用成功！'
}

// 动态类名示例
const buttonClasses = computed(() => [
  $style.button,
  count.value > 5 ? $style.highlight : $style.normal,
])

const containerClasses = computed(() => ({
  [String($style.container)]: true,
  [String($style.loaded)]: count.value > 0,
}))
</script>

<template>
  <div :class="containerClasses">
    <div :class="$style.heroSection">
      <h1 :class="$style.title">{{ message }}</h1>
      <p :class="$style.description">这是一个演示Vue如何使用CSS Modules和Less文件的示例页面</p>

      <div :class="$style.demoButtons">
        <button :class="buttonClasses" @click="increment">点击计数: {{ count }}</button>
        <button v-if="count > 0" :class="[$style.button, $style.secondary]" @click="changeMessage">
          改变消息
        </button>
      </div>
    </div>

    <div :class="$style.containerInner">
      <div :class="$style.featuresSection">
        <div :class="$style.featureCard">
          <h3 :class="$style.featureTitle">CSS Modules支持</h3>
          <p :class="$style.featureText">Vue支持CSS Modules，类名自动哈希化，实现样式隔离</p>
        </div>

        <div :class="$style.featureCard">
          <h3 :class="$style.featureTitle">Less预处理器</h3>
          <p :class="$style.featureText">结合Less的变量、嵌套、混合等高级特性</p>
        </div>

        <div :class="$style.featureCard">
          <h3 :class="$style.featureTitle">动态类名绑定</h3>
          <p :class="$style.featureText">在JavaScript中动态操作样式类，实现条件样式</p>
        </div>
      </div>
    </div>
  </div>
</template>
