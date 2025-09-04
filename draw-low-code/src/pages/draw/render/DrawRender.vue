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
    :style="parseStyles(item)"
    :ref="(e: any) => refInitDrawHooks(e, item)"
    v-bind="{ ...item.attrs, ...item.props }"
    id="render-component"
    @click.stop="(e: Event) => handlerClick(e, item)"
  >
    <template v-if="item.value"> {{ item.value }}</template>
    <template v-else-if="item.showTitle && item.title">
      {{ item.title }}
    </template>
    <DrawRender v-if="item.children && item.children.length > 0" :components="item.children" />
  </component>
</template>

<script setup lang="ts">
import type { ComponentItem } from '@/types/draw/scheme.ts'
import { refInitDrawHooks } from '@/hooks/useDrawHooks.ts'
import { parseStyles } from '@/pages/draw/render/parse-styles.ts'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'

let props = withDefaults(
  defineProps<{
    // 组件列表
    components: Array<ComponentItem>
  }>(),
  {
    components: () => [],
  },
)

function handlerClick(e: Event, item: ComponentItem) {
  let store = useActiveComponentStore()
  store.setActiveComponent(e, item)
}
</script>

<script lang="ts">
// 递归调用必须给组件命名
export default {
  name: 'DrawRender',
}
</script>

<style scoped lang="scss"></style>
