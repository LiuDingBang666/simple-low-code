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
