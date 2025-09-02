<!--
@description: TODO 脱拽组件
@author: liudingbang
@date: 2025/9/1 16:43
-->

<template>
  <el-collapse v-model="activeName">
    <el-collapse-item
      :title="groupItem.name"
      v-bind="groupItem"
      v-for="(groupItem, groupIndex) in group"
      :key="groupIndex"
    >
      <div class="component-list">
        <template v-for="(componentItem, componentIndex) in groupItem.items" :key="componentIndex">
          <el-image
            v-if="componentItem.icon"
            draggable="true"
            class="box"
            fit="cover"
            :src="componentItem.icon"
            :ref="(e: any) => refInit(e, componentItem)"
            v-bind="{ ...componentItem.props, ...componentItem.attrs }"
          ></el-image>

          <Component
            v-else
            draggable="true"
            id="drag-box"
            :class="componentItem.isNative ? 'box' : undefined"
            :is="componentItem.is ?? componentItem.name"
            :ref="(e: any) => refInit(e, componentItem)"
            v-bind="{ ...componentItem.props, ...componentItem.attrs }"
          >
            {{ componentItem.title }}
          </Component>
        </template>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import initGroup from '@/pages/draw/component/component-group.ts'
import type { ComponentGroup, ComponentItem } from '@/types/draw/scheme.ts'
import useDrawHooks from '@/hooks/useDrawHooks.ts'

const activeName = ref('1')
let group = reactive<Array<ComponentGroup>>([])
onMounted(async () => {
  group.splice(0, group.length, ...initGroup())
  if (group.length > 0) {
    activeName.value = group[0].name
  }
})

function refInit(value: any, componentItem: Omit<ComponentItem, 'id'>) {
  if (value instanceof HTMLElement) {
    useDrawHooks(value, componentItem)
  } else if (value instanceof Object) {
    if (value.$el) {
      useDrawHooks(value.$el, componentItem)
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  width: 50px;
  height: 50px;
  margin: 5px;
  @include variables.flex-center();
  border-radius: 5px;
  background-color: dodgerblue;
  color: white;
  cursor: grab;
  display: inline-block;
  text-align: center;
  line-height: 50px;
}

.component-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
