<!--
@description: TODO 脱拽组件
@author: liudingbang
@date: 2025/9/1 16:43
-->

<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item
      :title="groupItem.name"
      v-bind="groupItem"
      v-for="(groupItem, groupIndex) in group"
      :key="groupIndex"
    >
      <div draggable="true" class="box" v-for="componentItem in groupItem.items">
        {{ componentItem.name }}
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import initGroup from '@/pages/draw/component/component-group.ts'
import type { ComponentGroup } from '@/types/draw/scheme.ts'

const activeName = ref('1')
let group = reactive<Array<ComponentGroup>>([])
onMounted(() => {
  group.splice(0, group.length, ...initGroup())
  if (group.length > 0) {
    activeName.value = group[0].name
  }
})
</script>

<style scoped lang="scss">
.box {
  width: 50px;
  height: 50px;
  margin: 5px;
  @include flex-center();
  border-radius: 5px;
  background-color: dodgerblue;
  color: white;
  cursor: grab;
}

:global(.drop-hover) {
  border: 1px solid dodgerblue !important;
}
</style>
