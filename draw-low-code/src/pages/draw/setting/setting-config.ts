/**
 * @name: 名称
 * @description: TODO 设置器配置
 * @author: liudingbang
 * @date: 2025/9/4 14:22
 */
import type { SettingPlugin, SettingPluginGroup } from '@/types/draw/setting.ts'
import type { ComponentItem } from '@/types/draw/scheme.ts'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { defineAsyncComponent } from 'vue'

// 初始化设计器
export function initAllSetting(settings: SettingPlugin[]) {
  let all: Array<SettingPlugin> = settings.sort((a, b) => a.sort - b.sort)
  const { findComponentItemById, updateComponentById } = useSchemeStore()
  // 自动注入与组件相关的方法
  const modules = import.meta.glob('@/components/settings/*.vue')
  all.forEach((setting) => {
    // 更新当前组件
    setting.updateComponent = (item: ComponentItem) => {
      updateComponentById(setting.componentInstanceId!, item)
    }
    // 获取当前组件
    setting.getCurrentComponent = () => {
      return findComponentItemById(setting.componentInstanceId!)
    }
    // 渲染当前组件
    setting.is = defineAsyncComponent(
      modules[`/src/components/settings/${setting.componentPath}`] as any,
    )
  })
  return all
}

/**
 * 合并分组的设计器的方法
 * @param group 分组信息
 * @param setting 设计器信息
 */
export function mergeSettingPluginGroup(
  group: Array<SettingPluginGroup>,
  setting: Array<SettingPlugin>,
) {
  group.forEach((groupItem) => {
    groupItem.settings = setting.filter(
      (item) => item.group === groupItem.name || item.group === groupItem.title,
    )
    groupItem.settings.sort((a, b) => a.sort - b.sort)
  })
  console.log('当前设计器组信息', group)
  return group.sort((a, b) => a.sort - b.sort).filter((item) => item.settings.length > 0)
}

// 内置设计器组
export const getInheritSettingGroup = (): Array<SettingPluginGroup> => {
  return [
    {
      name: '基础',
      title: '基础',
      sort: 1,
      settings: [],
    },
  ]
}
// 内置设计器
export const getInheritSettings = (): Array<SettingPlugin> => {
  return [
    {
      group: '基础',
      name: '代码编辑设置',
      sort: 1,
      componentPath: 'CodeEditorSetting.vue',
    },
  ]
}
