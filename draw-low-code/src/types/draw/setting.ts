/**
 * @name: 名称
 * @description: TODO 设计器插件
 * @author: liudingbang
 * @date: 2025/9/4 13:58
 */
import type { Component } from 'vue'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme.ts'

/**
 * 设计器插件组
 */
interface SettingPluginGroup {
  // 设计器分组名称
  name: string
  // 设计器分组标题
  title: string
  // 设计器图标
  icon?: string
  // 排序
  sort: number
  // 设计器项
  settings: Array<SettingPlugin>
}

/**
 * 设计器插件
 */
interface SettingPlugin {
  // 设计器分组名称
  group: string
  // 设计器名称
  name: string
  // 排序
  sort: number
  // 设计器组件路径
  componentPath: string
  // 设计器组件实例
  is?: Component
  // 设计器修改数据回调(页面也作为一种特殊的组件存在)
  updateComponent?: (item: ComponentItem | PageConfig) => void
  // 设计器获取当前组件实例(页面也作为一种特殊的组件存在)
  getCurrentComponent?: () => ComponentItem | PageConfig | undefined
  // 设计器单独的属性配置信息，每个设计器都可以支持自定义配置
  props?: Record<string, any>
  // 是否初始化
  isInit?: boolean
  // 设计器绑定的当前组件实例id-暂无使用场景
  componentInstanceId?: string
}

export type { SettingPluginGroup, SettingPlugin }
