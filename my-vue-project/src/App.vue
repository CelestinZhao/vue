<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import styles from './App.module.less'
</script>

<template>
  <header :class="styles['app-header']">
    <div :class="styles['app-header__brand']">
      <img alt="Vue logo" :class="styles.logo" src="@/assets/logo.svg" width="32" height="32" />
      <span :class="styles['brand-name']">Vue Demo</span>
    </div>
    <nav :class="styles['app-nav']">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/dashboard">看板</RouterLink>
      <RouterLink to="/user">用户管理</RouterLink>
    </nav>
  </header>

  <main :class="styles['app-main']">
    <RouterView />
  </main>
</template>
