import './assets/main.css'
// 导入全局Less样式文件
import './styles/global.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import http from './api/http'
import { setupMock } from './api/mock'

// 注册 Mock 拦截器（开发环境模拟接口数据）
setupMock(http)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
