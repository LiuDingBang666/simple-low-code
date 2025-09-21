<!--
@description: TODO 主画板-页面内容
@author: liudingbang
@date: 2025/9/2 09:19
-->

<template>
  <div
    class="render-content"
    :data-can-drop="canDrag"
    id="render-component"
    data-id="top-node"
    :style="pageStyle"
    @click.stop="(e: Event) => handlerClick(e)"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter.prevent
  >
    <DrawRender :data-can-drop="canDrag" :components="getScheme().value.page.children!" />
  </div>
</template>

<script setup lang="ts">
import DrawRender from '@/pages/draw/render/DrawRender.vue'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { computed, onMounted, ref } from 'vue'
import { parseStyles } from '@/pages/draw/render/parse-styles.ts'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'
import { useRoute } from 'vue-router'
import type { ComponentItem } from '@/types/draw/scheme.ts'

const { getScheme, updateComponent } = useSchemeStore()

// style > id > class
const pageStyle = computed(() => {
  const { page } = getScheme().value
  return parseStyles(page)
})

let { setActiveComponent } = useActiveComponentStore()

function handlerClick(e: Event) {
  // @ts-ignore
  setActiveComponent(e, getScheme().value.page)
}

// 处理组件拖拽放置
function handleDrop(e: DragEvent) {
  e.preventDefault()
  if (!e.dataTransfer) return
  
  try {
    const componentData = JSON.parse(e.dataTransfer.getData('application/json'))
    if (componentData) {
      // 创建新的组件实例
      const newComponent: ComponentItem = {
        ...componentData,
        id: undefined, // 让store生成新的id
        // 添加一些默认样式来显示组件
        defaultStyle: {
          ...componentData.defaultStyle,
          position: 'relative',
          display: componentData.isNative ? 'block' : 'inline-block',
          margin: '8px'
        }
      }
      
      // 获取最接近的放置节点 (这里简化为顶层)
      const topNode = document.querySelector('[data-id="top-node"]') as HTMLElement
      const targetDom = e.target as HTMLElement
      
      // 使用store的updateComponent方法添加组件
      updateComponent({
        e,
        targetDom: topNode || targetDom,
        activeDom: e.target as HTMLElement,
        componentItem: newComponent,
        closestNode: topNode || targetDom,
        closestNodePosition: 'bottom'
      })
      
      console.log('添加组件:', newComponent)
    }
  } catch (error) {
    console.error('拖拽添加组件失败:', error)
  }
}

let route = useRoute()
let canDrag = ref(true)
onMounted(() => {
  console.log(route)
  if (route.meta && route.meta.drag == false) {
    canDrag.value = false
  }
})
</script>

<style scoped lang="scss">
.render-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
