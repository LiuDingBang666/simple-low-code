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
        <div>
          Consistent with real life: in line with the process and logic of real life, and comply
          with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such as: design style,
          icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import type { CollapseModelValue } from 'element-plus'
import { ref } from 'vue'

const activeNames = ref(['1'])
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
