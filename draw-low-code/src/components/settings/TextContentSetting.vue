<!--
@description: 文本内容编辑器 - 支持各种文本类组件的内容编辑
@author: liudingbang
@date: 2025/9/21
-->

<template>
  <div class="text-content-setting">
    <el-form :model="textForm" label-width="80px" size="small">
      
      <!-- 文本内容 -->
      <el-form-item label="文本内容">
        <el-input
          v-model="textForm.content"
          placeholder="输入文本内容"
          type="textarea"
          :rows="3"
          @input="handleTextChange"
        />
      </el-form-item>

      <!-- 占位符文本（仅输入框类组件） -->
      <el-form-item 
        label="占位符" 
        v-if="isInputComponent"
      >
        <el-input
          v-model="textForm.placeholder"
          placeholder="输入占位符文本"
          @input="handlePlaceholderChange"
        />
      </el-form-item>

      <!-- 标题文本（仅特定组件） -->
      <el-form-item 
        label="标题" 
        v-if="isTitleComponent"
      >
        <el-input
          v-model="textForm.title"
          placeholder="输入标题文本"
          @input="handleTitleChange"
        />
      </el-form-item>

      <!-- 链接地址（仅链接组件） -->
      <el-form-item 
        label="链接地址" 
        v-if="isLinkComponent"
      >
        <el-input
          v-model="textForm.href"
          placeholder="输入链接地址"
          @input="handleHrefChange"
        />
      </el-form-item>

      <!-- 图片地址（仅图片组件） -->
      <el-form-item 
        label="图片地址" 
        v-if="isImageComponent"
      >
        <el-input
          v-model="textForm.src"
          placeholder="输入图片地址"
          @input="handleSrcChange"
        />
      </el-form-item>

      <!-- Alt文本（仅图片组件） -->
      <el-form-item 
        label="Alt文本" 
        v-if="isImageComponent"
      >
        <el-input
          v-model="textForm.alt"
          placeholder="输入图片描述"
          @input="handleAltChange"
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

// 文本表单数据
const textForm = reactive({
  content: '',
  placeholder: '',
  title: '',
  href: '',
  src: '',
  alt: ''
})

const currentComponent = computed(() => props.getCurrentComponent())

// 判断组件类型
const isInputComponent = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return ['input', 'textarea', 'ElInput', 'ElSelect', 'ElDatePicker', 'ElTimePicker'].includes(comp.name)
})

const isTitleComponent = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return ['ElAlert', 'ElDialog', 'ElDrawer', 'ElCard', 'ElCollapseItem'].includes(comp.name)
})

const isLinkComponent = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return comp.name === 'a'
})

const isImageComponent = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return comp.name === 'img'
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
  Object.keys(textForm).forEach(key => {
    textForm[key as keyof typeof textForm] = ''
  })
  
  if ('value' in comp && comp.value) {
    textForm.content = comp.value
  } else if ('title' in comp && comp.title && comp.name !== 'ElAlert') {
    textForm.content = comp.title
  }
  
  // 初始化其他属性
  if ('attrs' in comp && comp.attrs) {
    const attrs = comp.attrs as any
    if (attrs.placeholder) textForm.placeholder = attrs.placeholder
    if (attrs.href) textForm.href = attrs.href
    if (attrs.src) textForm.src = attrs.src
    if (attrs.alt) textForm.alt = attrs.alt
  }
  
  if ('props' in comp && comp.props) {
    const props = comp.props as any
    if (props.placeholder) textForm.placeholder = props.placeholder
    if (props.title) textForm.title = props.title
  }
}

// 更新组件的通用方法
function updateComponentWithChanges(changes: Record<string, any>) {
  const comp = currentComponent.value
  if (!comp) return
  
  const updatedComponent = { ...comp } as any
  
  Object.entries(changes).forEach(([key, value]) => {
    if (key === 'content') {
      // 处理文本内容
      if ('value' in comp) {
        updatedComponent.value = value
      } else if ('showTitle' in comp && comp.showTitle) {
        updatedComponent.value = value
      }
    } else if (key === 'placeholder' || key === 'href' || key === 'src' || key === 'alt') {
      // 处理属性
      if (!updatedComponent.attrs) updatedComponent.attrs = {}
      if (!updatedComponent.props) updatedComponent.props = {}
      updatedComponent.attrs[key] = value
      updatedComponent.props[key] = value
    } else if (key === 'title') {
      // 处理标题
      if (!updatedComponent.props) updatedComponent.props = {}
      updatedComponent.props.title = value
    }
  })
  
  props.updateComponent(updatedComponent)
}

// 处理各种变化
function handleTextChange() {
  updateComponentWithChanges({ content: textForm.content })
}

function handlePlaceholderChange() {
  updateComponentWithChanges({ placeholder: textForm.placeholder })
}

function handleTitleChange() {
  updateComponentWithChanges({ title: textForm.title })
}

function handleHrefChange() {
  updateComponentWithChanges({ href: textForm.href })
}

function handleSrcChange() {
  updateComponentWithChanges({ src: textForm.src })
}

function handleAltChange() {
  updateComponentWithChanges({ alt: textForm.alt })
}
</script>

<style scoped lang="scss">
.text-content-setting {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-textarea {
    width: 100%;
  }
}
</style>