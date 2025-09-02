<!--
@description: TODO 画板渲染器
@author: liudingbang
@date: 2025/9/2 09:19
-->

<template>
  <div class="full-wh" data-can-drop="true"></div>
</template>

<script setup lang="ts">
import useSchemeStore from '@/store/useSchemeStore.ts'
import { onMounted, useId } from 'vue'

let scheme = useSchemeStore()
onMounted(() => {
  console.log(useId())
})
</script>

<style scoped lang="scss"></style>
