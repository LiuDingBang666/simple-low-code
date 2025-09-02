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
            fit="cover"
            :src="componentItem.icon"
            class="box"
            :ref="'componentRef' + groupIndex + '-' + componentIndex"
            v-bind="{ ...componentItem, ...componentItem.props }"
          ></el-image>

          <Component
            v-else
            data-can-drop="true"
            draggable="true"
            :ref="'componentRef' + groupIndex + '-' + componentIndex"
            :class="componentItem.isNative ? 'box' : ''"
            :is="componentItem.is ?? componentItem.name"
            v-bind="{ ...componentItem, ...componentItem.props }"
          >
            {{ componentItem.title }}
          </Component>
        </template>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue'
import initGroup from '@/pages/draw/component/component-group.ts'
import type { ComponentGroup } from '@/types/draw/scheme.ts'

const activeName = ref('1')
let group = reactive<Array<ComponentGroup>>([])
onMounted(async () => {
  group.splice(0, group.length, ...initGroup())
  if (group.length > 0) {
    activeName.value = group[0].name
  }
})
onMounted(() => {
  const instance = getCurrentInstance()
  if (instance) {
    for (let refsKey in instance.refs) {
      nextTick(() => {
        const refs = instance.refs[refsKey]
        console.log(refs)
      })
    }
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

.component-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
