/**
 * @name: 名称
 * @description: TODO 协议定义-最小MVP
 * @author: liudingbang
 * @date: 2025/9/2 09:37
 */

// 协议信息
interface DrawScheme {
  // 版本
  version: string
  // 页面配置
  page: ComponentStyle & {
    // 页面节点
    children?: Array<ComponentItem & ComponentStyle>
  }
}

// 组件组
interface ComponentGroup {
  // 排序
  sort: number
  // 组名称
  name: string
  // 组件项
  items: Array<Omit<ComponentItem, 'id'>>
}

// 组件项
interface ComponentItem {
  // 组件id
  id: string
  // 组件名称
  name: string
  // 组件属性
  props?: Record<string, any>
  // 是否是原生组件，比如div这种
  isNative?: boolean
}

// 组件样式
interface ComponentStyle {
  // 内联样式
  style?: Record<string, any>
  // 类名对应的样式
  classStyle?: {
    [key: string]: Record<string, any>
  }
  // id对应的样式
  idStyle?: {
    [key: string]: Record<string, any>
  }
}

export type { DrawScheme, ComponentStyle, ComponentItem, ComponentGroup }
