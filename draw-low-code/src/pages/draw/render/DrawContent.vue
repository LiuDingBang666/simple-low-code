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
    <DrawRender />
  </div>
</template>

<script setup lang="ts">
import DrawRender from '@/pages/draw/render/DrawRender.vue'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { computed } from 'vue'

const { getScheme } = useSchemeStore()
// style > id > class
const pageStyle = computed(() => {
  const { page } = getScheme().value
  let afterStyle: Partial<StyleSheet> = {}
  if (page.classStyle) {
    Object.keys(page.classStyle).map((key) => {
      afterStyle = {
        ...afterStyle,
        ...page.classStyle![key],
      }
    })
  }
  if (page.idStyle) {
    Object.keys(page.idStyle).map((key) => {
      afterStyle = {
        ...afterStyle,
        ...page.idStyle![key],
      }
    })
  }
  afterStyle = {
    ...afterStyle,
    ...page.style,
  }
  return afterStyle
})
</script>

<style scoped lang="scss">
.render-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
