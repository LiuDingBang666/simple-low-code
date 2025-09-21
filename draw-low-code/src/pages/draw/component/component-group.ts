/**
 * @name: 名称
 * @description: TODO 组件组
 * @author: liudingbang
 * @date: 2025/9/2 10:19
 */
import type { ComponentGroup, ComponentItem } from '@/types/draw/scheme'
import { buildComponentGroups } from '@/pages/draw/component/component-registry'

/**
 * 兼容旧接口：允许外部再追加一组组件（转成 category=custom）
 */
export default function initGroup(extraComponent: ComponentGroup[] = []): Array<ComponentGroup> {
  // 将外部传入的额外组件扁平化为 ComponentItem 列表
  const extraItems: ComponentItem[] = extraComponent.flatMap((g) => g.items).map((it) => ({
    ...it,
    // 追加分类标记
    // @ts-ignore 自定义透传
    category: 'custom',
  })) as any
  return buildComponentGroups(extraItems)
}
