<!--
@description: TODO 脱拽组件
@author: liudingbang
@date: 2025/9/1 16:43
-->

<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item title="一致性 Consistency" name="1">
      <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
      <div>
        在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('1')
</script>

<style scoped lang="scss"></style>
