<!--
@description: TODO 画布渲染器
@author: liudingbang
@date: 2025/9/2 17:32
-->

<template>
  <div
    class="wrap-render-component"
    v-if="dataCanDrop"
    v-for="item in props.components"
    :key="item.id"
  >
    <Component
      :data-can-drop="
        (item.isCanNest ||
          item.isCanNestAll ||
          (item.canNestElements && item.canNestElements?.length > 0)) &&
        dataCanDrop
      "
      :data-id="item.id"
      draggable="true"
      :is="item.is ?? item.name"
      :style="parseStyles(item)"
      :ref="(e: any) => refInitDrawHooks(e, item)"
      v-bind="{ ...item.attrs, ...item.props }"
      id="render-component"
      :class="[item.id]"
      @click.stop="(e: Event) => handlerClick(e, item)"
    >
      <template v-if="item.showTitle && item.title">
        {{ item.title }}
      </template>
      <DrawRender
        v-if="item.children && item.children.length > 0"
        :components="item.children"
        :data-can-drop="dataCanDrop"
      />
    </Component>
    <div class="tip-content">{{ item.title }}</div>
  </div>
  <template v-else>
    <Component
      v-for="item in props.components"
      :key="item.id"
      :data-can-drop="
        (item.isCanNest ||
          item.isCanNestAll ||
          (item.canNestElements && item.canNestElements?.length > 0)) &&
        dataCanDrop
      "
      :data-id="item.id"
      draggable="true"
      :is="item.is ?? item.name"
      :style="parseStyles(item)"
      :ref="(e: any) => refInitDrawHooks(e, item)"
      v-bind="{ ...item.attrs, ...item.props }"
      id="render-component"
      :class="[item.id]"
      @click.stop="(e: Event) => handlerClick(e, item)"
    >
      <template v-if="item.showTitle && item.title">
        {{ item.title }}
      </template>
      <DrawRender
        v-if="item.children && item.children.length > 0"
        :components="item.children"
        :data-can-drop="dataCanDrop"
      />
    </Component>
  </template>
</template>

<script setup lang="ts">
import type { ComponentItem } from '@/types/draw/scheme.ts'
import { refInitDrawHooks } from '@/hooks/useDrawHooks.ts'
import { parseStyles } from '@/pages/draw/render/parse-styles.ts'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { onMounted } from 'vue'

let props = withDefaults(
  defineProps<{
    // 组件列表
    components: Array<ComponentItem>
    // 是否可以拖拽
    dataCanDrop: boolean
  }>(),
  {
    components: () => [],
    dataCanDrop: true,
  },
)

let { renderAllAsyncComponent } = useSchemeStore()
onMounted(() => {
  renderAllAsyncComponent()
})

function handlerClick(e: Event, item: ComponentItem) {
  let store = useActiveComponentStore()
  store.setActiveComponent({ target: (e.target as HTMLElement).parentElement } as Event, item)
}
</script>

<script lang="ts">
// 递归调用必须给组件命名
export default {
  name: 'DrawRender',
}
</script>

<style scoped lang="scss">
.wrap-render-component {
  position: relative;
  padding: 15px;
  margin: 5px;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid dodgerblue;

  .tip-content {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: dodgerblue;
    font-weight: bold;
  }
}
</style>
