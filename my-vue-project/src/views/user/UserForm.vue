<script setup lang="ts">
/**
 * UserForm 子组件
 * 演示 v-model 双向绑定：父组件通过 v-model:modelValue 传入表单数据，
 * 子组件内部修改后通过 emit('update:modelValue') 同步回父组件
 * 使用 TDesign Form / Input / Select / RadioGroup 组件
 */
import { ref, watch } from 'vue'
import type { FormInstanceFunctions, FormRules } from 'tdesign-vue-next'
import type { User } from '@/stores/user'
import styles from './UserForm.module.less'

const $style: { [key: string]: string } = styles

type FormData = Omit<User, 'id' | 'createdAt'>

const props = defineProps<{
  modelValue: FormData
  mode: 'create' | 'edit'
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FormData]
  submit: []
  cancel: []
}>()

// TDesign Form 实例引用
const formRef = ref<FormInstanceFunctions>()

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑者', value: 'editor' },
  { label: '访客', value: 'viewer' },
]

// 状态选项
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
]

// TDesign Form 校验规则
const rules: FormRules<FormData> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { email: true, message: '邮箱格式不正确', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { telnumber: true, message: '手机号格式不正确', trigger: 'blur' },
  ],
}

// 监听父组件传入的数据变化（编辑时切换不同用户，清空校验状态）
watch(
  () => props.modelValue,
  () => {
    formRef.value?.clearValidate()
  },
  { deep: true },
)

// 更新单个字段，通过 emit 同步给父组件（v-model 双向绑定核心）
function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

// 提交：先触发 TDesign Form 校验，通过后再通知父组件
async function handleSubmit() {
  const result = await formRef.value?.validate()
  if (result === true) {
    emit('submit')
  }
}
</script>

<template>
  <t-form
    ref="formRef"
    :data="modelValue"
    :rules="rules"
    label-align="top"
    :colon="false"
    @submit="handleSubmit"
  >
    <t-form-item label="姓名" name="name">
      <t-input
        :value="modelValue.name"
        placeholder="请输入姓名"
        @change="(val: string) => updateField('name', val)"
      />
    </t-form-item>

    <t-form-item label="邮箱" name="email">
      <t-input
        :value="modelValue.email"
        placeholder="请输入邮箱"
        @change="(val: string) => updateField('email', val)"
      />
    </t-form-item>

    <t-form-item label="手机号" name="phone">
      <t-input
        :value="modelValue.phone"
        placeholder="请输入手机号"
        @change="(val: string) => updateField('phone', val)"
      />
    </t-form-item>

    <t-form-item label="角色" name="role">
      <t-select
        :value="modelValue.role"
        :options="roleOptions"
        placeholder="请选择角色"
        @change="(val: User['role']) => updateField('role', val)"
      />
    </t-form-item>

    <t-form-item label="状态" name="status">
      <t-radio-group
        :value="modelValue.status"
        :options="statusOptions"
        @change="(val: User['status']) => updateField('status', val)"
      />
    </t-form-item>

    <t-form-item>
      <div :class="$style['form-actions']">
        <t-button variant="outline" :disabled="loading" @click="emit('cancel')">取消</t-button>
        <t-button theme="primary" :loading="loading" @click="handleSubmit">
          {{ loading ? '提交中...' : '确认' }}
        </t-button>
      </div>
    </t-form-item>
  </t-form>
</template>
