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

/**
 * 驼峰转横线
 * @param str 驼峰字符串
 */
function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
}

/**
 * 基础解析功能
 * @param current 当前解析项
 * @param variables 模版变量
 * @param level 层级
 * @param tag 标签
 */
function commonParseStart(
  current: ComponentItem | PageConfig,
  variables: Vue3ParseScheme,
  level: number,
  tag: string,
) {
  let baseParseData: Array<string> = []
  // 行内
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

  // id
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

  // class
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

  // attrs
  let attrs = ''
  if (current.attrs) {
    for (let attrsKey in current.attrs) {
      attrs += `${camelToKebab(attrsKey)}="${camelToKebab((current.attrs as any)[attrsKey])}" `
    }
    baseParseData.push(attrs)
  }

  // props
  let props = ''
  if ('props' in current && current.props) {
    for (let propsKey in current.props) {
      props += `${propsKey}="${(current.props as any)[propsKey]}" `
    }
    baseParseData.push(props)
  }

  if (level != 0) {
    variables.templates += '\n'
  }

  // 添加标签
  variables.templates += `${'  '.repeat(level)}`
  variables.templates += `<${tag}`
  variables.templates += baseParseData.length > 0 ? ' ' + baseParseData.join(' ') : ''
  variables.templates += `>`

  // 添加标题
  titleInject(current, variables)
}

/**
 * 基础解析结束方法
 * @param current 当前组件
 * @param variables 变量
 * @param level 层级
 * @param tag 标签
 */
// @ts-ignore
function commonParseStop(
  // @ts-ignore
  current: ComponentItem | PageConfig,
  variables: Vue3ParseScheme,
  level: number,
  tag: string,
) {
  if (current.children && current.children.length > 0) {
    variables.templates += '\n'
    variables.templates += `${'  '.repeat(level)}`
  }
  variables.templates += `</${tag}>`
}

/**
 * 标题解析器
 * @param current 当前组件
 * @param variables 变量
 */
function titleInject(current: ComponentItem | PageConfig, variables: Vue3ParseScheme) {
  if ('showTitle' in current && current.showTitle) {
    variables.templates += `${current.title}`
  }
}

/**
 * 导入组件解析器
 * @param data 解析数据
 * @param type 组件类型
 * @param path 组件路径
 * @param isImportCustomFile 是否需要导入自定义文件
 */
function importComponent(
  data: ResolverData,
  type: string,
  path: string,
  isImportCustomFile = false,
) {
  if (data.variables.imports.includes(type) && data.variables.imports.includes(path)) {
    return
  }
  data.variables.imports += isImportCustomFile
    ? `import ${type} from '${path}'\n`
    : `import {${type}} from '${path}'\n`
  if (isImportCustomFile) {
    let filePath = '/' + path.replace('@', 'src')
    if (data.projectFileInfo[filePath]) {
      let fileName = filePath.substring(filePath.indexOf('src/') + 4)
      data.appendFiles[fileName] = data.projectFileInfo[filePath]
    }
  }
}

// 装饰器数组
export const ResolverRegistry: Array<new () => BaseResolver> = []

export function RegisterResolver(target: new () => BaseResolver) {
  ResolverRegistry.push(target)
}

/**
 * 获取所有解析器
 */
export function getAllResolver(): Array<BaseResolver> {
  return ResolverRegistry.map((R) => new R())
}

// 基础解析器，公共功能
class BaseResolver {
  // 解析器类型 其中，page为页面解析器
  public type: string | 'page' = ''

  // 解析标签
  public tag: string = ''

  /**
   * 具体解析开始的方法
   * @param data 解析数据
   */
  public parseStart(data: ResolverData) {
    commonParseStart(data.current, data.variables, data.level, this.tag)
  }

  /**
   * 具体解析结束的方法
   * @param data 解析数据
   */
  public parseStop(data: ResolverData) {
    commonParseStop(data.current, data.variables, data.level, this.tag)
  }
}

// todo 组件基础解析功能

// 页面解析器
@RegisterResolver
class PageResolver extends BaseResolver {
  type = 'page'

  tag = 'div'

  public parseStart(data: ResolverData) {
    super.parseStart(data)
  }

  public parseStop(data: ResolverData) {
    super.parseStop(data)
  }
}

// div解析器
@RegisterResolver
class DivResolver extends BaseResolver {
  type = 'div'

  tag = 'div'

  public parseStart(data: ResolverData) {
    super.parseStart(data)
  }

  public parseStop(data: ResolverData) {
    super.parseStop(data)
  }
}

// p段落解析器
@RegisterResolver
class PResolver extends BaseResolver {
  type = 'p'

  tag = 'p'

  public parseStart(data: ResolverData) {
    super.parseStart(data)
  }

  public parseStop(data: ResolverData) {
    super.parseStop(data)
  }
}

// span
@RegisterResolver
class SpanResolver extends BaseResolver {
  type = 'span'

  tag = 'span'

  public parseStart(data: ResolverData) {
    super.parseStart(data)
  }

  public parseStop(data: ResolverData) {
    super.parseStop(data)
  }
}

@RegisterResolver
class ElButtonResolver extends BaseResolver {
  type = 'ElButton'

  tag = 'el-button'

  public parseStart(data: ResolverData) {
    super.parseStart(data)
    // 导入element组件
    importComponent(data, this.type, 'element-plus')
  }

  public parseStop(data: ResolverData) {
    super.parseStop(data)
  }
}

@RegisterResolver
class TestComponentResolver extends BaseResolver {
  type = 'TestComponent'

  tag = 'TestComponent'

  public parseStart(data: ResolverData) {
    super.parseStart(data)
    // 导入自定义组件
    importComponent(data, this.type, '@/components/components/TestComponent.vue', true)
  }

  public parseStop(data: ResolverData) {
    super.parseStop(data)
  }
}

export type { CurrentParse, ResolverData }
export {
  BaseResolver,
  PResolver,
  DivResolver,
  PageResolver,
  SpanResolver,
  ElButtonResolver,
  TestComponentResolver,
}
