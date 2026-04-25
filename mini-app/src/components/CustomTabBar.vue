<template>
  <view :class="styles['custom-tab-bar']">
    <view
      :class="[styles['tab-item'], { [styles.active]: current === item.pagePath }]"
      v-for="item in tabList"
      :key="item.pagePath"
      @tap="switchTab(item.pagePath)"
    >
      <text :class="styles['tab-icon']">{{ current === item.pagePath ? item.selectedIcon : item.icon }}</text>
      <text :class="styles['tab-text']">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import styles from './CustomTabBar.module.less'

const props = defineProps({
  current: {
    type: String,
    default: 'pages/home/index'
  }
})

const tabList = ref([
  {
    pagePath: 'pages/home/index',
    text: '首页',
    icon: '🏠',
    selectedIcon: '🏡'
  },
  {
    pagePath: 'pages/training/index',
    text: '训练',
    icon: '💪',
    selectedIcon: '🏋️'
  },
  {
    pagePath: 'pages/profile/index',
    text: '我的',
    icon: '😊',
    selectedIcon: '😄'
  }
])

function switchTab(pagePath) {
  if (pagePath === props.current) return
  uni.switchTab({
    url: '/' + pagePath
  })
}
</script>


