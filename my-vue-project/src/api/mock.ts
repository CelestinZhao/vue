import type { AxiosInstance } from 'axios'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

// Mock 数据库
let mockUsers: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    role: 'editor',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2024-03-10',
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    role: 'editor',
    status: 'active',
    createdAt: '2024-04-05',
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    phone: '13800138005',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-05-18',
  },
]

let nextId = 6

// 模拟网络延迟
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 注册 Mock 拦截器到 axios 实例
 * 拦截所有 /api/users 相关请求，返回 mock 数据
 */
export function setupMock(http: AxiosInstance) {
  http.interceptors.request.use(async (config) => {
    const url = config.url || ''
    const method = (config.method || 'get').toLowerCase()

    await delay()

    // GET /users - 获取用户列表
    if (url === '/users' && method === 'get') {
      const keyword = (config.params?.keyword || '').toLowerCase()
      const list = keyword
        ? mockUsers.filter(
            (u) => u.name.includes(keyword) || u.email.includes(keyword),
          )
        : [...mockUsers]

      // 抛出特殊标记，在响应拦截器中捕获并返回 mock 数据
      return Promise.reject({
        __mock__: true,
        data: { code: 0, data: list, total: list.length },
      })
    }

    // POST /users - 新增用户
    if (url === '/users' && method === 'post') {
      const body = JSON.parse(config.data || '{}')
      const newUser: User = { ...body, id: nextId++, createdAt: new Date().toISOString().slice(0, 10) }
      mockUsers.push(newUser)
      return Promise.reject({
        __mock__: true,
        data: { code: 0, data: newUser, message: '新增成功' },
      })
    }

    // PUT /users/:id - 编辑用户
    const putMatch = url.match(/^\/users\/(\d+)$/)
    if (putMatch && method === 'put') {
      const id = Number(putMatch[1])
      const body = JSON.parse(config.data || '{}')
      const idx = mockUsers.findIndex((u) => u.id === id)
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...body }
        return Promise.reject({
          __mock__: true,
          data: { code: 0, data: mockUsers[idx], message: '编辑成功' },
        })
      }
    }

    // DELETE /users/:id - 删除用户
    const delMatch = url.match(/^\/users\/(\d+)$/)
    if (delMatch && method === 'delete') {
      const id = Number(delMatch[1])
      mockUsers = mockUsers.filter((u) => u.id !== id)
      return Promise.reject({
        __mock__: true,
        data: { code: 0, message: '删除成功' },
      })
    }

    return config
  })

  // 在响应错误拦截器中捕获 mock 数据并正常返回
  http.interceptors.response.use(undefined, (error) => {
    if (error?.__mock__) {
      return Promise.resolve(error.data)
    }
    return Promise.reject(error)
  })
}
