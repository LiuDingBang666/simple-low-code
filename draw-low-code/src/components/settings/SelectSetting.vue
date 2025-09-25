<!--
@description: 选择器专用编辑器 - 支持选择器特有属性编辑
@author: liudingbang
@date: 2025/9/21
-->

<template>
  <div class="select-setting">
    <el-form :model="selectForm" label-width="80px" size="small">
      
      <!-- 占位符 -->
      <el-form-item label="占位符">
        <el-input
          v-model="selectForm.placeholder"
          placeholder="输入占位符文本"
          @input="handlePlaceholderChange"
        />
      </el-form-item>

      <!-- 选择器尺寸 -->
      <el-form-item label="选择器尺寸" v-if="isElementSelect">
        <el-select v-model="selectForm.size" @change="handleSizeChange">
          <el-option label="大" value="large" />
          <el-option label="默认" value="default" />
          <el-option label="小" value="small" />
        </el-select>
      </el-form-item>

      <!-- 是否多选 -->
      <el-form-item label="多选模式" v-if="isElementSelect">
        <el-switch
          v-model="selectForm.multiple"
          @change="handleMultipleChange"
        />
      </el-form-item>

      <!-- 是否可清空 -->
      <el-form-item label="可清空" v-if="isElementSelect">
        <el-switch
          v-model="selectForm.clearable"
          @change="handleClearableChange"
        />
      </el-form-item>

      <!-- 是否可搜索 -->
      <el-form-item label="可搜索" v-if="isElementSelect">
        <el-switch
          v-model="selectForm.filterable"
          @change="handleFilterableChange"
        />
      </el-form-item>

      <!-- 是否禁用 -->
      <el-form-item label="禁用状态">
        <el-switch
          v-model="selectForm.disabled"
          @change="handleDisabledChange"
        />
      </el-form-item>

      <!-- 选项管理 -->
      <el-form-item label="选项管理">
        <div class="options-manager">
          <div class="options-header">
            <span>选项列表</span>
            <el-button 
              type="primary" 
              size="small" 
              @click="addOption"
              :icon="'Plus'"
            >
              添加选项
            </el-button>
          </div>
          
          <div class="options-list">
            <div 
              v-for="(option, index) in selectForm.options" 
              :key="index"
              class="option-item"
            >
              <el-input
                v-model="option.label"
                placeholder="显示文本"
                size="small"
                @input="handleOptionsChange"
              />
              <el-input
                v-model="option.value"
                placeholder="选项值"
                size="small"
                @input="handleOptionsChange"
              />
              <el-switch
                v-model="option.disabled"
                size="small"
                inactive-text="禁用"
                @change="handleOptionsChange"
              />
              <el-button
                type="danger"
                size="small"
                @click="removeOption(index)"
                :icon="'Delete'"
              />
            </div>
          </div>
          
          <div class="options-footer" v-if="selectForm.options.length === 0">
            <div class="empty-options">
              暂无选项，请添加选项
            </div>
          </div>
        </div>
      </el-form-item>

      <!-- 最多选择数量 -->
      <el-form-item label="最多选择" v-if="isElementSelect && selectForm.multiple">
        <el-input-number
          v-model="selectForm.multipleLimit"
          :min="0"
          @change="handleMultipleLimitChange"
        />
      </el-form-item>

      <!-- 折叠标签 -->
      <el-form-item label="折叠标签" v-if="isElementSelect && selectForm.multiple">
        <el-switch
          v-model="selectForm.collapseTags"
          @change="handleCollapseTagsChange"
        />
      </el-form-item>

      <!-- 预览效果 -->
      <el-form-item label="预览">
        <div class="select-preview">
          <el-select
            :placeholder="selectForm.placeholder"
            :size="selectForm.size"
            :multiple="selectForm.multiple"
            :clearable="selectForm.clearable"
            :filterable="selectForm.filterable"
            :disabled="selectForm.disabled"
            :multiple-limit="selectForm.multipleLimit"
            :collapse-tags="selectForm.collapseTags"
            style="width: 100%"
          >
            <el-option
              v-for="option in selectForm.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            />
          </el-select>
        </div>
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

// 选择器表单数据
const selectForm = reactive({
  placeholder: '请选择',
  size: 'default',
  multiple: false,
  clearable: false,
  filterable: false,
  disabled: false,
  multipleLimit: 0,
  collapseTags: false,
  options: [] as Array<{ label: string; value: string; disabled: boolean }>
})

const currentComponent = computed(() => props.getCurrentComponent())

// 判断是否是Element选择器
const isElementSelect = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return comp.name === 'ElSelect'
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
  Object.assign(selectForm, {
    placeholder: '请选择',
    size: 'default',
    multiple: false,
    clearable: false,
    filterable: false,
    disabled: false,
    multipleLimit: 0,
    collapseTags: false,
    options: []
  })
  
  // 获取props属性
  if ('props' in comp && comp.props) {
    const props = comp.props as any
    if (props.placeholder) selectForm.placeholder = props.placeholder
    if (props.size) selectForm.size = props.size
    if (typeof props.multiple === 'boolean') selectForm.multiple = props.multiple
    if (typeof props.clearable === 'boolean') selectForm.clearable = props.clearable
    if (typeof props.filterable === 'boolean') selectForm.filterable = props.filterable
    if (typeof props.disabled === 'boolean') selectForm.disabled = props.disabled
    if (typeof props.multipleLimit === 'number') selectForm.multipleLimit = props.multipleLimit
    if (typeof props.collapseTags === 'boolean') selectForm.collapseTags = props.collapseTags
    if (Array.isArray(props.options)) selectForm.options = [...props.options]
  }
  
  // 如果没有选项，添加默认选项
  if (selectForm.options.length === 0) {
    selectForm.options = [
      { label: '选项1', value: 'option1', disabled: false },
      { label: '选项2', value: 'option2', disabled: false },
      { label: '选项3', value: 'option3', disabled: false }
    ]
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
    updatedComponent.props[key] = value
  })
  
  props.updateComponent(updatedComponent)
}

// 处理各种变化
function handlePlaceholderChange() {
  updateComponentProps({ placeholder: selectForm.placeholder })
}

function handleSizeChange() {
  updateComponentProps({ size: selectForm.size })
}

function handleMultipleChange() {
  updateComponentProps({ multiple: selectForm.multiple })
}

function handleClearableChange() {
  updateComponentProps({ clearable: selectForm.clearable })
}

function handleFilterableChange() {
  updateComponentProps({ filterable: selectForm.filterable })
}

function handleDisabledChange() {
  updateComponentProps({ disabled: selectForm.disabled })
}

function handleMultipleLimitChange() {
  updateComponentProps({ multipleLimit: selectForm.multipleLimit })
}

function handleCollapseTagsChange() {
  updateComponentProps({ collapseTags: selectForm.collapseTags })
}

function handleOptionsChange() {
  updateComponentProps({ options: selectForm.options })
}

// 选项管理
function addOption() {
  selectForm.options.push({
    label: `选项${selectForm.options.length + 1}`,
    value: `option${selectForm.options.length + 1}`,
    disabled: false
  })
  handleOptionsChange()
}

function removeOption(index: number) {
  selectForm.options.splice(index, 1)
  handleOptionsChange()
}
</script>

<style scoped lang="scss">
.select-setting {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-select,
  .el-input-number {
    width: 100%;
  }
  
  .options-manager {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    
    .options-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: var(--color-bg-subtle);
      border-bottom: 1px solid var(--color-border);
      font-weight: 500;
    }
    
    .options-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .option-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--color-border-light);
      
      &:last-child {
        border-bottom: none;
      }
      
      .el-input {
        flex: 1;
      }
      
      .el-switch {
        flex-shrink: 0;
      }
      
      .el-button {
        flex-shrink: 0;
      }
    }
    
    .options-footer {
      padding: 20px;
      text-align: center;
      
      .empty-options {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-sm);
      }
    }
  }
  
  .select-preview {
    padding: 12px;
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }
}
</style>