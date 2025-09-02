/**
 * @name: 名称
 * @description: TODO 组件组
 * @author: liudingbang
 * @date: 2025/9/2 10:19
 */
import type { ComponentGroup } from '@/types/draw/scheme'
import { defineAsyncComponent } from 'vue'

export default function initGroup(extra: ComponentGroup[] = []): Array<ComponentGroup> {
  let group: Array<ComponentGroup> = [
    {
      sort: 1,
      name: '基础组件',
      items: [
        {
          name: 'div',
          title: '盒子',
          isNative: true,
        },
        {
          name: 'p',
          title: '段落',
          isNative: true,
        },
        {
          name: 'span',
          title: '文本',
          isNative: true,
        },
      ],
    },
    {
      sort: 2,
      name: '布局组件',
      items: [
        {
          name: 'ElButton',
          title: '按钮',
          isNative: false,
          props: {
            type: 'primary',
          },
        },
      ],
    },
  ]
  let result = [...group, ...extra].sort((a, b) => a.sort - b.sort)
  // 所有自定义或者扩展组件放置的地方
  const modules = import.meta.glob('@/components/*.vue')
  result.forEach((item) => {
    item.items.forEach(async (item) => {
      if (item.componentPath) {
        // 加载异步组件
        item.is = defineAsyncComponent(modules[`/src/components/${item.componentPath}`] as any)
      }
    })
  })
  return result
}
