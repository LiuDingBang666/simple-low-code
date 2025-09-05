/**
 * @name: 名称
 * @description: TODO 设计器协议持久化store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */
import { defineStore } from 'pinia'
import { computed, nextTick, ref, watch } from 'vue'
import type { ComponentItem, DrawScheme, PageConfig } from '@/types/draw/scheme.ts'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'
import type { DragPosition } from '@/hooks/useDrawHooks.ts'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'
import { getInheritSettingGroup, getInheritSettings } from '@/pages/draw/setting/setting-config.ts'

const defaultScheme: DrawScheme = {
  version: '1.0.0',
  page: {
    isPage: true,
    style: {},
    children: [],
  },
}
export const useSchemeStore = defineStore(
  'scheme',
  () => {
    // state
    const scheme = ref<DrawScheme>(defaultScheme)
    scheme.value.page.settings = getInheritSettings()
    scheme.value.page.groups = getInheritSettingGroup()
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
      scheme.value = {
        version: '1.0.0',
        page: {
          isPage: true,
          style: {},
          children: [],
          settings: getInheritSettings(),
          groups: getInheritSettingGroup(),
        },
      }
      ElMessage.success('重置成功')
    }

    /**
     * 新增组件
     * @param children 当前同级数组
     * @param componentItem 当前组件数据
     * @param closestNodePosition 放置位置
     * @param closestNode 临近节点
     */
    async function addComponent(
      children: Array<ComponentItem>,
      componentItem: ComponentItem,
      closestNode: Element,
      closestNodePosition: DragPosition,
    ) {
      // console.log(children)
      // console.log(componentItem)
      // console.log(position)
      let item: ComponentItem = {
        ...componentItem,
      } as any
      let isAdd = false
      // 保留原来的id
      if (!item.id) {
        isAdd = true
        item.id = 'uuid-' + uuidv4()
      }
      let closestNodeId = closestNode.getAttribute('data-id')
      let activeComponents: Array<ComponentItem> = []
      if (closestNodeId == 'top-node') {
        // 顶级就是第一级
        activeComponents = children
      } else {
        // 非顶级就是父级的下一级,当上级没有时，说明是顶级节点，只有顶级节点没有父级
        let parent = findComponentItemById(componentItem.parentId!)
        activeComponents = parent?.children ?? children
      }
      // 找到对应的位置
      let index = activeComponents.findIndex((item) => item.id === closestNodeId)
      console.log('最近的位置:')
      console.log(index)
      switch (closestNodePosition) {
        case 'top':
        case 'left':
          console.log('放到头部')
          activeComponents.splice(Math.max(index, 0), 0, item)
          break
        case 'right':
        case 'bottom':
          console.log('放到尾部')
          activeComponents.splice(index != -1 ? index + 1 : children.length, 0, item)
          break
        case 'center':
          console.log('放到中间')
          activeComponents.splice(Math.ceil(activeComponents.length / 2), 0, item)
      }
      if (isAdd) {
        // 默认新增的激活
        await nextTick()
        let dom = document.querySelector('.' + item.id)
        if (dom) {
          let activeComponentStore = useActiveComponentStore()
          activeComponentStore.clearActiveComponent()
          activeComponentStore.setActiveComponent({ target: dom } as unknown as Event, item)
        }
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
    async function updateComponent(data: {
      e: DragEvent
      targetDom: HTMLElement
      activeDom: HTMLElement
      componentItem: ComponentItem
      closestNode: Element
      closestNodePosition: DragPosition
    }) {
      let { e, targetDom, activeDom, componentItem, closestNode, closestNodePosition } = data
      console.log('当前事件', e)
      console.log('承载元素', targetDom)
      console.log('当前脱拽元素', activeDom)
      console.log('当前组件', componentItem)
      console.log('当前临近节点', closestNode)
      console.log('当前位置', closestNodePosition)

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
        // 既然要放在顶层，那父节点肯定没有
        componentItem.parentId = undefined
        await addComponent(
          scheme.value.page.children!,
          componentItem,
          closestNode,
          closestNodePosition,
        )
      } else {
        // 找到目标节点，作为子节点放入
        const targetComponentItem = findComponentItemById(id)
        if (targetComponentItem) {
          if (!targetComponentItem?.children) {
            targetComponentItem.children = []
          }
          componentItem.parentId = targetComponentItem.id
          await addComponent(
            targetComponentItem.children,
            componentItem,
            closestNode,
            closestNodePosition,
          )
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

    /**
     * 通过id更新组件项
     * @param id 组件项id
     * @param newComponentItem 新的组件项
     */
    function updateComponentById(id: string, newComponentItem: ComponentItem) {
      let componentItem = findComponentItemById(id)
      if (componentItem) {
        Object.assign(componentItem, newComponentItem)
      }
    }

    /**
     * 更新页面
     * @param page
     */
    function updatePage(page: PageConfig) {
      Object.assign(scheme.value.page, page)
      console.log(scheme.value.page)
    }

    /**
     * 获取页面
     */
    function getPage() {
      return scheme.value.page
    }

    // expose
    return {
      scheme,
      getScheme,
      setScheme,
      clearScheme,
      updateComponent,
      findComponentItemById,
      deleteComponentById,
      updateComponentById,
      updatePage,
      getPage,
    }
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
