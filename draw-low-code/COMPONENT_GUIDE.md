# 组件库和设计器扩展指南

## 已完成功能

### 1. 组件注册中心
- 位置：`src/pages/draw/component/component-registry.ts`
- 功能：统一管理所有组件元数据，支持分类和动态生成

### 2. 组件分类
- **原生元素 (native)**：div, span, p, img, button, input, textarea, select, ul, li, table
- **Element Plus (element)**：ElButton, ElInput, ElSelect, ElSwitch, ElSlider, ElRate, ElDatePicker, ElTimePicker, ElTag, ElAlert, ElBadge, ElProgress, ElPagination, ElCard, ElTabs, ElTabPane, ElCollapse, ElCollapseItem, ElTable, ElDialog, ElDrawer
- **自定义组件 (custom)**：TestComponent 及其他自定义组件

### 3. 属性设置器
- **通用文本设置器**：`src/components/settings/TextContentSetting.vue`
- **组件属性设置器**：`src/components/settings/ComponentPropsSetting.vue`
- 支持动态生成表单控件（input, select, switch等）

### 4. 默认属性配置
- 每个组件都有预设的默认样式和属性
- Element Plus 组件有专门的属性配置（type, size, placeholder等）

## 如何添加新组件

### 1. 添加到注册表
在 `component-registry.ts` 的 `registry` 数组中添加：

```typescript
{
  category: 'element', // 或 'native', 'custom'
  name: 'ElNewComponent',
  title: '新组件',
  props: { /* 默认属性 */ },
  defaultStyle: { /* 默认样式 */ },
  // 其他配置...
}
```

### 2. 添加属性配置（可选）
在 `getElementPropConfig` 函数中为新组件添加属性配置：

```typescript
ElNewComponent: [
  { 
    key: 'size', 
    label: '尺寸', 
    component: 'el-select',
    attrs: { options: [...] },
    defaultValue: 'default'
  }
]
```

### 3. 自定义组件
1. 在 `src/components/components/` 下创建 Vue 文件
2. 在注册表中设置 `componentPath` 属性

## 如何添加新的设置器

### 1. 创建设置器组件
在 `src/components/settings/` 下创建 Vue 文件，遵循以下接口：

```typescript
defineProps<{
  updateComponent: (item: ComponentItem | PageConfig) => void
  getCurrentComponent: () => ComponentItem | PageConfig | undefined
  // 其他自定义 props...
}>()
```

### 2. 注册设置器
在 `getComponentSpecificSettings` 函数中添加：

```typescript
{
  group: '属性',
  name: '设置器名称',
  sort: 1,
  componentPath: 'YourSetting.vue',
  props: { /* 传递给设置器的属性 */ }
}
```

## 组件元数据字段说明

- `category`: 分类键 (native/element/custom)
- `name`: 组件名称（对应 Vue 组件名）
- `title`: 显示标题
- `isNative`: 是否为原生 HTML 元素
- `props`: 默认组件属性
- `attrs`: 默认 HTML 属性（仅原生组件）
- `defaultStyle`: 默认样式
- `isCanNest`: 是否可嵌套其他组件
- `canNestElements`: 可嵌套的组件名称列表
- `componentPath`: 自定义组件文件路径
- `showTitle`: 是否显示标题内容（文本类组件）

## 设置器开发指南

### 通用设置器模式
1. 监听当前选中组件变化
2. 初始化表单值
3. 响应用户操作更新组件

### 示例：简单文本设置器
```vue
<template>
  <el-input v-model="value" @blur="handleChange" />
</template>

<script setup lang="ts">
// 获取当前组件、更新组件的逻辑
</script>
```

## 扩展建议

1. **添加更多 Element Plus 组件**：Form, Upload, Tree, Menu 等
2. **增强属性配置**：支持数组、对象类型的复杂属性
3. **默认子结构**：为容器类组件自动生成默认子节点
4. **组件搜索**：支持按名称、标签搜索组件
5. **组件预览**：为每个组件添加缩略图
6. **拖拽增强**：支持组件间的约束关系
7. **批量操作**：支持多选、复制、粘贴组件

## 注意事项

1. 新增组件需要确保 Element Plus 已正确导入
2. 自定义组件文件必须放在指定目录
3. 设置器组件需要正确处理 props 的类型安全
4. 属性配置中的 component 字段需要是有效的 Element Plus 组件名