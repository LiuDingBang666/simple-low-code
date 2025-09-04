/**
 * @name: 名称
 * @description: TODO 当前活跃组件store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ComponentItem, PageConfig } from '@/types/draw/scheme.ts'
import useSchemeStore from '@/store/useSchemeStore.ts'

type ActiveComponent = ComponentItem | PageConfig | null
// 用于记录当前活跃组件的dom
export let beforeActiveComponentDom: HTMLElement | null = null
export const useActiveComponentStore = defineStore(
  'active-component',
  () => {
    // state
    const activeComponent = ref<ActiveComponent>(null)

    // actions
    function setActiveComponent(event: Event, newActiveComponent: ActiveComponent) {
      if (beforeActiveComponentDom != null) {
        beforeActiveComponentDom.classList.remove('active-component')
      }
      beforeActiveComponentDom = event.target as HTMLElement
      beforeActiveComponentDom.classList.add('active-component')
      console.log('当前活跃组件:', newActiveComponent)
      activeComponent.value = newActiveComponent
    }

    function clearActiveComponent() {
      console.log('清除当前活跃组件')
      if (beforeActiveComponentDom != null) {
        beforeActiveComponentDom.classList.remove('active-component')
      }
      beforeActiveComponentDom = null
      activeComponent.value = useSchemeStore().getScheme().value.page
    }

    // expose
    return { activeComponent, setActiveComponent, clearActiveComponent }
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
