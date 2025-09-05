/**
 * @name: 名称
 * @description: TODO vue3页面解析器
 * @author: liudingbang
 * @date: 2025/9/5 14:33
 */
import type { ComponentItem, DrawScheme } from '@/types/draw/scheme.ts'
import { getProjectAllCode } from '@/utils/file-utils.ts'
import { ElMessage } from 'element-plus'
import { type BaseResolver, getAllResolver } from '@/pages/draw/gen-code/parse/vue3/resolvers'

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
  const appendFiles = await parseScheme(scheme, variables)
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
  const list: Array<BaseResolver> = getAllResolver()
  // 缓存解析器
  let cacheParse: Record<string, BaseResolver> = {}
  // 获取所有文件
  let projectFileInfo = getProjectAllCode()
  list.forEach((item) => {
    if (cacheParse[item.type]) {
      console.warn(`${item.type}解析器已存在`)
    }
    cacheParse[item.type] = item
  })
  if (cacheParse['page']) {
    // 先解析页面
    cacheParse['page'].parseStart({ variables, current: scheme.page, appendFiles, projectFileInfo })

    // 再递归解析子页面，解析完毕后即生成最终的文件。
    function parseChildren(children: Array<ComponentItem>) {
      children.forEach((item) => {
        if (cacheParse[item.name]) {
          cacheParse[item.name].parseStart({
            variables,
            current: item,
            appendFiles,
            projectFileInfo,
          })
        } else {
          ElMessage.error(`${item.name}解析器不存在,出码失败！`)
          throw Error(`${item.name}解析器不存在,出码失败！`)
        }
        if (item.children && item.children.length > 0) {
          parseChildren(item.children)
        }
        if (cacheParse[item.name] && cacheParse[item.name].parseStop) {
          cacheParse[item.name].parseStop!({
            variables,
            current: item,
            appendFiles,
            projectFileInfo,
          })
        }
      })
    }

    if (scheme.page.children) {
      try {
        parseChildren(scheme.page.children)
      } catch (e) {
        return Promise.reject(e)
      }
    }
    if (cacheParse['page'].parseStop) {
      cacheParse['page'].parseStop({
        variables,
        current: scheme.page,
        appendFiles,
        projectFileInfo,
      })
    }
  } else {
    ElMessage.error('页面解析器不存在,出码失败！')
    return Promise.reject(`页面解析器不存在,出码失败！`)
  }
  // 解析完成，打印所有信息
  console.log(scheme)
  console.log(variables)
  console.log(appendFiles)
  return Promise.resolve(appendFiles)
}

export type { Vue3ParseScheme }
