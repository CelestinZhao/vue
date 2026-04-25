import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import type { User } from '@/api/user'

export type { User }

export const useUserStore = defineStore('user', () => {
  // ==================== State ====================
  /** 用户列表 */
  const users = ref<User[]>([])
  /** 加载状态 */
  const loading = ref(false)
  /** 搜索关键词（v-model 双向绑定示例） */
  const searchKeyword = ref('')
  // ==================== Getters ====================
  /** 用户总数 */
  const total = computed(() => users.value.length)

  /** 活跃用户数 */
  const activeCount = computed(() => users.value.filter((u) => u.status === 'active').length)

  /** 管理员数量 */
  const adminCount = computed(() => users.value.filter((u) => u.role === 'admin').length)

  // ==================== Actions ====================

  /** 显示操作消息（使用 TDesign MessagePlugin） */
  function showMessage(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') {
      MessagePlugin.success(msg)
    } else {
      MessagePlugin.error(msg)
    }
  }

  /** 获取用户列表 */
  async function fetchUsers(keyword?: string) {
    loading.value = true
    try {
      const res = await getUserList({ keyword })
      users.value = res.data
    } catch (e) {
      showMessage('获取用户列表失败', 'error')
    } finally {
      loading.value = false
    }
  }

  /** 新增用户 */
  async function addUser(data: Omit<User, 'id' | 'createdAt'>) {
    loading.value = true
    try {
      const res = await createUser(data)
      users.value.push(res.data)
      return true
    } catch (e) {
      return false
    } finally {
      loading.value = false
    }
  }

  /** 编辑用户 */
  async function editUser(id: number, data: Partial<Omit<User, 'id' | 'createdAt'>>) {
    loading.value = true
    try {
      const res = await updateUser(id, data)
      const idx = users.value.findIndex((u) => u.id === id)
      if (idx !== -1) users.value[idx] = res.data
      return true
    } catch (e) {
      return false
    } finally {
      loading.value = false
    }
  }

  /** 删除用户 */
  async function removeUser(id: number) {
    loading.value = true
    try {
      await deleteUser(id)
      users.value = users.value.filter((u) => u.id !== id)
    } catch (e) {
      showMessage('删除用户失败', 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    users,
    loading,
    searchKeyword,
    // getters
    total,
    activeCount,
    adminCount,
    // actions
    fetchUsers,
    addUser,
    editUser,
    removeUser,
    showMessage,
  }
})
