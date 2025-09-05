/**
 * @name: 名称
 * @description: TODO 样式解析器
 * @author: liudingbang
 * @date: 2025/9/3 11:20
 */

import type { ComponentStyle } from '@/types/draw/scheme.ts'

/**
 * 组装样式
 * @param component 组件样式
 */
export function parseStyles(component: ComponentStyle) {
  let afterStyle: Partial<StyleSheet> = {}
  if (component.defaultStyle) {
    afterStyle = {
      ...afterStyle,
      ...component.defaultStyle,
    }
  }
  if (component.classStyle) {
    Object.keys(component.classStyle).map((key) => {
      afterStyle = {
        ...afterStyle,
        ...component.classStyle![key],
      }
    })
  }
  if (component.idStyle) {
    Object.keys(component.idStyle).map((key) => {
      afterStyle = {
        ...afterStyle,
        ...component.idStyle![key],
      }
    })
  }
  afterStyle = {
    ...afterStyle,
    ...component.style,
  }
  return afterStyle
}
