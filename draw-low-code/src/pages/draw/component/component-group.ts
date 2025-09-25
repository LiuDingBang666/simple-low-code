/**
 * @name: 名称
 * @description: TODO 组件组
 * @author: liudingbang
 * @date: 2025/9/2 10:19
 */
import type { ComponentGroup } from '@/types/draw/scheme'
import { defineAsyncComponent } from 'vue'
import { getInheritSettingGroup, getInheritSettings } from '@/pages/draw/setting/setting-config.ts'

export default function initGroup(extraComponent: ComponentGroup[] = []): Array<ComponentGroup> {
  let group: Array<ComponentGroup> = [
    {
      sort: 1,
      name: '基础组件',
      items: [
        {
          name: 'div',
          title: '盒子',
          isCanNest: true,
          canNestElements: ['div'],
          style: {
            width: '100%',
            height: '100px',
            display: 'inline-block',
          },
          isNative: true,
        },
        {
          name: 'p',
          title: '段落',
          canNestElements: ['div'],
          style: {
            lineHeight: 'normal',
            margin: '0px',
          },
          isNative: true,
          showTitle: true,
        },
        {
          name: 'span',
          title: '文本',
          canNestElements: ['div'],
          defaultStyle: {
            display: 'block',
            lineHeight: '20px',
          },
          isNative: true,
          showTitle: true,
        },
      ],
    },
    {
      sort: 2,
      name: '开源UI库组件',
      items: [
        {
          name: 'ElButton',
          title: '按钮',
          isNative: false,
          showTitle: true,
          props: {
            type: 'primary',
          },
        },
      ],
    },
    {
      sort: 2,
      name: '自定义组件',
      items: [
        {
          name: 'TestComponent',
          componentPath: 'TestComponent.vue',
          title: '自定义',
          isNative: false,
        },
      ],
    },
  ]
  let result = [...group, ...extraComponent].sort((a, b) => a.sort - b.sort)
  // 所有自定义或者扩展组件放置的地方
  const modules = import.meta.glob('@/components/components/*.vue')
  result.forEach((item) => {
    item.items.forEach(async (item) => {
      // 异步组件加载
      if (item.componentPath) {
        // 加载异步组件
        item.is = defineAsyncComponent(
          modules[`/src/components/components/${item.componentPath}`] as any,
        )
      }
      // 注入所有基础设计器
      item.groups = getInheritSettingGroup()
      item.settings = getInheritSettings()
    })
  })
  return result
}
