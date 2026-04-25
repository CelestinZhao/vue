import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // TDesign 按需自动引入组件（包括 CSS 按需加载）
    AutoImport({
      resolvers: [TDesignResolver({ library: 'vue-next' })],
    }),
    Components({
      resolvers: [TDesignResolver({ library: 'vue-next' })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 单文件超过 500KB 时发出警告
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vue 核心生态单独一个 chunk
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/@vue') ||
            id.includes('node_modules/vue-router') ||
            id.includes('node_modules/pinia')
          ) {
            return 'vendor-vue'
          }
          // TDesign 单独一个 chunk
          if (
            id.includes('node_modules/tdesign-vue-next') ||
            id.includes('node_modules/tdesign-icons-vue-next')
          ) {
            return 'vendor-tdesign'
          }
          // ECharts 拆分为两个 chunk：zrender 渲染引擎 + echarts 图表组件
          if (id.includes('node_modules/zrender')) {
            return 'vendor-zrender'
          }
          if (id.includes('node_modules/echarts')) {
            return 'vendor-echarts'
          }
          // 其他第三方库（axios 等）
          if (id.includes('node_modules')) {
            return 'vendor-misc'
          }
        },
      },
    },
  },
})
