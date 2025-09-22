<!--
@description: 按钮专用编辑器 - 支持按钮特有属性编辑
@author: liudingbang
@date: 2025/9/21
-->

<template>
  <div class="button-setting">
    <el-form :model="buttonForm" label-width="80px" size="small">
      
      <!-- 按钮文本 -->
      <el-form-item label="按钮文本">
        <el-input
          v-model="buttonForm.text"
          placeholder="输入按钮文本"
          @input="handleTextChange"
        />
      </el-form-item>

      <!-- 按钮类型 -->
      <el-form-item label="按钮类型">
        <el-select v-model="buttonForm.type" @change="handleTypeChange">
          <el-option label="主要" value="primary" />
          <el-option label="成功" value="success" />
          <el-option label="警告" value="warning" />
          <el-option label="危险" value="danger" />
          <el-option label="信息" value="info" />
          <el-option label="默认" value="default" />
        </el-select>
      </el-form-item>

      <!-- 按钮尺寸 -->
      <el-form-item label="按钮尺寸">
        <el-select v-model="buttonForm.size" @change="handleSizeChange">
          <el-option label="大" value="large" />
          <el-option label="默认" value="default" />
          <el-option label="小" value="small" />
        </el-select>
      </el-form-item>

      <!-- 是否禁用 -->
      <el-form-item label="禁用状态">
        <el-switch
          v-model="buttonForm.disabled"
          @change="handleDisabledChange"
        />
      </el-form-item>

      <!-- 是否加载中 -->
      <el-form-item label="加载状态" v-if="isElementButton">
        <el-switch
          v-model="buttonForm.loading"
          @change="handleLoadingChange"
        />
      </el-form-item>

      <!-- 图标 -->
      <el-form-item label="图标" v-if="isElementButton">
        <el-input
          v-model="buttonForm.icon"
          placeholder="输入图标名称"
          @input="handleIconChange"
        />
      </el-form-item>

      <!-- 是否朴素按钮 -->
      <el-form-item label="朴素按钮" v-if="isElementButton">
        <el-switch
          v-model="buttonForm.plain"
          @change="handlePlainChange"
        />
      </el-form-item>

      <!-- 是否圆角按钮 -->
      <el-form-item label="圆角按钮" v-if="isElementButton">
        <el-switch
          v-model="buttonForm.round"
          @change="handleRoundChange"
        />
      </el-form-item>

      <!-- 是否圆形按钮 -->
      <el-form-item label="圆形按钮" v-if="isElementButton">
        <el-switch
          v-model="buttonForm.circle"
          @change="handleCircleChange"
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

// 按钮表单数据
const buttonForm = reactive({
  text: '',
  type: 'primary',
  size: 'default',
  disabled: false,
  loading: false,
  icon: '',
  plain: false,
  round: false,
  circle: false
})

const currentComponent = computed(() => props.getCurrentComponent())

// 判断是否是Element按钮
const isElementButton = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return comp.name === 'ElButton'
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
  Object.assign(buttonForm, {
    text: '',
    type: 'primary',
    size: 'default',
    disabled: false,
    loading: false,
    icon: '',
    plain: false,
    round: false,
    circle: false
  })
  
  // 获取文本内容
  if ('value' in comp && comp.value) {
    buttonForm.text = comp.value
  } else if ('title' in comp && comp.title) {
    buttonForm.text = comp.title
  }
  
  // 获取props属性
  if ('props' in comp && comp.props) {
    const props = comp.props as any
    if (props.type) buttonForm.type = props.type
    if (props.size) buttonForm.size = props.size
    if (typeof props.disabled === 'boolean') buttonForm.disabled = props.disabled
    if (typeof props.loading === 'boolean') buttonForm.loading = props.loading
    if (props.icon) buttonForm.icon = props.icon
    if (typeof props.plain === 'boolean') buttonForm.plain = props.plain
    if (typeof props.round === 'boolean') buttonForm.round = props.round
    if (typeof props.circle === 'boolean') buttonForm.circle = props.circle
  }
}

// 更新组件的通用方法
function updateComponentProps(changes: Record<string, any>) {
  const comp = currentComponent.value
  if (!comp) return
  
  const updatedComponent = { ...comp } as any
  
  // 更新props
  if (!updatedComponent.props) {
    updatedComponent.props = {}
  }
  
  Object.entries(changes).forEach(([key, value]) => {
    if (key === 'text') {
      // 更新文本内容
      if ('value' in comp) {
        updatedComponent.value = value
      } else if ('title' in comp) {
        updatedComponent.title = value
      }
    } else {
      // 更新props
      updatedComponent.props[key] = value
    }
  })
  
  props.updateComponent(updatedComponent)
}

// 处理各种变化
function handleTextChange() {
  updateComponentProps({ text: buttonForm.text })
}

function handleTypeChange() {
  updateComponentProps({ type: buttonForm.type })
}

function handleSizeChange() {
  updateComponentProps({ size: buttonForm.size })
}

function handleDisabledChange() {
  updateComponentProps({ disabled: buttonForm.disabled })
}

function handleLoadingChange() {
  updateComponentProps({ loading: buttonForm.loading })
}

function handleIconChange() {
  updateComponentProps({ icon: buttonForm.icon })
}

function handlePlainChange() {
  updateComponentProps({ plain: buttonForm.plain })
}

function handleRoundChange() {
  updateComponentProps({ round: buttonForm.round })
}

function handleCircleChange() {
  updateComponentProps({ circle: buttonForm.circle })
}
</script>

<style scoped lang="scss">
.button-setting {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-select {
    width: 100%;
  }
}
</style>