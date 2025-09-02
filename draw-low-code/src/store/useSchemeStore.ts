/**
 * @name: 名称
 * @description: TODO 设计器协议持久化store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ComponentItem, DrawScheme } from '@/types/draw/scheme.ts'

const defaultScheme = {
  version: '1.0.0',
  page: {},
}
export const useSchemeStore = defineStore(
  'scheme',
  () => {
    // state
    const scheme = ref<DrawScheme>(defaultScheme)

    // actions
    function setScheme(newScheme: any) {
      scheme.value = newScheme
    }

    function getScheme() {
      return computed(() => scheme.value)
    }

    function clearScheme() {
      scheme.value = defaultScheme
    }

    /**
     * 新增组件到协议中
     * @param data e:事件 targetDom:承载的元素 activeDom:当前 componentItem:组件项
     */
    function addComponent(data: {
      e: DragEvent
      targetDom: HTMLElement
      activeDom: HTMLElement
      componentItem: Omit<ComponentItem, 'id'>
    }) {
      let { e, targetDom, activeDom, componentItem } = data
      console.log('当前事件', e)
      console.log('承载元素', targetDom)
      console.log('当前脱拽元素', activeDom)
      console.log('当前组件', componentItem)

      // 如果是放在
    }

    // expose
    return { scheme, setScheme, getScheme, clearScheme, addComponent }
  },
  {
    persist: {
      key: 'scheme',
      storage: localStorage,
      pick: ['scheme'],
    },
  },
)

export default useSchemeStore
