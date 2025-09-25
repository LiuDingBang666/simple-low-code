import type { ComponentItem } from '@/types/draw/scheme'
import useSchemeStore from '@/store/useSchemeStore'

/**
 * 叶子组件集合（不允许作为容器放子节点）
 */
export const LEAF_COMPONENTS = new Set([
  'span','p','button','a','li','img','input','textarea','select',
  'ElButton','ElInput','ElSelect','ElSwitch','ElSlider','ElRate','ElTag','ElAlert','ElBadge','ElProgress','ElPagination'
])

/**
 * 严格父子白名单：父 -> 允许的子（如果定义则子集严格受限）
 */
export const STRICT_PARENT_CHILD: Record<string,string[]> = {
  ul: ['li'],
  ElTabs: ['ElTabPane'],
  ElCollapse: ['ElCollapseItem'],
  table: ['thead','tbody'],
  thead: ['tr'],
  tbody: ['tr'],
  tr: ['td','th']
}

/**
 * 可选：某些面板型子节点继续允许嵌套任意普通内容
 */
export const PANEL_COMPONENTS = new Set(['ElTabPane','ElCollapseItem','ElCard','div','td','th'])

/**
 * 检查是否为其后代（防止拖入自身或子树）
 */
export function isDescendant(parent: ComponentItem, possibleChild: ComponentItem): boolean {
  if (!parent.children || parent.children.length === 0) return false
  for (const c of parent.children) {
    if (c.id === possibleChild.id) return true
    if (isDescendant(c, possibleChild)) return true
  }
  return false
}

/**
 * 获取组件在当前协议里的最新引用
 */
function getLatestComponent(id?: string) {
  if (!id) return undefined
  const store = useSchemeStore()
  return store.findComponentItemById(id)
}

export interface CanNestResult { pass: boolean; reason?: string }

/**
 * 嵌套规则主函数
 * @param parent 目标父
 * @param child 待放子节点（可能已经存在于树中）
 */
export function canNest(parent: ComponentItem | undefined, child: ComponentItem): CanNestResult {
  // 顶层 page 情况由调用方处理，这里若 parent 为空直接允许
  if (!parent) return { pass: true }

  // 自身拖到自身（一般组件有 id）
  if (parent.id && child.id && parent.id === child.id) {
    return { pass: false, reason: '不能把组件放入自身' }
  }

  // 防止把祖先拖入后代
  if (child.id && isDescendant(child, parent)) {
    return { pass: false, reason: '不能把父组件放入其子组件中' }
  }

  // 父未声明可嵌套
  if (!parent.isCanNest) {
    return { pass: false, reason: '该组件不支持嵌套子组件' }
  }

  // 叶子组件不可作为父节点
  if (LEAF_COMPONENTS.has(parent.name) && !PANEL_COMPONENTS.has(parent.name)) {
    return { pass: false, reason: '该组件是叶子节点，不能再添加子组件' }
  }

  // 严格父子白名单优先
  if (STRICT_PARENT_CHILD[parent.name]) {
    if (!STRICT_PARENT_CHILD[parent.name].includes(child.name)) {
      return { pass: false, reason: `只能放置: ${STRICT_PARENT_CHILD[parent.name].join(', ')}` }
    }
  } else if (parent.canNestElements && parent.canNestElements.length > 0) {
    // 自定义白名单
    if (!parent.canNestElements.includes(child.name)) {
      return { pass: false, reason: '不在允许的子组件白名单中' }
    }
  }

  // 默认：通过
  return { pass: true }
}

/**
 * 根据目标父节点 id 进行校验（包含获取最新节点）
 */
export function canNestByParentId(parentId: string | undefined, child: ComponentItem): CanNestResult {
  if (!parentId || parentId === 'top-node') return { pass: true }
  const latestParent = getLatestComponent(parentId)
  return canNest(latestParent, child)
}
