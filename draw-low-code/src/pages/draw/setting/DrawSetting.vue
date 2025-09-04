<!--
@description: TODO 属性设置器
@author: liudingbang
@date: 2025/9/4 09:16
-->

<template>
  <div class="title">属性设置</div>
  <div class="collapse">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="通用" name="1">
        <CodeEditor v-model:value="value" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import type { CollapseModelValue } from 'element-plus'
import { ref } from 'vue'
import CodeEditor from '@/components/CodeEditor.vue'

const activeNames = ref(['1'])
let value = ref('')
const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}
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
</style>
