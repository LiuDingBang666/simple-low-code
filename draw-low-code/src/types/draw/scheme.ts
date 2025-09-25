/**
 * @name: 名称
 * @description: TODO 协议定义-最小MVP
 * @author: liudingbang
 * @date: 2025/9/2 09:37
 */
import type { Component, HTMLAttributes } from 'vue'
import type { SettingPlugin, SettingPluginGroup } from '@/types/draw/setting.ts'

// 协议信息
interface DrawScheme {
  // 版本
  version: string
  // 页面配置
  page: PageConfig
}

interface PageConfig extends ComponentStyle {
  // 是否是页面
  isPage: true
  // 页面节点
  children?: Array<ComponentItem>
  // 原生属性
  attrs?: Partial<HTMLAttributes>
  // 页面设计插件
  settings?: Array<SettingPlugin>
  // 页面设计器组
  groups?: Array<SettingPluginGroup>
  // 默认值
  value?: any
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
interface ComponentItem extends ComponentStyle {
  // 基础属性
  // 标题
  title: string
  // 是否显示标题值，只有是原生组件才会生效
  showTitle?: boolean
  // 组件名称
  name: string
  // 默认样式类名，所有的默认样式走class，不走其他的
  class?: string
  // 组件图标
  icon?: string
  // 是否可以嵌套
  isCanNest?: boolean
  // 可以嵌套的名称
  canNestElements?: Array<string>
  // 是否可以全部嵌套
  isCanNestAll?: boolean

  // 组件设计器
  settings?: Array<SettingPlugin>
  // 页面设计器组
  groups?: Array<SettingPluginGroup>

  // 组件特定配置
  // 组件路径
  componentPath?: string
  // 组件实例
  is?: Component
  // 组件属性
  props?: Record<string, any>

  // 原生html属性特定配置
  // 是否是原生组件，比如div这种
  isNative?: boolean
  // 原生属性
  attrs?: HTMLAttributes

  // 实例属性

  // 默认值
  value?: any
  // 组件id
  id?: string
  // 组件子节点
  children?: Array<ComponentItem>
  // 父节点id
  parentId?: string
}

// 组件样式
interface ComponentStyle {
  // 默认样式
  defaultStyle?: Partial<CSSStyleDeclaration>
  // 内联样式
  style?: Partial<CSSStyleDeclaration>
  // 类名对应的样式
  classStyle?: {
    [key: string]: Record<string, Partial<CSSStyleDeclaration>>
  }
  // id
  idName?: string
  // id对应的样式
  idStyle?: Partial<CSSStyleDeclaration>
}

export type { DrawScheme, ComponentStyle, ComponentItem, ComponentGroup, PageConfig }
