/**
 * @name: 名称
 * @description: TODO 当前活跃组件store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */
import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme.ts'

export type ActiveComponent = ComponentItem | PageConfig | null
// 用于记录当前活跃组件的dom
export let beforeActiveComponentDom: HTMLElement | null = null
export const useActiveComponentStore = defineStore(
  'active-component',
  () => {
    // state
    // @ts-ignore
    const activeComponent: Ref<ActiveComponent> = ref<ActiveComponent>(null)

    // actions
    function setActiveComponent(event: Event, newActiveComponent: ActiveComponent) {
      if (beforeActiveComponentDom != null) {
        if (event.target === beforeActiveComponentDom) {
          return
        }
        beforeActiveComponentDom.classList.remove('active-component')
      }
      beforeActiveComponentDom = event.target as HTMLElement
      beforeActiveComponentDom.classList.add('active-component')
      console.log('当前活跃组件:', newActiveComponent)
      activeComponent.value = newActiveComponent
    }

    function clearActiveComponent() {
      if (activeComponent.value == null) {
        return
      }
      if (beforeActiveComponentDom != null) {
        beforeActiveComponentDom.classList.remove('active-component')
      }
      beforeActiveComponentDom = null
      activeComponent.value = null
    }

    /**
     * 获取当前活跃组件
     */
    function getActiveComponent() {
      return computed(() => activeComponent.value)
    }

    // expose
    return { activeComponent, setActiveComponent, clearActiveComponent, getActiveComponent }
  },
  {
    persist: {
      key: 'active-component',
      storage: localStorage,
      pick: ['activeComponent'],
    },
  },
)

export default useActiveComponentStore
