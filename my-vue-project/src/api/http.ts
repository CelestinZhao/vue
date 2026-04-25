import axios from 'axios'

// 创建 axios 实例
const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可在此处添加 token 等认证信息
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求失败:', error.message)
    return Promise.reject(error)
  },
)

export default http
