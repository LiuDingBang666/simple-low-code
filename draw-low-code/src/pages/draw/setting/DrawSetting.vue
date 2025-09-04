<!--
@description: TODO 属性设置器
@author: liudingbang
@date: 2025/9/4 09:16
-->

<template>
  <div class="title">属性设置</div>
  <div
    class="collapse"
    v-if="getActiveComponent().value && Object.keys(getActiveComponent().value!).length > 0"
  >
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="通用" name="1">
        <CodeEditor v-model:value="value" />
      </el-collapse-item>
    </el-collapse>
  </div>
  <div v-else class="select-tip">请先选择组件...</div>
</template>

<script setup lang="ts">
import type { CollapseModelValue } from 'element-plus'
import { onMounted, ref } from 'vue'
import CodeEditor from '@/components/CodeEditor.vue'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'

const activeNames = ref(['1'])
let value = ref('')
const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}
let { getActiveComponent } = useActiveComponentStore()
onMounted(() => {
  console.log(getActiveComponent)
})
</script>

<style scoped lang="scss">
.title {
  width: 100%;
  font-weight: bold;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collapse {
  height: 100%;
  overflow: auto;
}

.select-tip {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.87);
}
</style>
