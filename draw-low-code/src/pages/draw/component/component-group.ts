/**
 * @name: 名称
 * @description: TODO 组件组
 * @author: liudingbang
 * @date: 2025/9/2 10:19
 */
import type { ComponentGroup } from '@/types/draw/scheme'

export default function initGroup(extra: ComponentGroup[] = []): Array<ComponentGroup> {
  let group: Array<ComponentGroup> = [
    {
      sort: 1,
      name: '基础组件',
      items: [
        {
          name: 'div',
          isNative: true,
        },
        {
          name: 'p',
          isNative: true,
        },
        {
          name: 'span',
          isNative: true,
        },
      ],
    },
    {
      sort: 2,
      name: '业务组件',
      items: [],
    },
  ]
  return [...group, ...extra].sort((a, b) => a.sort - b.sort)
}
