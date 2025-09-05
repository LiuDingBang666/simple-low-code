/**
 * @name: 名称
 * @description: TODO 解析器
 * @author: liudingbang
 * @date: 2025/9/5 20:49
 */
import type { ComponentItem, PageConfig } from '@/types/draw/scheme.ts'
import type { Vue3ParseScheme } from '@/pages/draw/gen-code/parse/vue3/vue3-parse.ts'

type CurrentParse = ComponentItem | PageConfig

interface ResolverData {
  variables: Vue3ParseScheme
  current: CurrentParse
  appendFiles: Record<string, string>
  projectFileInfo: Record<string, string>
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
  parseStart: (data: ResolverData) => void
  /**
   * 具体解析结束的方法
   * @param current 当前解析项
   * @param variables 最终生成模版的变量信息
   * @param appendFiles 需要追加的文件信息
   */
  parseStop?: (data: ResolverData) => void
}

export function getAllResolver(): Array<BaseResolver> {
  return [pageResolver]
}

const pageResolver: BaseResolver = {
  type: 'page',
  // @ts-ignore
  parseStart: ({ variables, current, appendFiles, projectFileInfo }: ResolverData) => {
    // 解析样式
    // 1、行内
    let mergerLineStyle: Record<string, any> = { ...current?.defaultStyle, ...current?.style }
    let style = ''
    if (Object.keys(mergerLineStyle).length > 0) {
      style = `style = "`
      Object.keys(mergerLineStyle).forEach((item) => {
        style += `${item}:${mergerLineStyle[item]};`
      })
      style += `"`
    }
    // id

    // class

    variables.templates += `<div ${style}>`
  },
  // @ts-ignore
  parseStop: ({ variables, current, appendFiles, projectFileInfo }: ResolverData) => {
    variables.templates += `</div>`
  },
}
export type { BaseResolver, CurrentParse, ResolverData }
