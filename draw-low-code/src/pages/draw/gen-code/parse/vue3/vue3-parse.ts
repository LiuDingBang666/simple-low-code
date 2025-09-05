/**
 * @name: 名称
 * @description: TODO vue3页面解析器
 * @author: liudingbang
 * @date: 2025/9/5 14:33
 */
import type { DrawScheme } from '@/types/draw/scheme.ts'
import { getProjectAllCode } from '@/utils/file-utils.ts'

interface Vue3ParseScheme {
  // 模板
  templates: string
  // 引入
  imports: string
  // 脚本
  scripts: string
  // 样式
  styles: string
}

/**
 * 默认的Vue3解析器
 * @param scheme 低代码协议
 */
export async function defaultVue3ParseScheme(scheme: DrawScheme): Promise<Record<string, string>> {
  let variables: Vue3ParseScheme = {
    templates: '',
    imports: '',
    scripts: '',
    styles: '',
  }
  // 解析内容
  const appendFiles = parseScheme(scheme, variables)
  // 定义主模版
  let mainTemplate = `<template>
    ${variables.templates}
</template>

<script setup lang="ts">
    ${variables.imports}
    ${variables.scripts}
</script>

<style scoped lang="scss">
    ${variables.styles}
</style>`
  // 返回最终需要的所有文件 格式:文件名 -》 内容
  return {
    ...appendFiles,
    'index.vue': mainTemplate,
  } as Record<string, string>
}

/**
 * 默认的 vue3 解析器
 * @param scheme 低代码AST语法树
 * @param variables 模板变量
 */
function parseScheme(scheme: DrawScheme, variables: Vue3ParseScheme): Record<string, string> {
  // todo 追加需要导入的文件信息(比如组件信息)
  console.log(scheme)
  console.log(variables)
  console.log(getProjectAllCode())
  return {}
}
