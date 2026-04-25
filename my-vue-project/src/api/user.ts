import http from './http'
import type { User } from './mock'

export type { User }

export interface UserListParams {
  keyword?: string
}

export interface ApiResponse<T> {
  code: number
  data: T
  total?: number
  message?: string
}

// 获取用户列表
export function getUserList(params?: UserListParams): Promise<ApiResponse<User[]>> {
  return http.get('/users', { params })
}

// 新增用户
export function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
  return http.post('/users', data)
}

// 编辑用户
export function updateUser(id: number, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<ApiResponse<User>> {
  return http.put(`/users/${id}`, data)
}

// 删除用户
export function deleteUser(id: number): Promise<ApiResponse<null>> {
  return http.delete(`/users/${id}`)
}
