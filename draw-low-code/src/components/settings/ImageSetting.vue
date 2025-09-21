<!--
@description: 图片专用编辑器 - 支持图片特有属性编辑
@author: liudingbang
@date: 2025/9/21
-->

<template>
  <div class="image-setting">
    <el-form :model="imageForm" label-width="80px" size="small">
      
      <!-- 图片地址 -->
      <el-form-item label="图片地址">
        <el-input
          v-model="imageForm.src"
          placeholder="输入图片URL地址"
          @input="handleSrcChange"
        />
      </el-form-item>

      <!-- Alt文本 -->
      <el-form-item label="Alt文本">
        <el-input
          v-model="imageForm.alt"
          placeholder="输入图片描述文本"
          @input="handleAltChange"
        />
      </el-form-item>

      <!-- 图片尺寸 -->
      <el-form-item label="宽度">
        <el-input
          v-model="imageForm.width"
          placeholder="如: 200px, 50%, auto"
          @input="handleSizeChange"
        />
      </el-form-item>

      <el-form-item label="高度">
        <el-input
          v-model="imageForm.height"
          placeholder="如: 150px, auto"
          @input="handleSizeChange"
        />
      </el-form-item>

      <!-- 图片适应方式 -->
      <el-form-item label="适应方式">
        <el-select v-model="imageForm.objectFit" @change="handleObjectFitChange">
          <el-option label="覆盖" value="cover" />
          <el-option label="包含" value="contain" />
          <el-option label="填充" value="fill" />
          <el-option label="原始" value="none" />
          <el-option label="缩放" value="scale-down" />
        </el-select>
      </el-form-item>

      <!-- 图片位置 -->
      <el-form-item label="图片位置">
        <el-select v-model="imageForm.objectPosition" @change="handleObjectPositionChange">
          <el-option label="居中" value="center" />
          <el-option label="顶部" value="top" />
          <el-option label="底部" value="bottom" />
          <el-option label="左侧" value="left" />
          <el-option label="右侧" value="right" />
          <el-option label="左上" value="left top" />
          <el-option label="右上" value="right top" />
          <el-option label="左下" value="left bottom" />
          <el-option label="右下" value="right bottom" />
        </el-select>
      </el-form-item>

      <!-- 是否延迟加载 -->
      <el-form-item label="延迟加载">
        <el-switch
          v-model="imageForm.loading"
          active-text="lazy"
          inactive-text="eager"
          @change="handleLoadingChange"
        />
      </el-form-item>

      <!-- 跨域处理 -->
      <el-form-item label="跨域处理">
        <el-select v-model="imageForm.crossorigin" @change="handleCrossoriginChange">
          <el-option label="无" value="" />
          <el-option label="匿名" value="anonymous" />
          <el-option label="凭证" value="use-credentials" />
        </el-select>
      </el-form-item>

      <!-- 图片预览 -->
      <el-form-item label="预览">
        <div class="image-preview" v-if="imageForm.src">
          <img 
            :src="imageForm.src" 
            :alt="imageForm.alt"
            class="preview-img"
            @error="handleImageError"
          />
        </div>
        <div class="no-preview" v-else>
          暂无图片预览
        </div>
      </el-form-item>

    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  updateComponent: (item: ComponentItem | PageConfig) => void
  getCurrentComponent: () => ComponentItem | PageConfig | undefined
}>()

// 图片表单数据
const imageForm = reactive({
  src: '',
  alt: '',
  width: '',
  height: '',
  objectFit: 'cover',
  objectPosition: 'center',
  loading: false,
  crossorigin: ''
})

const currentComponent = computed(() => props.getCurrentComponent())

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
  Object.assign(imageForm, {
    src: '',
    alt: '',
    width: '',
    height: '',
    objectFit: 'cover',
    objectPosition: 'center',
    loading: false,
    crossorigin: ''
  })
  
  // 获取attrs属性
  if ('attrs' in comp && comp.attrs) {
    const attrs = comp.attrs as any
    if (attrs.src) imageForm.src = attrs.src
    if (attrs.alt) imageForm.alt = attrs.alt
    if (attrs.width) imageForm.width = attrs.width
    if (attrs.height) imageForm.height = attrs.height
    if (attrs.loading) imageForm.loading = attrs.loading === 'lazy'
    if (attrs.crossorigin) imageForm.crossorigin = attrs.crossorigin
  }
  
  // 获取样式属性
  if ('defaultStyle' in comp && comp.defaultStyle) {
    const style = comp.defaultStyle as any
    if (style.width) imageForm.width = style.width
    if (style.height) imageForm.height = style.height
    if (style.objectFit) imageForm.objectFit = style.objectFit
    if (style.objectPosition) imageForm.objectPosition = style.objectPosition
  }
}

// 更新组件的通用方法
function updateComponentProps(changes: Record<string, any>) {
  const comp = currentComponent.value
  if (!comp) return
  
  const updatedComponent = { ...comp } as any
  
  // 确保attrs和defaultStyle存在
  if (!updatedComponent.attrs) {
    updatedComponent.attrs = {}
  }
  if (!updatedComponent.defaultStyle) {
    updatedComponent.defaultStyle = {}
  }
  
  Object.entries(changes).forEach(([key, value]) => {
    if (['width', 'height', 'objectFit', 'objectPosition'].includes(key)) {
      // 样式相关属性
      updatedComponent.defaultStyle[key] = value
    } else {
      // HTML属性
      updatedComponent.attrs[key] = value
    }
  })
  
  props.updateComponent(updatedComponent)
}

// 处理各种变化
function handleSrcChange() {
  updateComponentProps({ src: imageForm.src })
}

function handleAltChange() {
  updateComponentProps({ alt: imageForm.alt })
}

function handleSizeChange() {
  updateComponentProps({ 
    width: imageForm.width,
    height: imageForm.height
  })
}

function handleObjectFitChange() {
  updateComponentProps({ objectFit: imageForm.objectFit })
}

function handleObjectPositionChange() {
  updateComponentProps({ objectPosition: imageForm.objectPosition })
}

function handleLoadingChange() {
  updateComponentProps({ loading: imageForm.loading ? 'lazy' : 'eager' })
}

function handleCrossoriginChange() {
  updateComponentProps({ crossorigin: imageForm.crossorigin })
}

function handleImageError() {
  ElMessage.warning('图片加载失败，请检查图片地址是否正确')
}
</script>

<style scoped lang="scss">
.image-setting {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-select {
    width: 100%;
  }
  
  .image-preview {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 8px;
    text-align: center;
    background: var(--color-bg-subtle);
    
    .preview-img {
      max-width: 200px;
      max-height: 150px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-sm);
    }
  }
  
  .no-preview {
    padding: 20px;
    text-align: center;
    color: var(--color-text-tertiary);
    background: var(--color-bg-subtle);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
  }
}
</style>