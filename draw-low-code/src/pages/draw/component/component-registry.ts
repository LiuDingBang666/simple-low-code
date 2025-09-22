import type { ComponentGroup, ComponentItem } from '@/types/draw/scheme'
import { defineAsyncComponent } from 'vue'
import { getInheritSettings, getComponentSpecificSettings } from '@/pages/draw/setting/setting-config'

/**
 * 统一组件元数据接口（后续可扩展分类、权限、tag等）
 */
export interface ComponentMeta extends Omit<ComponentItem, 'id'> {
  category: string; // 逻辑分类 key
  sort?: number; // 分类内排序
  previewText?: string; // 简单文本预览（无图时）
}

/**
 * 分类元信息
 */
interface CategoryMeta {
  key: string
  title: string
  sort: number
}

// 分类定义
const categories: CategoryMeta[] = [
  { key: 'native', title: '原生元素', sort: 1 },
  { key: 'element', title: 'Element Plus', sort: 2 },
  { key: 'custom', title: '自定义组件', sort: 3 },
]

// 组件注册表（后续可拆分多个文件 / 动态加载）
const registry: ComponentMeta[] = [
  // 原生
  {
    category: 'native',
    name: 'div',
    title: '容器',
    isNative: true,
    isCanNest: true,
    canNestElements: ['div', 'span', 'p'],
    defaultStyle: {
      minWidth: '120px',
      minHeight: '80px',
      padding: '12px',
      border: '1px dashed #c2c8d0',
      boxSizing: 'border-box',
      background: '#fff',
    },
  },
  { category: 'native', name: 'span', title: '文本', isNative: true, showTitle: true },
  { category: 'native', name: 'p', title: '段落', isNative: true, showTitle: true },
  // img: 使用属性 data-src 或留空，真实 src 可在设置里配置
  { category: 'native', name: 'img', title: '图片', isNative: true, defaultStyle: { width: '120px', height: '80px', objectFit: 'cover' } },
  { category: 'native', name: 'button', title: '按钮', isNative: true, showTitle: true, value: '按钮', defaultStyle: { padding: '6px 12px', background: '#3a7afe', color: '#fff', borderRadius: '4px' } },
  { category: 'native', name: 'input', title: '输入框', isNative: true, attrs: { placeholder: '请输入...' }, defaultStyle: { padding: '4px 8px' } },
  { category: 'native', name: 'textarea', title: '多行文本', isNative: true, attrs: { placeholder: '请输入...' }, defaultStyle: { padding: '4px 8px', minHeight: '80px' } },
  { category: 'native', name: 'select', title: '选择框', isNative: true },
  { category: 'native', name: 'ul', title: '无序列表', isNative: true, isCanNest: true, canNestElements: ['li'] },
  { category: 'native', name: 'li', title: '列表项', isNative: true },
  { category: 'native', name: 'table', title: '表格', isNative: true, isCanNest: true },

  // Element Plus 基础
  { category: 'element', name: 'ElButton', title: '按钮', props: { type: 'primary' }, showTitle: true },
  { category: 'element', name: 'ElInput', title: '输入框', props: { placeholder: '请输入内容' } },
  { category: 'element', name: 'ElSelect', title: '选择器', props: { placeholder: '请选择' } },
  { category: 'element', name: 'ElSwitch', title: '开关' },
  { category: 'element', name: 'ElSlider', title: '滑块' },
  { category: 'element', name: 'ElRate', title: '评分' },
  { category: 'element', name: 'ElDatePicker', title: '日期', props: { type: 'date', placeholder: '选择日期' } },
  { category: 'element', name: 'ElTimePicker', title: '时间', props: { placeholder: '选择时间' } },
  { category: 'element', name: 'ElTag', title: '标签', props: { type: 'primary' } },
  { category: 'element', name: 'ElAlert', title: '提示', props: { title: '提示内容', type: 'info' } },
  { category: 'element', name: 'ElBadge', title: '徽标', props: { value: 5 } },
  { category: 'element', name: 'ElProgress', title: '进度条', props: { percentage: 50 } },
  { category: 'element', name: 'ElPagination', title: '分页', props: { total: 100 } },
  { category: 'element', name: 'ElCard', title: '卡片', isCanNest: true, defaultStyle: { padding: '12px' } },
  { category: 'element', name: 'ElTabs', title: '标签页', isCanNest: true },
  { category: 'element', name: 'ElTabPane', title: '标签面板', props: { label: '标签' }, isCanNest: true },
  { category: 'element', name: 'ElCollapse', title: '折叠面板', isCanNest: true },
  { category: 'element', name: 'ElCollapseItem', title: '折叠项', props: { title: '标题' }, isCanNest: true },
  { category: 'element', name: 'ElTable', title: '表格', props: { data: [] }, isCanNest: true },
  { category: 'element', name: 'ElDialog', title: '对话框', props: { title: '标题', modelValue: true }, isCanNest: true },
  { category: 'element', name: 'ElDrawer', title: '抽屉', props: { title: '标题', modelValue: true }, isCanNest: true },

  // 自定义
  { category: 'custom', name: 'TestComponent', title: '自定义', componentPath: 'TestComponent.vue' },
]

// 按分类生成分组
export function buildComponentGroups(extra: ComponentItem[] = []): ComponentGroup[] {
  const modules = import.meta.glob('@/components/components/*.vue')
  const map = new Map<string, ComponentMeta[]>()
  registry.concat(extra as any).forEach((meta) => {
    if (!map.has(meta.category)) map.set(meta.category, [])
    map.get(meta.category)!.push(meta)
  })

  const groups: ComponentGroup[] = categories
    .filter((c) => map.has(c.key))
    .sort((a, b) => a.sort - b.sort)
    .map((cate) => {
      const items: ComponentItem[] = map
        .get(cate.key)!
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map((m, index) => ({ 
          ...m, 
          id: `${cate.key}-${m.name}-${index}` // 为每个组件生成唯一ID
        }))
      // 注入默认设计器能力
      items.forEach((it) => {
        // 为每个组件生成专属设置器
        const specificSettings = getComponentSpecificSettings(it.name)
        it.groups = getExtendedSettingGroups()
        it.settings = [...getInheritSettings(), ...specificSettings]
        if (it.componentPath) {
          it.is = defineAsyncComponent(
            modules[`/src/components/components/${it.componentPath}`] as any,
          )
        }
      })
      return {
        sort: cate.sort,
        name: categories.find((c) => c.key === cate.key)!.title,
        items: items as any,
      }
    })

  return groups
}

export { registry }

/**
 * 扩展设置器组
 */
export function getExtendedSettingGroups() {
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
    }
  ]
}