<!--
@description: TODO 脱拽组件
@author: liudingbang
@date: 2025/9/1 16:43
-->

<template>
  <div class="title">组件库</div>
  <el-collapse v-model="activeName">
    <el-collapse-item
      :title="groupItem.name"
      v-bind="groupItem"
      v-for="(groupItem, groupIndex) in group"
      :key="groupIndex"
    >
      <div class="component-list">
        <div
          v-for="(componentItem, componentIndex) in groupItem.items" 
          :key="componentIndex"
          class="component-item"
          draggable="true"
          @dragstart="handleDragStart($event, componentItem)"
        >
          {{ componentItem.title }}
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import initGroup from '@/pages/draw/component/component-group.ts'
import type { ComponentGroup, ComponentItem } from '@/types/draw/scheme.ts'

const activeName = ref('1')
let group = reactive<Array<ComponentGroup>>([])

// 处理拖拽开始
function handleDragStart(e: DragEvent, componentItem: ComponentItem) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('application/json', JSON.stringify(componentItem))
    e.dataTransfer.effectAllowed = 'copy'
  }
}

onMounted(async () => {
  const groups = initGroup()
  console.log('🔍 组件库调试信息:', {
    groupsLength: groups.length,
    groups: groups.map(g => ({
      name: g.name,
      itemsCount: g.items.length,
      items: g.items.map(item => ({
        title: item.title,
        name: item.name,
        category: (item as any).category
      }))
    }))
  })
  
  // 清空并重新填充数组
  group.length = 0
  groups.forEach(g => group.push(g))
  
  if (group.length > 0) {
    activeName.value = group[0].name
  }
})
</script>

<style scoped lang="scss">
.component-item {
  width: 80px;
  height: 60px;
  margin: 8px;
  @include variables.flex-center();
  border-radius: 8px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border);
  color: var(--color-text);
  cursor: grab;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  user-select: none;
  text-align: center;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  line-height: 1.2;
}

.component-item:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  border-color: var(--color-primary);
  background: var(--color-bg-soft);
}

.component-item:active { 
  transform: scale(.96); 
  background: var(--color-bg-subtle);
}

.component-list {
  display: flex;
  flex-wrap: wrap;
  padding: var(--gap-8) var(--gap-8) var(--gap-16);
}

.title {
  width: 100%;
  font-weight: 600;
  font-size: var(--font-size-sm);
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
