<!--
@description: 对话框专用编辑器 - 支持对话框特有属性编辑
@author: liudingbang
@date: 2025/9/21
-->

<template>
  <div class="dialog-setting">
    <el-form :model="dialogForm" label-width="80px" size="small">
      
      <!-- 对话框标题 -->
      <el-form-item label="标题">
        <el-input
          v-model="dialogForm.title"
          placeholder="输入对话框标题"
          @input="handleTitleChange"
        />
      </el-form-item>

      <!-- 是否显示 -->
      <el-form-item label="显示状态">
        <el-switch
          v-model="dialogForm.visible"
          active-text="显示"
          inactive-text="隐藏"
          @change="handleVisibleChange"
        />
      </el-form-item>

      <!-- 对话框宽度 -->
      <el-form-item label="宽度">
        <el-input
          v-model="dialogForm.width"
          placeholder="如: 50%, 600px"
          @input="handleWidthChange"
        />
      </el-form-item>

      <!-- 是否全屏 -->
      <el-form-item label="全屏模式" v-if="isElementDialog">
        <el-switch
          v-model="dialogForm.fullscreen"
          @change="handleFullscreenChange"
        />
      </el-form-item>

      <!-- 顶部距离 -->
      <el-form-item label="顶部距离" v-if="isElementDialog && !dialogForm.fullscreen">
        <el-input
          v-model="dialogForm.top"
          placeholder="如: 15vh, 100px"
          @input="handleTopChange"
        />
      </el-form-item>

      <!-- 是否模态 -->
      <el-form-item label="模态对话框" v-if="isElementDialog">
        <el-switch
          v-model="dialogForm.modal"
          @change="handleModalChange"
        />
      </el-form-item>

      <!-- 点击遮罩关闭 -->
      <el-form-item label="点击遮罩关闭" v-if="isElementDialog">
        <el-switch
          v-model="dialogForm.closeOnClickModal"
          @change="handleCloseOnClickModalChange"
        />
      </el-form-item>

      <!-- 按ESC关闭 -->
      <el-form-item label="ESC关闭" v-if="isElementDialog">
        <el-switch
          v-model="dialogForm.closeOnPressEscape"
          @change="handleCloseOnPressEscapeChange"
        />
      </el-form-item>

      <!-- 显示关闭按钮 -->
      <el-form-item label="显示关闭按钮" v-if="isElementDialog">
        <el-switch
          v-model="dialogForm.showClose"
          @change="handleShowCloseChange"
        />
      </el-form-item>

      <!-- 是否可拖拽 -->
      <el-form-item label="可拖拽" v-if="isElementDialog">
        <el-switch
          v-model="dialogForm.draggable"
          @change="handleDraggableChange"
        />
      </el-form-item>

      <!-- 居中布局 -->
      <el-form-item label="居中布局" v-if="isElementDialog">
        <el-switch
          v-model="dialogForm.center"
          @change="handleCenterChange"
        />
      </el-form-item>

      <!-- 自定义类名 -->
      <el-form-item label="自定义类名" v-if="isElementDialog">
        <el-input
          v-model="dialogForm.customClass"
          placeholder="输入CSS类名"
          @input="handleCustomClassChange"
        />
      </el-form-item>

      <!-- 层级 -->
      <el-form-item label="层级" v-if="isElementDialog">
        <el-input-number
          v-model="dialogForm.zIndex"
          :min="1"
          @change="handleZIndexChange"
        />
      </el-form-item>

      <!-- 对话框内容 -->
      <el-form-item label="内容">
        <el-input
          v-model="dialogForm.content"
          type="textarea"
          :rows="4"
          placeholder="输入对话框内容"
          @input="handleContentChange"
        />
      </el-form-item>

      <!-- 头部插槽内容 -->
      <el-form-item label="头部内容" v-if="isElementDialog">
        <el-input
          v-model="dialogForm.headerContent"
          placeholder="自定义头部内容"
          @input="handleHeaderContentChange"
        />
      </el-form-item>

      <!-- 底部插槽内容 -->
      <el-form-item label="底部内容" v-if="isElementDialog">
        <el-input
          v-model="dialogForm.footerContent"
          type="textarea"
          :rows="2"
          placeholder="自定义底部内容"
          @input="handleFooterContentChange"
        />
      </el-form-item>

      <!-- 预览效果 -->
      <el-form-item label="预览">
        <div class="dialog-preview">
          <el-button 
            type="primary" 
            @click="showPreview"
            size="small"
          >
            预览对话框
          </el-button>
        </div>
      </el-form-item>

    </el-form>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      :title="dialogForm.title"
      :width="dialogForm.width"
      :fullscreen="dialogForm.fullscreen"
      :top="dialogForm.top"
      :modal="dialogForm.modal"
      :close-on-click-modal="dialogForm.closeOnClickModal"
      :close-on-press-escape="dialogForm.closeOnPressEscape"
      :show-close="dialogForm.showClose"
      :draggable="dialogForm.draggable"
      :center="dialogForm.center"
      :custom-class="dialogForm.customClass"
      :z-index="dialogForm.zIndex"
    >
      <template #header v-if="dialogForm.headerContent">
        <div v-html="dialogForm.headerContent"></div>
      </template>
      
      <div v-if="dialogForm.content">
        {{ dialogForm.content }}
      </div>
      <div v-else class="preview-placeholder">
        这里是对话框内容区域
      </div>
      
      <template #footer v-if="dialogForm.footerContent">
        <div v-html="dialogForm.footerContent"></div>
      </template>
      <template #footer v-else>
        <span class="dialog-footer">
          <el-button @click="previewVisible = false">取消</el-button>
          <el-button type="primary" @click="previewVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch, ref } from 'vue'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme'

const props = defineProps<{
  updateComponent: (item: ComponentItem | PageConfig) => void
  getCurrentComponent: () => ComponentItem | PageConfig | undefined
}>()

// 预览状态
const previewVisible = ref(false)

// 对话框表单数据
const dialogForm = reactive({
  title: '提示',
  visible: false,
  width: '50%',
  fullscreen: false,
  top: '15vh',
  modal: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  draggable: false,
  center: false,
  customClass: '',
  zIndex: 2000,
  content: '',
  headerContent: '',
  footerContent: ''
})

const currentComponent = computed(() => props.getCurrentComponent())

// 判断是否是Element对话框
const isElementDialog = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return comp.name === 'ElDialog'
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
  Object.assign(dialogForm, {
    title: '提示',
    visible: false,
    width: '50%',
    fullscreen: false,
    top: '15vh',
    modal: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    showClose: true,
    draggable: false,
    center: false,
    customClass: '',
    zIndex: 2000,
    content: '',
    headerContent: '',
    footerContent: ''
  })
  
  // 获取props属性
  if ('props' in comp && comp.props) {
    const props = comp.props as any
    if (props.title) dialogForm.title = props.title
    if (typeof props.visible === 'boolean') dialogForm.visible = props.visible
    if (props.width) dialogForm.width = props.width
    if (typeof props.fullscreen === 'boolean') dialogForm.fullscreen = props.fullscreen
    if (props.top) dialogForm.top = props.top
    if (typeof props.modal === 'boolean') dialogForm.modal = props.modal
    if (typeof props.closeOnClickModal === 'boolean') dialogForm.closeOnClickModal = props.closeOnClickModal
    if (typeof props.closeOnPressEscape === 'boolean') dialogForm.closeOnPressEscape = props.closeOnPressEscape
    if (typeof props.showClose === 'boolean') dialogForm.showClose = props.showClose
    if (typeof props.draggable === 'boolean') dialogForm.draggable = props.draggable
    if (typeof props.center === 'boolean') dialogForm.center = props.center
    if (props.customClass) dialogForm.customClass = props.customClass
    if (typeof props.zIndex === 'number') dialogForm.zIndex = props.zIndex
    if (props.content) dialogForm.content = props.content
    if (props.headerContent) dialogForm.headerContent = props.headerContent
    if (props.footerContent) dialogForm.footerContent = props.footerContent
  }
  
  // 获取内容属性
  if ('content' in comp && comp.content) {
    dialogForm.content = comp.content as string
  }
}

// 更新组件的通用方法
function updateComponentProps(changes: Record<string, any>) {
  const comp = currentComponent.value
  if (!comp) return
  
  const updatedComponent = { ...comp } as any
  
  // 确保props存在
  if (!updatedComponent.props) {
    updatedComponent.props = {}
  }
  
  Object.entries(changes).forEach(([key, value]) => {
    if (key === 'content') {
      updatedComponent.content = value
    } else {
      updatedComponent.props[key] = value
    }
  })
  
  props.updateComponent(updatedComponent)
}

// 处理各种变化
function handleTitleChange() {
  updateComponentProps({ title: dialogForm.title })
}

function handleVisibleChange() {
  updateComponentProps({ visible: dialogForm.visible })
}

function handleWidthChange() {
  updateComponentProps({ width: dialogForm.width })
}

function handleFullscreenChange() {
  updateComponentProps({ fullscreen: dialogForm.fullscreen })
}

function handleTopChange() {
  updateComponentProps({ top: dialogForm.top })
}

function handleModalChange() {
  updateComponentProps({ modal: dialogForm.modal })
}

function handleCloseOnClickModalChange() {
  updateComponentProps({ closeOnClickModal: dialogForm.closeOnClickModal })
}

function handleCloseOnPressEscapeChange() {
  updateComponentProps({ closeOnPressEscape: dialogForm.closeOnPressEscape })
}

function handleShowCloseChange() {
  updateComponentProps({ showClose: dialogForm.showClose })
}

function handleDraggableChange() {
  updateComponentProps({ draggable: dialogForm.draggable })
}

function handleCenterChange() {
  updateComponentProps({ center: dialogForm.center })
}

function handleCustomClassChange() {
  updateComponentProps({ customClass: dialogForm.customClass })
}

function handleZIndexChange() {
  updateComponentProps({ zIndex: dialogForm.zIndex })
}

function handleContentChange() {
  updateComponentProps({ content: dialogForm.content })
}

function handleHeaderContentChange() {
  updateComponentProps({ headerContent: dialogForm.headerContent })
}

function handleFooterContentChange() {
  updateComponentProps({ footerContent: dialogForm.footerContent })
}

// 显示预览
function showPreview() {
  previewVisible.value = true
}
</script>

<style scoped lang="scss">
.dialog-setting {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-select,
  .el-input-number {
    width: 100%;
  }
  
  .dialog-preview {
    padding: 12px;
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    text-align: center;
  }
  
  .preview-placeholder {
    color: var(--color-text-tertiary);
    font-style: italic;
    padding: 20px;
    text-align: center;
  }
  
  .dialog-footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
}
</style>