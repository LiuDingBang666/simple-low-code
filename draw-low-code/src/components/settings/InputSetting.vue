<!--
@description: 输入框专用编辑器 - 支持输入框特有属性编辑
@author: liudingbang
@date: 2025/9/21
-->

<template>
  <div class="input-setting">
    <el-form :model="inputForm" label-width="80px" size="small">
      
      <!-- 占位符 -->
      <el-form-item label="占位符">
        <el-input
          v-model="inputForm.placeholder"
          placeholder="输入占位符文本"
          @input="handlePlaceholderChange"
        />
      </el-form-item>

      <!-- 输入框类型 -->
      <el-form-item label="输入类型">
        <el-select v-model="inputForm.type" @change="handleTypeChange">
          <el-option label="文本" value="text" />
          <el-option label="密码" value="password" />
          <el-option label="数字" value="number" />
          <el-option label="邮箱" value="email" />
          <el-option label="电话" value="tel" />
          <el-option label="网址" value="url" />
          <el-option label="搜索" value="search" />
          <el-option label="多行文本" value="textarea" />
        </el-select>
      </el-form-item>

      <!-- 输入框尺寸 -->
      <el-form-item label="输入尺寸" v-if="isElementInput">
        <el-select v-model="inputForm.size" @change="handleSizeChange">
          <el-option label="大" value="large" />
          <el-option label="默认" value="default" />
          <el-option label="小" value="small" />
        </el-select>
      </el-form-item>

      <!-- 是否禁用 -->
      <el-form-item label="禁用状态">
        <el-switch
          v-model="inputForm.disabled"
          @change="handleDisabledChange"
        />
      </el-form-item>

      <!-- 是否只读 -->
      <el-form-item label="只读状态">
        <el-switch
          v-model="inputForm.readonly"
          @change="handleReadonlyChange"
        />
      </el-form-item>

      <!-- 是否可清空 -->
      <el-form-item label="可清空" v-if="isElementInput">
        <el-switch
          v-model="inputForm.clearable"
          @change="handleClearableChange"
        />
      </el-form-item>

      <!-- 是否显示密码 -->
      <el-form-item label="显示密码" v-if="isElementInput && inputForm.type === 'password'">
        <el-switch
          v-model="inputForm.showPassword"
          @change="handleShowPasswordChange"
        />
      </el-form-item>

      <!-- 最大长度 -->
      <el-form-item label="最大长度">
        <el-input-number
          v-model="inputForm.maxlength"
          :min="0"
          @change="handleMaxlengthChange"
        />
      </el-form-item>

      <!-- 最小长度 -->
      <el-form-item label="最小长度">
        <el-input-number
          v-model="inputForm.minlength"
          :min="0"
          @change="handleMinlengthChange"
        />
      </el-form-item>

      <!-- 文本域行数 -->
      <el-form-item label="文本行数" v-if="inputForm.type === 'textarea'">
        <el-input-number
          v-model="inputForm.rows"
          :min="1"
          :max="20"
          @change="handleRowsChange"
        />
      </el-form-item>

      <!-- 自适应高度 -->
      <el-form-item label="自适应高度" v-if="isElementInput && inputForm.type === 'textarea'">
        <el-switch
          v-model="inputForm.autosize"
          @change="handleAutosizeChange"
        />
      </el-form-item>

      <!-- 前缀图标 -->
      <el-form-item label="前缀图标" v-if="isElementInput">
        <el-input
          v-model="inputForm.prefixIcon"
          placeholder="输入图标名称"
          @input="handlePrefixIconChange"
        />
      </el-form-item>

      <!-- 后缀图标 -->
      <el-form-item label="后缀图标" v-if="isElementInput">
        <el-input
          v-model="inputForm.suffixIcon"
          placeholder="输入图标名称"
          @input="handleSuffixIconChange"
        />
      </el-form-item>

    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme'

const props = defineProps<{
  updateComponent: (item: ComponentItem | PageConfig) => void
  getCurrentComponent: () => ComponentItem | PageConfig | undefined
}>()

// 输入框表单数据
const inputForm = reactive({
  placeholder: '',
  type: 'text',
  size: 'default',
  disabled: false,
  readonly: false,
  clearable: false,
  showPassword: false,
  maxlength: 0,
  minlength: 0,
  rows: 3,
  autosize: false,
  prefixIcon: '',
  suffixIcon: ''
})

const currentComponent = computed(() => props.getCurrentComponent())

// 判断是否是Element输入框
const isElementInput = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return comp.name === 'ElInput'
})

onMounted(() => {
  initFormData()
})

watch(() => currentComponent.value, () => {
  initFormData()
}, { deep: true })

// 初始化表单数据
function initFormData() {
  const comp = currentComponent.value
  if (!comp) return
  
  // 重置表单
  Object.assign(inputForm, {
    placeholder: '',
    type: 'text',
    size: 'default',
    disabled: false,
    readonly: false,
    clearable: false,
    showPassword: false,
    maxlength: 0,
    minlength: 0,
    rows: 3,
    autosize: false,
    prefixIcon: '',
    suffixIcon: ''
  })
  
  // 获取attrs属性
  if ('attrs' in comp && comp.attrs) {
    const attrs = comp.attrs as any
    if (attrs.placeholder) inputForm.placeholder = attrs.placeholder
    if (attrs.type) inputForm.type = attrs.type
    if (typeof attrs.disabled === 'boolean') inputForm.disabled = attrs.disabled
    if (typeof attrs.readonly === 'boolean') inputForm.readonly = attrs.readonly
    if (typeof attrs.maxlength === 'number') inputForm.maxlength = attrs.maxlength
    if (typeof attrs.minlength === 'number') inputForm.minlength = attrs.minlength
    if (typeof attrs.rows === 'number') inputForm.rows = attrs.rows
  }
  
  // 获取props属性
  if ('props' in comp && comp.props) {
    const props = comp.props as any
    if (props.placeholder) inputForm.placeholder = props.placeholder
    if (props.type) inputForm.type = props.type
    if (props.size) inputForm.size = props.size
    if (typeof props.disabled === 'boolean') inputForm.disabled = props.disabled
    if (typeof props.readonly === 'boolean') inputForm.readonly = props.readonly
    if (typeof props.clearable === 'boolean') inputForm.clearable = props.clearable
    if (typeof props.showPassword === 'boolean') inputForm.showPassword = props.showPassword
    if (typeof props.maxlength === 'number') inputForm.maxlength = props.maxlength
    if (typeof props.rows === 'number') inputForm.rows = props.rows
    if (typeof props.autosize === 'boolean') inputForm.autosize = props.autosize
    if (props.prefixIcon) inputForm.prefixIcon = props.prefixIcon
    if (props.suffixIcon) inputForm.suffixIcon = props.suffixIcon
  }
}

// 更新组件的通用方法
function updateComponentProps(changes: Record<string, any>) {
  const comp = currentComponent.value
  if (!comp) return
  
  const updatedComponent = { ...comp } as any
  
  // 确保props和attrs存在
  if (!updatedComponent.props) {
    updatedComponent.props = {}
  }
  if (!updatedComponent.attrs) {
    updatedComponent.attrs = {}
  }
  
  Object.entries(changes).forEach(([key, value]) => {
    // 同时更新props和attrs，确保兼容性
    updatedComponent.props[key] = value
    updatedComponent.attrs[key] = value
  })
  
  props.updateComponent(updatedComponent)
}

// 处理各种变化
function handlePlaceholderChange() {
  updateComponentProps({ placeholder: inputForm.placeholder })
}

function handleTypeChange() {
  updateComponentProps({ type: inputForm.type })
}

function handleSizeChange() {
  updateComponentProps({ size: inputForm.size })
}

function handleDisabledChange() {
  updateComponentProps({ disabled: inputForm.disabled })
}

function handleReadonlyChange() {
  updateComponentProps({ readonly: inputForm.readonly })
}

function handleClearableChange() {
  updateComponentProps({ clearable: inputForm.clearable })
}

function handleShowPasswordChange() {
  updateComponentProps({ showPassword: inputForm.showPassword })
}

function handleMaxlengthChange() {
  if (inputForm.maxlength > 0) {
    updateComponentProps({ maxlength: inputForm.maxlength })
  }
}

function handleMinlengthChange() {
  if (inputForm.minlength > 0) {
    updateComponentProps({ minlength: inputForm.minlength })
  }
}

function handleRowsChange() {
  updateComponentProps({ rows: inputForm.rows })
}

function handleAutosizeChange() {
  updateComponentProps({ autosize: inputForm.autosize })
}

function handlePrefixIconChange() {
  updateComponentProps({ prefixIcon: inputForm.prefixIcon })
}

function handleSuffixIconChange() {
  updateComponentProps({ suffixIcon: inputForm.suffixIcon })
}
</script>

<style scoped lang="scss">
.input-setting {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-select,
  .el-input-number {
    width: 100%;
  }
}
</style>