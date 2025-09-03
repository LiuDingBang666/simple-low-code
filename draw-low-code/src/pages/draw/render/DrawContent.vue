<!--
@description: TODO 主画板-页面内容
@author: liudingbang
@date: 2025/9/2 09:19
-->

<template>
  <div
    class="render-content"
    data-can-drop="true"
    data-id="top-node"
    :style="pageStyle"
    v-bind="getScheme().value.page.attrs"
  >
    <DrawRender :components="getScheme().value.page.children!" />
  </div>
</template>

<script setup lang="ts">
import DrawRender from '@/pages/draw/render/DrawRender.vue'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { computed } from 'vue'
import { parseStyles } from '@/pages/draw/render/parse-styles.ts'

const { getScheme } = useSchemeStore()
// style > id > class
const pageStyle = computed(() => {
  const { page } = getScheme().value
  return parseStyles(page)
})
</script>

<style scoped lang="scss">
.render-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
