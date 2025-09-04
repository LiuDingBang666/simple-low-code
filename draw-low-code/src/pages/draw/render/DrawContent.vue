<!--
@description: TODO 主画板-页面内容
@author: liudingbang
@date: 2025/9/2 09:19
-->

<template>
  <div
    class="render-content"
    data-can-drop="true"
    id="render-component"
    data-id="top-node"
    :style="pageStyle"
    @click.prevent.stop="(e: Event) => handlerClick(e)"
  >
    <DrawRender :components="getScheme().value.page.children!" />
  </div>
</template>

<script setup lang="ts">
import DrawRender from '@/pages/draw/render/DrawRender.vue'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { computed } from 'vue'
import { parseStyles } from '@/pages/draw/render/parse-styles.ts'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'

const { getScheme } = useSchemeStore()
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
</script>

<style scoped lang="scss">
.render-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
