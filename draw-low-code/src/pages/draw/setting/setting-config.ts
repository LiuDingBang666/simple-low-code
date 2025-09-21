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
      name: '属性',
      title: '属性设置',
      sort: 0,
      settings: [],
    },
    {
      name: '样式',
      title: '样式设置',
      sort: 1,
      settings: [],
    },
    {
      name: '基础',
      title: '基础设置',
      sort: 2,
      settings: [],
    },
  ]
}

// 内置设计器-基础设计器，有需要自选,所有设计器必须放置在@/components/settings文件夹下
export const getInheritSettings = (): Array<SettingPlugin> => {
  return [
    {
      group: '样式',
      name: '通用样式编辑器',
      tip: '编辑常用CSS样式属性',
      sort: 0,
      componentPath: 'CommonStyleSetting.vue',
    },
    {
      group: '基础',
      name: '代码样式编辑器',
      tip: '只支持class样式',
      sort: 1,
      componentPath: 'CodeStyleEditorSetting.vue',
    },
  ] as any
}

/**
 * 根据组件类型获取专用设置器
 */
export function getComponentSpecificSettings(componentName: string): Array<any> {
  const specificSettings: Array<any> = []
  
  // 所有组件都有文本内容编辑器
  specificSettings.push({
    group: '属性',
    name: '内容编辑',
    tip: '编辑组件文本内容和属性',
    sort: 0,
    componentPath: 'TextContentSetting.vue',
  } as any)
  
  // 按钮专用编辑器
  if (componentName === 'button' || componentName === 'ElButton') {
    specificSettings.push({
      group: '属性',
      name: '按钮设置',
      tip: '按钮专用属性设置',
      sort: 1,
      componentPath: 'ButtonSetting.vue',
    } as any)
  }
  
  // 输入框专用编辑器
  if (['input', 'textarea', 'ElInput'].includes(componentName)) {
    specificSettings.push({
      group: '属性',
      name: '输入框设置',
      tip: '输入框专用属性设置',
      sort: 1,
      componentPath: 'InputSetting.vue',
    } as any)
  }
  
  // 图片专用编辑器
  if (componentName === 'img' || componentName === 'ElImage') {
    specificSettings.push({
      group: '属性',
      name: '图片设置',
      tip: '图片专用属性设置',
      sort: 1,
      componentPath: 'ImageSetting.vue',
    } as any)
  }
  
  // 选择器专用编辑器
  if (componentName === 'select' || componentName === 'ElSelect') {
    specificSettings.push({
      group: '属性',
      name: '选择器设置',
      tip: '选择器专用属性设置',
      sort: 1,
      componentPath: 'SelectSetting.vue',
    } as any)
  }
  
  // 对话框专用编辑器
  if (componentName === 'dialog' || componentName === 'ElDialog') {
    specificSettings.push({
      group: '属性',
      name: '对话框设置',
      tip: '对话框专用属性设置',
      sort: 1,
      componentPath: 'DialogSetting.vue',
    } as any)
  }
  
  // 表格专用编辑器
  if (componentName === 'table' || componentName === 'ElTable') {
    specificSettings.push({
      group: '属性',
      name: '表格设置',
      tip: '表格专用属性设置',
      sort: 1,
      componentPath: 'TableSetting.vue',
    } as any)
  }
  
  // Element Plus 组件通用属性编辑器
  if (componentName.startsWith('El')) {
    const elementProps = getElementPropConfig(componentName)
    if (elementProps.length > 0) {
      specificSettings.push({
        group: '属性',
        name: 'Element属性',
        tip: 'Element Plus组件属性配置',
        sort: 2,
        componentPath: 'ComponentPropsSetting.vue',
        props: {
          propConfig: elementProps
        }
      } as any)
    }
  }
  
  return specificSettings
}

/**
 * 获取 Element Plus 组件的属性配置
 */
function getElementPropConfig(componentName: string) {
  const configs: Record<string, any[]> = {
    ElSelect: [
      { key: 'placeholder', label: '占位符', component: 'el-input', defaultValue: '请选择' },
      { key: 'multiple', label: '多选', component: 'el-switch', defaultValue: false },
      { key: 'clearable', label: '可清空', component: 'el-switch', defaultValue: false }
    ],
    ElSwitch: [
      { key: 'size', label: '尺寸', component: 'el-select',
        attrs: { options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]},
        defaultValue: 'default'
      }
    ],
    ElSlider: [
      { key: 'min', label: '最小值', component: 'el-input-number', defaultValue: 0 },
      { key: 'max', label: '最大值', component: 'el-input-number', defaultValue: 100 },
      { key: 'step', label: '步长', component: 'el-input-number', defaultValue: 1 }
    ],
    ElRate: [
      { key: 'max', label: '最大分值', component: 'el-input-number', defaultValue: 5 },
      { key: 'allowHalf', label: '允许半选', component: 'el-switch', defaultValue: false }
    ],
    ElTag: [
      { key: 'type', label: '类型', component: 'el-select',
        attrs: { options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' }
        ]},
        defaultValue: 'primary'
      },
      { key: 'size', label: '尺寸', component: 'el-select',
        attrs: { options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]},
        defaultValue: 'default'
      },
      { key: 'closable', label: '可关闭', component: 'el-switch', defaultValue: false }
    ]
  }
  
  return configs[componentName] || []
}
