<!--
@description: TODO 代码编辑器-css
@author: liudingbang
@date: 2025/9/4 10:29
-->

<template>
  <codemirror
    v-model="value"
    placeholder="请输入css或scss样式..."
    :style="{ height: '75vh' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="(e: any) => log('change', e)"
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { css } from '@codemirror/lang-css'
import { sass } from '@codemirror/lang-sass'

const value = defineModel('value', { default: '.example {\n  background: red;\n}' })

const extensions = [css(), sass()]
// Codemirror EditorView instance ref
const view = shallowRef()

const handleReady = (payload: any) => {
  view.value = payload.view
  console.log(view.value)
}

const emits = defineEmits(['change'])

function log(eventName: string, payload: Event) {
  console.log(eventName, payload)
  if (eventName === 'change') {
    emits('change', payload)
  }
}
</script>

<style scoped lang="scss"></style>
