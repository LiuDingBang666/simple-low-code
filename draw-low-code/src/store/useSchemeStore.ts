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
import { ElMessage } from 'element-plus'
import type { DragPosition } from '@/hooks/useDrawHooks.ts'

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
      console.log('当前协议信息:')
      console.log(scheme.value)
    })

    /**
     * 设置协议信息
     * @param newScheme 协议信息
     */
    function setScheme(newScheme: any) {
      scheme.value = newScheme
    }

    /**
     * 获取协议信息
     */
    function getScheme() {
      return computed(() => scheme.value)
    }

    /**
     * 清空协议信息
     */
    function clearScheme() {
      scheme.value = { version: '1.0.0', page: { style: { padding: '10px' }, children: [] } }
      ElMessage.success('重置成功')
    }

    /**
     * 新增组件
     * @param children 当前同级数组
     * @param componentItem 当前组件数据
     * @param position 放置位置
     */
    function addComponent(
      children: Array<ComponentItem>,
      componentItem: ComponentItem,
      position: DragPosition,
    ) {
      // console.log(children)
      // console.log(componentItem)
      // console.log(position)
      let item: ComponentItem = {
        ...componentItem,
        id: uuidv4(),
      } as any
      if (children.length > 0) {
        switch (position) {
          case 'top':
          case 'left':
            // console.log('放到头部')
            children.splice(0, 0, item)
            break
          case 'right':
          case 'bottom':
          case 'center':
            // console.log('放到尾部')
            children.push(item)
            break
        }
      } else {
        children.push(item)
        // console.log('放到尾部')
      }
    }

    /**
     * 通过，删除组件树中的某一项
     * @param id 组件项id
     */
    function deleteComponentById(id: string) {
      let children = scheme.value.page.children!

      function deleteComponentById(children: Array<ComponentItem>) {
        for (let i = 0; i < children.length; i++) {
          if (children[i].id === id) {
            children.splice(i, 1)
            return
          }
          if (children[i].children) {
            deleteComponentById(children[i].children!)
          }
        }
      }

      // @ts-ignore
      deleteComponentById(children)
    }

    /**
     * 新增组件到协议中
     * @param data e:事件 targetDom:承载的元素 activeDom:当前 componentItem:组件项
     */
    function updateComponent(data: {
      e: DragEvent
      targetDom: HTMLElement
      activeDom: HTMLElement
      componentItem: ComponentItem
      position: DragPosition
    }) {
      let { e, targetDom, activeDom, componentItem, position } = data
      console.log('当前事件', e)
      console.log('承载元素', targetDom)
      console.log('当前脱拽元素', activeDom)
      console.log('当前组件', componentItem)
      console.log('当前位置', position)

      // 修改,先删除当前节点，再放入到指定节点中
      if (componentItem.id) {
        deleteComponentById(componentItem.id)
      }
      // 有data-id的元素才是合法的承载对象
      const id = targetDom.getAttribute('data-id')
      if (id == null) {
        return
      }
      // 是否放在顶层
      if (id === 'top-node') {
        // 放在顶层
        // @ts-ignore
        addComponent(scheme.value.page.children!, componentItem, position)
      } else {
        // 找到目标节点，作为子节点放入
        const targetComponentItem = findComponentItemById(id)
        if (targetComponentItem) {
          if (!targetComponentItem?.children) {
            targetComponentItem.children = []
          }
          addComponent(targetComponentItem.children, componentItem, position)
        }
      }
    }

    /**
     * 通过id查找组件项
     * @param id 组件项id
     */
    function findComponentItemById(id: string) {
      // 树转list
      const list: Array<ComponentItem> = []

      function treeToList(tree: Array<ComponentItem>) {
        tree.forEach((item) => {
          list.push(item)
          if (item.children) {
            treeToList(item.children)
          }
        })
      }

      // @ts-ignore
      treeToList(scheme.value.page.children!)
      return list.find((item) => item.id === id)
    }

    // expose
    return { scheme, getScheme, setScheme, clearScheme, updateComponent, findComponentItemById }
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
