<script>
export default {
  onLaunch() {
    console.log('🏋️ 萌动健身小程序启动')
  },
  onShow() {
    console.log('小程序显示')
  },
  onHide() {
    console.log('小程序隐藏')
  }
}
</script>

<style>
/* 全局样式 - 卡通可爱风 */
page {
  background-color: #FFF5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  color: #4A4A4A;
  font-size: 28rpx;
  line-height: 1.6;
}

/* 全局圆角卡片样式 */
.card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 20rpx 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(255, 154, 162, 0.15);
}

/* 可爱按钮样式 */
.btn-cute {
  background: linear-gradient(135deg, #FF9AA2, #FFB7B2);
  color: #FFFFFF;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 50rpx;
  font-size: 30rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
  box-shadow: 0 6rpx 20rpx rgba(255, 154, 162, 0.4);
}

.btn-cute:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 10rpx rgba(255, 154, 162, 0.3);
}

/* 渐变文字 */
.text-gradient {
  background: linear-gradient(135deg, #FF6B81, #FF9AA2);
  -webkit-background-clip: text;
  color: transparent;
}

/* 通用间距 */
.mt-20 { margin-top: 20rpx; }
.mt-30 { margin-top: 30rpx; }
.mb-20 { margin-bottom: 20rpx; }
.mb-30 { margin-bottom: 30rpx; }
.px-24 { padding-left: 24rpx; padding-right: 24rpx; }

/* ===== 美化原生 TabBar ===== */
/* tabBar 容器 - 添加阴影和圆角效果 */
.uni-tabbar {
  box-shadow: 0 -2px 16px rgba(255, 154, 162, 0.15) !important;
}

.uni-tabbar-bottom {
  border-top: none !important;
}

/* tabBar 每个按钮项 */
.uni-tabbar__item {
  transition: transform 0.2s ease !important;
}

.uni-tabbar__item:active {
  transform: scale(0.9) !important;
}

/* tabBar 图标 - 使用 class 选择器兼容小程序端 */
.uni-tabbar__icon .uni-tabbar__icon__img {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  width: 27px !important;
  height: 27px !important;
}

/* tabBar 文字标签 */
.uni-tabbar__label {
  font-size: 11px !important;
  transition: all 0.3s ease !important;
}

/* 选中状态标签加粗 */
.uni-tabbar__item--active .uni-tabbar__label {
  font-weight: bold !important;
}
</style>
