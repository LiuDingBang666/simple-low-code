<!--
@description: TODO 脱拽低代码设计器
@author: liudingbang
@date: 2025/9/1 14:38
-->

<template>
  <el-row class="header">
    <el-col class="header-column" :span="24">头部</el-col>
  </el-row>
  <el-row class="content">
    <el-col class="components" :span="6"></el-col>
    <el-col class="content" :span="12"></el-col>
    <el-col class="setting" :span="6"></el-col>
  </el-row>
</template>

<script setup lang="ts">
import useSchemeStore from '@/store/useSchemeStore.ts'
import { onMounted } from 'vue'

let scheme = useSchemeStore()
onMounted(() => {
  console.log(scheme)
  console.log(scheme.getScheme())
})
</script>

<style scoped lang="scss">
.header {
  height: 10vh;

  .header-column {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.content {
  height: 90vh;
}

.el-col {
  border: 0.5px solid rgba(128, 128, 128, 0.8);
}
</style>
