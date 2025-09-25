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
          class="component-list-item"
          draggable="true"
          id="drag-box"
          v-for="(componentItem, componentIndex) in groupItem.items"
          :ref="(e: any) => refInitDrawHooks(e, componentItem as any)"
          :key="componentIndex"
        >
          <el-image
            v-if="componentItem.icon"
            fit="cover"
            :src="componentItem.icon"
            :ref="(e: any) => refInitDrawHooks(e, componentItem)"
          ></el-image>
          {{ componentItem.title }}
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import initGroup from '@/pages/draw/component/component-group.ts'
import type { ComponentGroup } from '@/types/draw/scheme.ts'
import { refInitDrawHooks } from '@/hooks/useDrawHooks.ts'

const activeName = ref('1')
let group = reactive<Array<ComponentGroup>>([])
onMounted(async () => {
  group.splice(0, group.length, ...initGroup())
  if (group.length > 0) {
    activeName.value = group[0].name
  }
})
</script>

<style scoped lang="scss">
.component-list {
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: 80px;
    height: 80px;
    overflow: hidden;
    margin: 5px;
    @include variables.flex-center();
    border-radius: 5px;
    background-color: dodgerblue;
    color: white;
    cursor: grab;
    text-align: center;
    line-height: 50px;
  }
}

.title {
  width: 100%;
  font-weight: bold;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
