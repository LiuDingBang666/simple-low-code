/**
 * @name: 名称
 * @description: TODO 解析器
 * @author: liudingbang
 * @date: 2025/9/5 20:49
 */
import type { ComponentItem, PageConfig } from '@/types/draw/scheme.ts'
import type { Vue3ParseScheme } from '@/pages/draw/gen-code/parse/vue3/vue3-parse.ts'
// 当前解析对象
type CurrentParse = ComponentItem | PageConfig

// 解析数据
interface ResolverData {
  // 变量
  variables: Vue3ParseScheme
  // 当前解析对象
  current: CurrentParse
  // 额外文件
  appendFiles: Record<string, string>
  // 项目文件信息
  projectFileInfo: Record<string, string>
  // 当前解析层级
  level: number
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

/**
 * 获取所有解析器
 */
export function getAllResolver(): Array<BaseResolver> {
  return [pageResolver, divResolver]
}

function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
}

/**
 * 基础解析功能
 * @param current 当前解析项
 * @param variables 模版变量
 * @param level 层级
 */
function commonParseStart(
  current: ComponentItem | PageConfig,
  variables: Vue3ParseScheme,
  level: number,
) {
  if (level != 0) {
    variables.templates += '\n'
  }
  variables.templates += `${'  '.repeat(level)}`
  let baseParseData: Array<string> = []
  // 1、行内
  let mergerLineStyle: Record<string, any> = { ...current?.defaultStyle, ...current?.style }
  let style = ''
  if (Object.keys(mergerLineStyle).length > 0) {
    style = `style="`
    Object.keys(mergerLineStyle).forEach((item) => {
      style += `${camelToKebab(item)}:${mergerLineStyle[item]};`
    })
    style += `"`
    baseParseData.push(style)
  }

  // 2、id
  let id = ``
  if (current.idName) {
    id = `id="${current.idName}"`
    if (current.idStyle) {
      variables.styles += `#${current.idName} {
          ${Object.keys(current.idStyle)
            .map((item) => `${camelToKebab(item)}:${current.idStyle![item as any]};`)
            .join('\n')}
        }\n`
    }
    baseParseData.push(id)
  }

  // 3、class
  let classList = ``
  if (current.classStyle) {
    classList = `:class="[`
    Object.keys(current.classStyle).forEach((item, index) => {
      classList += `'${item.replace('.', '')}'`
      if (index < Object.keys(current.classStyle!).length - 1) {
        classList += `,`
      }
    })
    classList += `]"`
    Object.keys(current.classStyle).forEach((item) => {
      variables.styles += `${item} {
          ${Object.keys(current.classStyle![item])
            .map((key) => `${camelToKebab(key)}:${current.classStyle![item][key as any]};`)
            .join('\n')}
        }\n`
    })
    baseParseData.push(classList)
  }

  // 4、attrs
  let attrs = ''
  if (current.attrs) {
    for (let attrsKey in current.attrs) {
      attrs += `${camelToKebab(attrsKey)}="${camelToKebab((current.attrs as any)[attrsKey])}" `
    }
    baseParseData.push(attrs)
  }

  // 5、props
  let props = ''
  if ('props' in current && current.props) {
    for (let propsKey in current.props) {
      props += `${propsKey}="${(current.props as any)[propsKey]}" `
    }
    baseParseData.push(props)
  }

  return baseParseData.length > 0 ? ' ' + baseParseData.join(' ') : ''
}

// @ts-ignore
function commonParseStop(
  // @ts-ignore
  current: ComponentItem | PageConfig,
  variables: Vue3ParseScheme,
  level: number,
) {
  variables.templates += `\n${'  '.repeat(level)}`
}

// todo 组件基础解析功能

// 页面解析器
const pageResolver: BaseResolver = {
  type: 'page',
  // @ts-ignore
  parseStart: ({ variables, current, appendFiles, projectFileInfo, level }: ResolverData) => {
    let commonInfo = commonParseStart(current, variables, level)
    variables.templates += `<div${commonInfo}>`
  },
  // @ts-ignore
  parseStop: ({ variables, current, appendFiles, projectFileInfo, level }: ResolverData) => {
    commonParseStop(current, variables, level)
    variables.templates += `</div>`
  },
}

// div解析器
const divResolver: BaseResolver = {
  type: 'div',
  // @ts-ignore
  parseStart: ({ variables, current, appendFiles, projectFileInfo, level }: ResolverData) => {
    let commonInfo = commonParseStart(current, variables, level)
    variables.templates += `<div${commonInfo}>`
  },
  // @ts-ignore
  parseStop: ({ variables, current, appendFiles, projectFileInfo, level }: ResolverData) => {
    commonParseStop(current, variables, level)
    variables.templates += `</div>`
  },
}
export type { BaseResolver, CurrentParse, ResolverData }
