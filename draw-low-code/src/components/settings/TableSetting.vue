<!--
@description: 表格专用编辑器 - 支持表格特有属性编辑
@author: liudingbang
@date: 2025/9/21
-->

<template>
  <div class="table-setting">
    <el-form :model="tableForm" label-width="80px" size="small">
      
      <!-- 表格尺寸 -->
      <el-form-item label="表格尺寸" v-if="isElementTable">
        <el-select v-model="tableForm.size" @change="handleSizeChange">
          <el-option label="大" value="large" />
          <el-option label="默认" value="default" />
          <el-option label="小" value="small" />
        </el-select>
      </el-form-item>

      <!-- 是否显示边框 -->
      <el-form-item label="显示边框" v-if="isElementTable">
        <el-switch
          v-model="tableForm.border"
          @change="handleBorderChange"
        />
      </el-form-item>

      <!-- 是否显示条纹 -->
      <el-form-item label="斑马纹" v-if="isElementTable">
        <el-switch
          v-model="tableForm.stripe"
          @change="handleStripeChange"
        />
      </el-form-item>

      <!-- 高亮当前行 -->
      <el-form-item label="高亮当前行" v-if="isElementTable">
        <el-switch
          v-model="tableForm.highlightCurrentRow"
          @change="handleHighlightCurrentRowChange"
        />
      </el-form-item>

      <!-- 表格高度 -->
      <el-form-item label="表格高度" v-if="isElementTable">
        <el-input
          v-model="tableForm.height"
          placeholder="如: 200, 50%"
          @input="handleHeightChange"
        />
      </el-form-item>

      <!-- 最大高度 -->
      <el-form-item label="最大高度" v-if="isElementTable">
        <el-input
          v-model="tableForm.maxHeight"
          placeholder="如: 300"
          @input="handleMaxHeightChange"
        />
      </el-form-item>

      <!-- 是否可以选择 -->
      <el-form-item label="行选择" v-if="isElementTable">
        <el-switch
          v-model="tableForm.rowSelection"
          @change="handleRowSelectionChange"
        />
      </el-form-item>

      <!-- 空数据文本 -->
      <el-form-item label="空数据文本" v-if="isElementTable">
        <el-input
          v-model="tableForm.emptyText"
          placeholder="暂无数据"
          @input="handleEmptyTextChange"
        />
      </el-form-item>

      <!-- 列配置 -->
      <el-form-item label="列配置">
        <div class="columns-manager">
          <div class="columns-header">
            <span>表格列</span>
            <el-button 
              type="primary" 
              size="small" 
              @click="addColumn"
              :icon="'Plus'"
            >
              添加列
            </el-button>
          </div>
          
          <div class="columns-list">
            <div 
              v-for="(column, index) in tableForm.columns" 
              :key="index"
              class="column-item"
            >
              <div class="column-row">
                <el-input
                  v-model="column.label"
                  placeholder="列标题"
                  size="small"
                  @input="handleColumnsChange"
                />
                <el-input
                  v-model="column.prop"
                  placeholder="数据字段"
                  size="small"
                  @input="handleColumnsChange"
                />
                <el-input
                  v-model="column.width"
                  placeholder="列宽"
                  size="small"
                  @input="handleColumnsChange"
                />
              </div>
              <div class="column-row">
                <el-select
                  v-model="column.align"
                  placeholder="对齐方式"
                  size="small"
                  @change="handleColumnsChange"
                >
                  <el-option label="左对齐" value="left" />
                  <el-option label="居中" value="center" />
                  <el-option label="右对齐" value="right" />
                </el-select>
                <el-switch
                  v-model="column.sortable"
                  size="small"
                  inactive-text="排序"
                  @change="handleColumnsChange"
                />
                <el-switch
                  v-model="column.resizable"
                  size="small"
                  inactive-text="可调整"
                  @change="handleColumnsChange"
                />
                <el-button
                  type="danger"
                  size="small"
                  @click="removeColumn(index)"
                  :icon="'Delete'"
                />
              </div>
            </div>
          </div>
          
          <div class="columns-footer" v-if="tableForm.columns.length === 0">
            <div class="empty-columns">
              暂无列配置，请添加列
            </div>
          </div>
        </div>
      </el-form-item>

      <!-- 数据管理 -->
      <el-form-item label="表格数据">
        <div class="data-manager">
          <div class="data-header">
            <span>数据行</span>
            <el-button 
              type="primary" 
              size="small" 
              @click="addDataRow"
              :icon="'Plus'"
            >
              添加行
            </el-button>
          </div>
          
          <div class="data-list">
            <div 
              v-for="(row, rowIndex) in tableForm.data" 
              :key="rowIndex"
              class="data-row"
            >
              <div class="row-header">
                <span>第{{ rowIndex + 1 }}行</span>
                <el-button
                  type="danger"
                  size="small"
                  @click="removeDataRow(rowIndex)"
                  :icon="'Delete'"
                />
              </div>
              <div class="row-data">
                <div 
                  v-for="column in tableForm.columns" 
                  :key="column.prop"
                  class="cell-input"
                >
                  <label>{{ column.label }}:</label>
                  <el-input
                    v-model="row[column.prop]"
                    :placeholder="column.label"
                    size="small"
                    @input="handleDataChange"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="data-footer" v-if="tableForm.data.length === 0">
            <div class="empty-data">
              暂无数据，请添加数据行
            </div>
          </div>
        </div>
      </el-form-item>

      <!-- 预览效果 -->
      <el-form-item label="预览">
        <div class="table-preview">
          <el-table
            :data="tableForm.data"
            :size="tableForm.size"
            :border="tableForm.border"
            :stripe="tableForm.stripe"
            :highlight-current-row="tableForm.highlightCurrentRow"
            :height="tableForm.height"
            :max-height="tableForm.maxHeight"
            :empty-text="tableForm.emptyText"
            style="width: 100%"
          >
            <el-table-column
              v-if="tableForm.rowSelection"
              type="selection"
              width="55"
            />
            <el-table-column
              v-for="column in tableForm.columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :align="column.align"
              :sortable="column.sortable"
              :resizable="column.resizable"
            />
          </el-table>
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

// 表格表单数据
const tableForm = reactive({
  size: 'default',
  border: false,
  stripe: false,
  highlightCurrentRow: false,
  height: '',
  maxHeight: '',
  rowSelection: false,
  emptyText: '暂无数据',
  columns: [] as Array<{
    label: string
    prop: string
    width: string
    align: string
    sortable: boolean
    resizable: boolean
  }>,
  data: [] as Array<Record<string, any>>
})

const currentComponent = computed(() => props.getCurrentComponent())

// 判断是否是Element表格
const isElementTable = computed(() => {
  const comp = currentComponent.value
  if (!comp || !('name' in comp)) return false
  return comp.name === 'ElTable'
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
  Object.assign(tableForm, {
    size: 'default',
    border: false,
    stripe: false,
    highlightCurrentRow: false,
    height: '',
    maxHeight: '',
    rowSelection: false,
    emptyText: '暂无数据',
    columns: [],
    data: []
  })
  
  // 获取props属性
  if ('props' in comp && comp.props) {
    const props = comp.props as any
    if (props.size) tableForm.size = props.size
    if (typeof props.border === 'boolean') tableForm.border = props.border
    if (typeof props.stripe === 'boolean') tableForm.stripe = props.stripe
    if (typeof props.highlightCurrentRow === 'boolean') tableForm.highlightCurrentRow = props.highlightCurrentRow
    if (props.height) tableForm.height = props.height
    if (props.maxHeight) tableForm.maxHeight = props.maxHeight
    if (typeof props.rowSelection === 'boolean') tableForm.rowSelection = props.rowSelection
    if (props.emptyText) tableForm.emptyText = props.emptyText
    if (Array.isArray(props.columns)) tableForm.columns = [...props.columns]
    if (Array.isArray(props.data)) tableForm.data = [...props.data]
  }
  
  // 如果没有列配置，添加默认列
  if (tableForm.columns.length === 0) {
    tableForm.columns = [
      { label: '姓名', prop: 'name', width: '', align: 'left', sortable: false, resizable: true },
      { label: '年龄', prop: 'age', width: '', align: 'center', sortable: true, resizable: true },
      { label: '地址', prop: 'address', width: '', align: 'left', sortable: false, resizable: true }
    ]
  }
  
  // 如果没有数据，添加示例数据
  if (tableForm.data.length === 0) {
    tableForm.data = [
      { name: '张三', age: 25, address: '北京市朝阳区' },
      { name: '李四', age: 30, address: '上海市浦东新区' },
      { name: '王五', age: 28, address: '广州市天河区' }
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
function handleSizeChange() {
  updateComponentProps({ size: tableForm.size })
}

function handleBorderChange() {
  updateComponentProps({ border: tableForm.border })
}

function handleStripeChange() {
  updateComponentProps({ stripe: tableForm.stripe })
}

function handleHighlightCurrentRowChange() {
  updateComponentProps({ highlightCurrentRow: tableForm.highlightCurrentRow })
}

function handleHeightChange() {
  updateComponentProps({ height: tableForm.height })
}

function handleMaxHeightChange() {
  updateComponentProps({ maxHeight: tableForm.maxHeight })
}

function handleRowSelectionChange() {
  updateComponentProps({ rowSelection: tableForm.rowSelection })
}

function handleEmptyTextChange() {
  updateComponentProps({ emptyText: tableForm.emptyText })
}

function handleColumnsChange() {
  updateComponentProps({ columns: tableForm.columns })
  // 当列配置改变时，需要确保数据结构匹配
  syncDataWithColumns()
}

function handleDataChange() {
  updateComponentProps({ data: tableForm.data })
}

// 列管理
function addColumn() {
  tableForm.columns.push({
    label: `列${tableForm.columns.length + 1}`,
    prop: `col${tableForm.columns.length + 1}`,
    width: '',
    align: 'left',
    sortable: false,
    resizable: true
  })
  handleColumnsChange()
}

function removeColumn(index: number) {
  const removedProp = tableForm.columns[index].prop
  tableForm.columns.splice(index, 1)
  
  // 从数据中移除对应的字段
  tableForm.data.forEach(row => {
    delete row[removedProp]
  })
  
  handleColumnsChange()
}

// 数据管理
function addDataRow() {
  const newRow: Record<string, any> = {}
  tableForm.columns.forEach(column => {
    newRow[column.prop] = ''
  })
  tableForm.data.push(newRow)
  handleDataChange()
}

function removeDataRow(index: number) {
  tableForm.data.splice(index, 1)
  handleDataChange()
}

// 同步数据结构与列配置
function syncDataWithColumns() {
  tableForm.data.forEach(row => {
    // 为新列添加空值
    tableForm.columns.forEach(column => {
      if (!(column.prop in row)) {
        row[column.prop] = ''
      }
    })
  })
}
</script>

<style scoped lang="scss">
.table-setting {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input,
  .el-select,
  .el-input-number {
    width: 100%;
  }
  
  .columns-manager,
  .data-manager {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    
    .columns-header,
    .data-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: var(--color-bg-subtle);
      border-bottom: 1px solid var(--color-border);
      font-weight: 500;
    }
    
    .columns-list,
    .data-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .column-item {
      padding: 12px;
      border-bottom: 1px solid var(--color-border-light);
      
      &:last-child {
        border-bottom: none;
      }
      
      .column-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .el-input {
          flex: 1;
        }
        
        .el-select {
          flex: 1;
        }
        
        .el-switch {
          flex-shrink: 0;
        }
        
        .el-button {
          flex-shrink: 0;
        }
      }
    }
    
    .data-row {
      padding: 12px;
      border-bottom: 1px solid var(--color-border-light);
      
      &:last-child {
        border-bottom: none;
      }
      
      .row-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .row-data {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 8px;
        
        .cell-input {
          label {
            display: block;
            font-size: var(--font-size-xs);
            color: var(--color-text-secondary);
            margin-bottom: 4px;
          }
        }
      }
    }
    
    .columns-footer,
    .data-footer {
      padding: 20px;
      text-align: center;
      
      .empty-columns,
      .empty-data {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-sm);
      }
    }
  }
  
  .table-preview {
    padding: 12px;
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow-x: auto;
  }
}
</style>