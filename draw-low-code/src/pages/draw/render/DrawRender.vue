<!--
@description: TODO 画布渲染器
@author: liudingbang
@date: 2025/9/2 17:32
-->

<template>
  <component
    v-for="item in props.components"
    :key="item.id"
    :data-can-drop="item.isCanNest"
    :data-id="item.id"
    draggable="true"
    :is="item.is ?? item.name"
    :style="componentStyle(item)"
    v-bind="{ ...item.attrs, ...item.props }"
  >
    <DrawRender v-if="item.children && item.children.length > 0" :components="item.children" />
  </component>
</template>

<script setup lang="ts">
import type { ComponentItem } from '@/types/draw/scheme.ts'

let props = withDefaults(
  defineProps<{
    // 组件列表
    components: Array<ComponentItem>
  }>(),
  {
    components: () => [],
  },
)

/**
 * 组装样式
 * @param component
 */
function componentStyle(component: ComponentItem) {
  let afterStyle: Partial<StyleSheet> = {}
  if (component.classStyle) {
    Object.keys(component.classStyle).map((key) => {
      afterStyle = {
        ...afterStyle,
        ...component.classStyle![key],
      }
    })
  }
  if (component.idStyle) {
    Object.keys(component.idStyle).map((key) => {
      afterStyle = {
        ...afterStyle,
        ...component.idStyle![key],
      }
    })
  }
  afterStyle = {
    ...afterStyle,
    ...component.style,
  }
  return afterStyle
}
</script>

<script lang="ts">
// 递归调用必须给组件命名
export default {
  name: 'DrawRender',
}
</script>

<style scoped lang="scss"></style>
