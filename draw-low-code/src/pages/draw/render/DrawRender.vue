<!--
@description: TODO 画布渲染器
@author: liudingbang
@date: 2025/9/2 17:32
-->

<template>
  <div>{{ getScheme().value }}</div>
</template>

<script setup lang="ts">
import useSchemeStore from '@/store/useSchemeStore.ts'
import { onMounted } from 'vue'

const { getScheme } = useSchemeStore()

onMounted(() => {
  console.log(getScheme().value)
})
</script>

<style scoped lang="scss"></style>
