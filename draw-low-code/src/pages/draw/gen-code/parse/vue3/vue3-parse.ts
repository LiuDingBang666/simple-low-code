/**
 * @name: 名称
 * @description: TODO vue3页面解析器
 * @author: liudingbang
 * @date: 2025/9/5 14:33
 */
import type { ComponentItem, DrawScheme, PageConfig } from '@/types/draw/scheme.ts'
import { getProjectAllCode } from '@/utils/file-utils.ts'
import { ElMessage } from 'element-plus'

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
 * 从页面开始，到子组件，每一级都有一个特定的解析器，
 * 每次解析就会往现有变量中增加内容，同时，还可以自行扩展需要额外添加的文件
 * @param scheme 协议
 * @param variables 变量
 */
function parseScheme(scheme: DrawScheme, variables: Vue3ParseScheme) {
  let appendFiles: Record<string, string> = {}
  // 解析器列表
  const list: Array<BaseResolver> = []
  // 缓存解析器
  let cacheParse: Record<string, BaseResolver> = {}
  // 获取所有文件
  let fileInfo = getProjectAllCode()
  list.forEach((item) => {
    item.projectFileInfo = fileInfo
    if (cacheParse[item.type]) {
      console.warn(`${item.type}解析器已存在`)
    }
    cacheParse[item.type] = item
  })
  if (cacheParse['page']) {
    // 先解析页面
    cacheParse['page'].parseStart(scheme.page, variables, appendFiles)

    // 再递归解析子页面，解析完毕后即生成最终的文件。
    function parseChildren(children: Array<ComponentItem>) {
      children.forEach((item) => {
        if (cacheParse[item.name]) {
          cacheParse[item.name].parseStart(item, variables, appendFiles)
        } else {
          ElMessage.error(`${item.name}解析器不存在`)
        }
        if (item.children && item.children.length > 0) {
          parseChildren(item.children)
        }
        cacheParse[item.name].parseStop(item, variables, appendFiles)
      })
    }

    if (scheme.page.children) {
      parseChildren(scheme.page.children)
    }
    cacheParse['page'].parseStop(scheme.page, variables, appendFiles)
  } else {
    ElMessage.error('页面解析器不存在')
  }
  // 解析完成，打印所有信息
  console.log(scheme)
  console.log(variables)
  console.log(appendFiles)
  return appendFiles
}

// 解析器方法
interface BaseResolver {
  // 解析器类型 其中，page为页面解析器
  type: 'page' | string
  /**
   * 具体解析开始的方法
   * @param current 当前解析项
   * @param variables 最终生成模版的变量信息
   * @param appendFiles 需要追加的文件信息
   */
  parseStart: (
    current: PageConfig | ComponentItem,
    variables: Vue3ParseScheme,
    appendFiles: Record<string, string>,
  ) => void
  /**
   * 具体解析结束的方法
   * @param current 当前解析项
   * @param variables 最终生成模版的变量信息
   * @param appendFiles 需要追加的文件信息
   */
  parseStop: (
    current: PageConfig | ComponentItem,
    variables: Vue3ParseScheme,
    appendFiles: Record<string, string>,
  ) => void
  // 项目所有文件引用信息
  projectFileInfo: Record<string, string>
}
