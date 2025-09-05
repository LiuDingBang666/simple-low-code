<!--
@description: TODO 代码样式编辑器-css
@author: liudingbang
@date: 2025/9/4 10:29
-->

<template>
  <codemirror
    v-model="value"
    placeholder="请输入css样式..."
    :autofocus="false"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="(e: any) => log('change', e)"
  />
</template>

<script setup lang="ts">
import { onMounted, shallowRef, useAttrs } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { css } from '@codemirror/lang-css'
import type { SettingPlugin } from '@/types/draw/setting.ts'
import * as csstree from 'css-tree'
import type { ComponentStyle } from '@/types/draw/scheme.ts'

const value = defineModel('value', { default: '.main {\nbackground: red;\n}' })

const extensions = [css()]
// Codemirror EditorView instance ref
const view = shallowRef()

const handleReady = (payload: any) => {
  view.value = payload.view
  // console.log(view.value)
}

function log(eventName: string, payload: Event) {
  // console.log(eventName, payload)
  if (eventName === 'change') {
    let styles = parseCssToRecord(payload as unknown as string)
    // console.log(styles)
    let keys = Object.keys(styles)
    // 区分id和class
    let idStyle = keys.filter((key) => key.startsWith('#'))
    let classStyle = keys.filter((key) => key.startsWith('.'))
    let mergerStyles: ComponentStyle = {
      idStyle: {},
      classStyle: {},
    }
    idStyle.forEach((id) => {
      mergerStyles.idStyle![id] = styles[id]
    })
    classStyle.forEach((name) => {
      mergerStyles.classStyle![name] = styles[name]
    })
    // console.log(mergerStyles)
    setting.updateComponent({ ...mergerStyles, value } as any)
    // console.log(setting)
  }
}

type CssRecord = Record<string, Record<string, string>>

function parseCssToRecord(css: string): CssRecord {
  const ast = csstree.parse(css, {
    parseValue: true,
    parseCustomProperty: true,
  })

  const result: CssRecord = {}

  function processRule(node: any, parentSelector = '') {
    if (node.type !== 'Rule') return

    const selector = csstree.generate(node.prelude).trim()
    const fullSelector = parentSelector ? parentSelector + ' ' + selector : selector

    if (!result[fullSelector]) {
      result[fullSelector] = {}
    }

    node.block.children.forEach((child: any) => {
      if (child.type === 'Declaration') {
        const prop = child.property
        const value = csstree.generate(child.value).trim()

        // ✅ 用 css-tree 的 lexer 校验属性和值
        const match = csstree.lexer.matchProperty(prop, child.value)

        if (!match.error) {
          result[fullSelector][prop] = value
        }
      } else if (child.type === 'Rule') {
        processRule(child, fullSelector)
      }
    })
  }

  csstree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      // 只处理顶层 rule，避免递归重复
      if ((node as any).parent?.type !== 'Block') {
        processRule(node)
      }
    },
  })

  return result
}

let setting: SettingPlugin = useAttrs() as unknown as SettingPlugin
onMounted(() => {
  let component = setting.getCurrentComponent()
  // console.log(component)
  if (component && component.value) {
    value.value = component.value
  }
})
</script>

<style scoped lang="scss"></style>
