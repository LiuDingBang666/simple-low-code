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
export const activeComponentDomStack: Array<HTMLElement> = []
export const useActiveComponentStore = defineStore(
  'active-component',
  () => {
    // state
    const activeComponent = ref<ActiveComponent>(null)

    // actions
    function setActiveComponent(event: Event, newActiveComponent: ActiveComponent) {
      activeComponentDomStack.push(event.target as HTMLElement)
      console.log(activeComponentDomStack)
      let current = activeComponentDomStack[activeComponentDomStack.length - 1]
      console.log(current)
      current.classList.add('active-component')
      activeComponentDomStack.forEach((item) => {
        if (item !== current) {
          item.classList.remove('active-component')
        }
      })

      console.log('当前活跃组件:', newActiveComponent)
      activeComponent.value = newActiveComponent
    }

    function clearActiveComponent() {
      console.log('清除当前活跃组件')
      activeComponentDomStack.forEach((item) => {
        item.classList.remove('active-component')
      })
      activeComponentDomStack.length = 0
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
