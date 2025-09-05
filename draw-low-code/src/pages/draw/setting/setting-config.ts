/**
 * @name: 名称
 * @description: TODO 设置器配置
 * @author: liudingbang
 * @date: 2025/9/4 14:22
 */
import type { SettingPlugin, SettingPluginGroup } from '@/types/draw/setting.ts'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme.ts'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { defineAsyncComponent } from 'vue'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'

// 初始化设计器
export function initAllSetting(settings: SettingPlugin[]) {
  let all: Array<SettingPlugin> = settings.sort((a, b) => a.sort - b.sort)
  const { updateComponentById, updatePage } = useSchemeStore()
  let { getActiveComponent } = useActiveComponentStore()
  // 自动注入与组件相关的方法
  const modules = import.meta.glob('@/components/settings/*.vue')
  all.forEach((setting) => {
    // 更新当前组件
    setting.updateComponent = (item: ComponentItem | PageConfig) => {
      if (!getActiveComponent().value) {
        console.error('当前没有选中组件')
        return
      }
      if (!('id' in getActiveComponent().value!)) {
        updatePage(item as PageConfig)
      } else {
        let id = (getActiveComponent()!.value! as unknown as ComponentItem).id as string
        updateComponentById(id, item as ComponentItem)
      }
    }
    // 获取当前组件
    // @ts-ignore
    setting.getCurrentComponent = () => {
      return getActiveComponent().value
    }
    // 渲染当前组件
    try {
      setting.is = defineAsyncComponent(
        modules[`/src/components/settings/${setting.componentPath}`] as any,
      )
    } catch (e) {
      console.error(e)
    }
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
  // console.log('当前设计器组信息', group)
  return group.sort((a, b) => a.sort - b.sort).filter((item) => item.settings.length > 0)
}

// 内置设计器组-基础设计组，有需要自选
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
// 内置设计器-基础设计器，有需要自选,所有设计器必须放置在@/components/settings文件夹下
export const getInheritSettings = (): Array<SettingPlugin> => {
  return [
    {
      group: '基础',
      name: '代码样式编辑设置器',
      sort: 1,
      componentPath: 'CodeStyleEditorSetting.vue',
    },
  ]
}
