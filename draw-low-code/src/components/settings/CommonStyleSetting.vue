<!--
@description: 通用样式编辑器 - 支持常用CSS属性编辑
@author: liudingbang  
@date: 2025/9/21
-->

<template>
  <div class="common-style-editor">
    <el-form :model="styleForm" label-width="80px" size="small">
      
      <!-- 尺寸设置 -->
      <el-form-item label="宽度">
        <el-input 
          v-model="styleForm.width" 
          placeholder="如: 100px, 50%, auto"
          @input="updateStyle"
        />
      </el-form-item>
      
      <el-form-item label="高度">
        <el-input 
          v-model="styleForm.height" 
          placeholder="如: 100px, 50%, auto"
          @input="updateStyle"
        />
      </el-form-item>

      <!-- 间距设置 -->
      <el-form-item label="内边距">
        <el-input 
          v-model="styleForm.padding" 
          placeholder="如: 10px, 10px 20px"
          @input="updateStyle"
        />
      </el-form-item>
      
      <el-form-item label="外边距">
        <el-input 
          v-model="styleForm.margin" 
          placeholder="如: 10px, 10px 20px"
          @input="updateStyle"
        />
      </el-form-item>

      <!-- 颜色设置 -->
      <el-form-item label="背景色">
        <div class="color-input-group">
          <el-color-picker 
            v-model="styleForm.backgroundColor" 
            @change="updateStyle"
            show-alpha
          />
          <el-input 
            v-model="styleForm.backgroundColor" 
            placeholder="如: #ffffff, rgba(255,255,255,0.5)"
            @input="updateStyle"
            style="margin-left: 8px;"
          />
        </div>
      </el-form-item>
      
      <el-form-item label="文字颜色">
        <div class="color-input-group">
          <el-color-picker 
            v-model="styleForm.color" 
            @change="updateStyle"
          />
          <el-input 
            v-model="styleForm.color" 
            placeholder="如: #000000, red"
            @input="updateStyle"
            style="margin-left: 8px;"
          />
        </div>
      </el-form-item>

      <!-- 边框设置 -->
      <el-form-item label="边框">
        <el-input 
          v-model="styleForm.border" 
          placeholder="如: 1px solid #ccc"
          @input="updateStyle"
        />
      </el-form-item>
      
      <el-form-item label="圆角">
        <el-input 
          v-model="styleForm.borderRadius" 
          placeholder="如: 4px, 50%"
          @input="updateStyle"
        />
      </el-form-item>

      <!-- 字体设置 -->
      <el-form-item label="字体大小">
        <el-input 
          v-model="styleForm.fontSize" 
          placeholder="如: 14px, 1.2em"
          @input="updateStyle"
        />
      </el-form-item>
      
      <el-form-item label="字体粗细">
        <el-select v-model="styleForm.fontWeight" @change="updateStyle">
          <el-option label="正常" value="normal" />
          <el-option label="粗体" value="bold" />
          <el-option label="细体" value="lighter" />
          <el-option label="更粗" value="bolder" />
          <el-option label="100" value="100" />
          <el-option label="200" value="200" />
          <el-option label="300" value="300" />
          <el-option label="400" value="400" />
          <el-option label="500" value="500" />
          <el-option label="600" value="600" />
          <el-option label="700" value="700" />
          <el-option label="800" value="800" />
          <el-option label="900" value="900" />
        </el-select>
      </el-form-item>

      <!-- 文本对齐 -->
      <el-form-item label="文本对齐">
        <el-select v-model="styleForm.textAlign" @change="updateStyle">
          <el-option label="左对齐" value="left" />
          <el-option label="居中" value="center" />
          <el-option label="右对齐" value="right" />
          <el-option label="两端对齐" value="justify" />
        </el-select>
      </el-form-item>

      <!-- 显示设置 -->
      <el-form-item label="显示方式">
        <el-select v-model="styleForm.display" @change="updateStyle">
          <el-option label="块级" value="block" />
          <el-option label="行内" value="inline" />
          <el-option label="行内块" value="inline-block" />
          <el-option label="弹性布局" value="flex" />
          <el-option label="网格布局" value="grid" />
          <el-option label="隐藏" value="none" />
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import type { ComponentItem } from '@/types/draw/scheme'

// 接收来自父组件的props
const props = defineProps<{
  updateComponent?: (item: ComponentItem) => void
  getCurrentComponent?: () => ComponentItem | null
}>()

// 样式表单数据
const styleForm = reactive({
  width: '',
  height: '',
  padding: '',
  margin: '',
  backgroundColor: '',
  color: '',
  border: '',
  borderRadius: '',
  fontSize: '',
  fontWeight: '',
  textAlign: '',
  display: ''
})

// 初始化表单数据
function initFormData() {
  const currentComponent = props.getCurrentComponent?.()
  if (currentComponent?.defaultStyle) {
    const style = currentComponent.defaultStyle as any
    Object.keys(styleForm).forEach(key => {
      if (style[key]) {
        (styleForm as any)[key] = style[key] as string
      }
    })
  }
}

// 更新组件样式
function updateStyle() {
  const currentComponent = props.getCurrentComponent?.()
  if (!currentComponent || !props.updateComponent) return

  // 构建新的样式对象，过滤空值
  const newStyle = Object.entries(styleForm).reduce((acc, [key, value]) => {
    if (value && value.trim()) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, any>)

  // 更新组件
  const updatedComponent = {
    ...currentComponent,
    defaultStyle: {
      ...currentComponent.defaultStyle,
      ...newStyle
    }
  }
  
  props.updateComponent(updatedComponent)
}

onMounted(() => {
  initFormData()
})

// 监听当前组件变化，重新初始化表单
watch(() => props.getCurrentComponent?.(), () => {
  initFormData()
}, { deep: true })
</script>

<style scoped lang="scss">
.common-style-editor {
  .color-input-group {
    display: flex;
    align-items: center;
  }
  
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-select {
    width: 100%;
  }
  
  .el-color-picker {
    flex-shrink: 0;
  }
}
</style>