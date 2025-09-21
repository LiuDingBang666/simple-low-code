<template>
  <div class="props-setting">
    <!-- 动态生成属性表单 -->
    <template v-for="prop in propConfig" :key="prop.key">
      <div class="prop-item">
        <label class="prop-label">{{ prop.label }}</label>
        <component 
          :is="prop.component" 
          v-model="propValues[prop.key]"
          v-bind="prop.attrs"
          @change="handlePropChange"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme'

interface PropConfig {
  key: string
  label: string
  component: string
  attrs?: Record<string, any>
  defaultValue?: any
}

const props = defineProps<{
  updateComponent: (item: ComponentItem | PageConfig) => void
  getCurrentComponent: () => ComponentItem | PageConfig | undefined
  propConfig: PropConfig[]
}>()

const propValues = ref<Record<string, any>>({})

const currentComponent = computed(() => props.getCurrentComponent())

onMounted(() => {
  initPropValues()
})

watch(() => currentComponent.value, () => {
  initPropValues()
}, { deep: true })

function initPropValues() {
  const comp = currentComponent.value
  if (!comp) return
  
  const newValues: Record<string, any> = {}
  props.propConfig.forEach(config => {
    if ('props' in comp && comp.props?.[config.key] !== undefined) {
      newValues[config.key] = comp.props[config.key]
    } else {
      newValues[config.key] = config.defaultValue
    }
  })
  propValues.value = newValues
}

function handlePropChange() {
  const comp = currentComponent.value
  if (!comp) return
  
  const updatedComponent = { ...comp }
  if (!('props' in updatedComponent)) {
    // @ts-ignore
    updatedComponent.props = {}
  }
  
  Object.keys(propValues.value).forEach(key => {
    if (propValues.value[key] !== undefined) {
      // @ts-ignore
      updatedComponent.props[key] = propValues.value[key]
    }
  })
  
  props.updateComponent(updatedComponent)
}
</script>

<style scoped lang="scss">
.props-setting {
  padding: 8px 0;
}

.prop-item {
  margin-bottom: 12px;
}

.prop-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

:deep(.el-input),
:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  font-size: 12px;
}
</style>