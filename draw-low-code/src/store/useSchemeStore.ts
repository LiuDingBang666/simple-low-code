/**
 * @name: 名称
 * @description: TODO 设计器协议持久化store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { ComponentItem, DrawScheme } from '@/types/draw/scheme.ts'
import { v4 as uuidv4 } from 'uuid'

const defaultScheme: DrawScheme = {
  version: '1.0.0',
  page: {
    style: {
      padding: '10px',
    },
    children: [],
  },
}
export const useSchemeStore = defineStore(
  'scheme',
  () => {
    // state
    const scheme = ref<DrawScheme>(defaultScheme)

    // actions
    watch(scheme.value, () => {
      console.log('协议已更新')
      console.log(scheme.value)
    })

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

      // todo 每一个组件，都可以决定是否可以支持嵌套，支持嵌套的话需要确定哪些组件可以嵌套进来
      // 是否放在顶层
      const id = targetDom.getAttribute('data-id')
      if (id && id === 'top-node') {
        // 放在顶层，是否需要修改位置
        // 不需要修改位置，直接放置
        scheme.value.page.children!.push({
          ...componentItem,
          id: uuidv4(),
        })
        // todo 需要修改位置，找到目标元素，然后看放在左右还是上下
      } else {
        // todo 不放在顶层，需要找到对应的上层,放到上层下面
      }
    }

    // expose
    return { scheme, getScheme, setScheme, clearScheme, addComponent }
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
