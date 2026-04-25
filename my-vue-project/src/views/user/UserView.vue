<script setup lang="ts">
/**
 * UserView - 用户管理页面（父组件）
 *
 * 演示的 Vue 核心特性：
 * 1. 生命周期：onMounted 初始化数据，onUnmounted 清理定时器
 * 2. Pinia 状态管理：useUserStore 管理全局用户数据
 * 3. v-model 双向绑定：搜索框、表单数据与子组件双向同步
 * 4. 计算属性：统计数据
 * 5. watch：监听搜索关键词变化
 * 6. provide/inject：向子组件注入加载状态
 * 7. 父子组件通信：props + emit
 * 8. TDesign 组件库：Button / Table / Input / Dialog / Tag / MessagePlugin
 */
import { ref, computed, watch, provide, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { MessagePlugin } from 'tdesign-vue-next'
import type { TableProps, PrimaryTableCol } from 'tdesign-vue-next'
import { useUserStore } from '@/stores/user'
import type { User } from '@/stores/user'
import UserForm from './UserForm.vue'
import styles from './UserView.module.less'

const $style: { [key: string]: string } = styles

const userStore = useUserStore()

// storeToRefs 保持响应性解构
const { users, loading, searchKeyword, total, activeCount, adminCount } = storeToRefs(userStore)

// ==================== 生命周期 ====================
let refreshTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  await userStore.fetchUsers()
  refreshTimer = setInterval(() => {
    if (!showModal.value) {
      userStore.fetchUsers(searchKeyword.value || undefined)
    }
  }, 60000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})

// ==================== provide/inject ====================
provide('globalLoading', loading)

// ==================== 搜索（v-model + watch）====================
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchKeyword, (val) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    userStore.fetchUsers(val || undefined)
  }, 400)
})

// ==================== 弹窗控制 ====================
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')

const emptyForm = (): Omit<User, 'id' | 'createdAt'> => ({
  name: '',
  email: '',
  phone: '',
  role: 'viewer',
  status: 'active',
})
const formData = ref(emptyForm())
const editingId = ref<number | null>(null)

function openCreate() {
  modalMode.value = 'create'
  formData.value = emptyForm()
  editingId.value = null
  showModal.value = true
}

function openEdit(user: User) {
  modalMode.value = 'edit'
  formData.value = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  }
  editingId.value = user.id
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleSubmit() {
  let success = false
  if (modalMode.value === 'create') {
    success = await userStore.addUser(formData.value)
  } else if (editingId.value !== null) {
    success = await userStore.editUser(editingId.value, formData.value)
  }
  if (success) {
    closeModal()
    MessagePlugin.success(modalMode.value === 'create' ? '新增用户成功' : '编辑用户成功')
  } else {
    MessagePlugin.error('操作失败，请重试')
  }
}

async function handleDelete(user: User) {
  // 使用 TDesign MessagePlugin 替代 confirm
  const confirmed = await new Promise<boolean>((resolve) => {
    import('tdesign-vue-next').then(({ DialogPlugin }) => {
      const dialog = DialogPlugin.confirm({
        header: '确认删除',
        body: `确认删除用户「${user.name}」？此操作不可撤销。`,
        theme: 'danger',
        confirmBtn: { content: '确认删除', theme: 'danger' },
        onConfirm: () => {
          dialog.hide()
          resolve(true)
        },
        onClose: () => {
          dialog.hide()
          resolve(false)
        },
      })
    })
  })
  if (!confirmed) return
  await userStore.removeUser(user.id)
  MessagePlugin.success('删除成功')
}

// ==================== 计算属性 ====================
const roleMap: Record<User['role'], string> = {
  admin: '管理员',
  editor: '编辑者',
  viewer: '访客',
}

const roleThemeMap: Record<User['role'], 'danger' | 'primary' | 'default'> = {
  admin: 'danger',
  editor: 'primary',
  viewer: 'default',
}

// TDesign Table 列配置
const columns = computed<PrimaryTableCol<User>[]>(() => [
  { colKey: 'id', title: 'ID', width: 60 },
  { colKey: 'name', title: '姓名', width: 100 },
  { colKey: 'email', title: '邮箱', ellipsis: true },
  { colKey: 'phone', title: '手机号', width: 130 },
  {
    colKey: 'role',
    title: '角色',
    width: 100,
    cell: 'roleCell',
  },
  {
    colKey: 'status',
    title: '状态',
    width: 90,
    cell: 'statusCell',
  },
  { colKey: 'createdAt', title: '创建时间', width: 120 },
  {
    colKey: 'action',
    title: '操作',
    width: 120,
    cell: 'actionCell',
    fixed: 'right',
  },
])

const tableProps: TableProps = {
  rowKey: 'id',
  stripe: true,
  hover: true,
  bordered: true,
  size: 'medium',
}
</script>

<template>
  <div :class="$style['user-page']">
    <!-- 页面标题 -->
    <div :class="$style['user-page__header']">
      <h2>用户管理</h2>
      <t-button theme="primary" @click="openCreate">+ 新增用户</t-button>
    </div>

    <!-- 统计卡片 -->
    <div :class="$style['user-page__stats']">
      <div :class="$style['stat-item']">
        <span :class="$style['stat-value']">{{ total }}</span>
        <span :class="$style['stat-label']">总用户数</span>
      </div>
      <div :class="$style['stat-item']">
        <span :class="[$style['stat-value'], $style['active']]">{{ activeCount }}</span>
        <span :class="$style['stat-label']">活跃用户</span>
      </div>
      <div :class="$style['stat-item']">
        <span :class="[$style['stat-value'], $style['admin']]">{{ adminCount }}</span>
        <span :class="$style['stat-label']">管理员</span>
      </div>
    </div>

    <!-- 搜索栏（v-model 双向绑定 store 中的 searchKeyword）-->
    <div :class="$style['user-page__search']">
      <t-input
        v-model="searchKeyword"
        placeholder="搜索姓名或邮箱..."
        clearable
        style="width: 280px"
      />
      <span :class="$style['search-hint']">共 {{ users.length }} 条结果</span>
    </div>

    <!-- TDesign Table 用户列表 -->
    <t-table
      v-bind="tableProps"
      :data="users"
      :columns="columns"
      :loading="loading"
      empty="暂无用户数据"
    >
      <!-- 角色列插槽 -->
      <template #roleCell="{ row }: { row: User }">
        <t-tag :theme="roleThemeMap[row.role]" variant="light" shape="round" size="small">
          {{ roleMap[row.role] }}
        </t-tag>
      </template>

      <!-- 状态列插槽 -->
      <template #statusCell="{ row }: { row: User }">
        <t-tag
          :theme="row.status === 'active' ? 'success' : 'default'"
          variant="light"
          size="small"
        >
          {{ row.status === 'active' ? '启用' : '禁用' }}
        </t-tag>
      </template>

      <!-- 操作列插槽 -->
      <template #actionCell="{ row }">
        <t-button variant="text" theme="primary" size="small" @click="openEdit(row)">
          编辑
        </t-button>
        <t-button variant="text" theme="danger" size="small" @click="handleDelete(row)">
          删除
        </t-button>
      </template>
    </t-table>

    <!-- TDesign Dialog 弹窗 -->
    <t-dialog
      v-model:visible="showModal"
      :header="modalMode === 'create' ? '新增用户' : '编辑用户'"
      :footer="false"
      width="480px"
      @close="closeModal"
    >
      <!--
        v-model 双向绑定示例：
        父组件将 formData 通过 v-model 传给子组件 UserForm，
        子组件内部修改任意字段时，通过 emit('update:modelValue') 同步回父组件
      -->
      <UserForm
        v-model="formData"
        :mode="modalMode"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </t-dialog>
  </div>
</template>


