/**
 * @name: 名称
 * @description: TODO 脱拽事件hooks
 * @author: liudingbang
 * @date: 2025/9/2 09:56
 */
import { isReactive, isRef, onUnmounted, type Reactive, type Ref, watch } from 'vue'
import { debounce, throttle } from '@/utils/limit-flow-utils.ts'
import useSchemeStore from '@/store/useSchemeStore.ts'
import type { ComponentItem } from '@/types/draw/scheme.ts'

/**
 *  脱拽业务逻辑
 * @param dom dom 当前dom
 * @param componentItem 当前选择的组件
 * @param options 配置项 配置项
 */
// 存放当前正在拖拽的元素
let dropHoverDomStack: Array<HTMLElement> = []
const useDrawHooks = (
  dom: Ref<HTMLElement> | Reactive<HTMLElement> | HTMLElement,
  componentItem: ComponentItem,
  options?: {
    // 额外的事件处理
    extraEventCallBack: Record<string, any>
  },
) => {
  /**
   * 额外的事件处理
   * @param name 事件名称
   * @param e 事件对象
   */
  function handlerExtraEvent(name: string, e: DragEvent) {
    if (
      options &&
      options.extraEventCallBack[name] &&
      typeof options.extraEventCallBack[name] === 'function'
    ) {
      options.extraEventCallBack[name](e)
    }
  }

  /**
   * 在某个可放置元素上移动
   * ⚠️ 必须 e.preventDefault() 否则 drop 不会触发
   */
  const dragover = debounce(function (e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    // console.log('在容器上方移动', e)
    handlerExtraEvent('dragover', e)
  }, 100)

  /**
   * 拖拽中（高频触发，不推荐做逻辑）
   */
  const drag = throttle(function (e: DragEvent) {
    e.stopPropagation()
    // console.log('拖拽中', e)
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    if (target) {
      let attribute = target.getAttribute('data-can-drop')
      // 判断当前这个目标节点是不是支持嵌套并且是可以嵌套的节点
      let dataId = target.getAttribute('data-id')
      if (dataId && dataId !== 'top-node') {
        // 找到这个id对应的对接
        const scheme = useSchemeStore()
        let item = scheme.findComponentItemById(dataId)
        if (
          item &&
          (!item.isCanNest ||
            !item.canNestElements ||
            !item.canNestElements.includes(componentItem.name))
        ) {
          return
        }
      }
      if (attribute && attribute === 'true' && target !== activeDom) {
        targetDom = target
        targetDom.classList.add('drop-hover')
        // 将其他的全部失活
        dropHoverDomStack.push(targetDom)
        dropHoverDomStack.forEach((item) => {
          if (item !== targetDom) {
            item.classList.remove('drop-hover')
          }
        })
      } else {
        targetDom?.classList.remove('drop-hover')
        dropHoverDomStack = dropHoverDomStack.filter((item) => item !== targetDom)
        targetDom = null
      }
    }
    handlerExtraEvent('drag', e)
  }, 100)

  /**
   * 初始化事件
   * @param dom
   */
  function initEvent(dom: HTMLElement) {
    if (dom.getAttribute('isInitDrag') === 'true') {
      return
    }
    dom.addEventListener('dragstart', dragstart)
    dom.addEventListener('dragenter', dragenter)
    dom.addEventListener('dragover', dragover)
    dom.addEventListener('dragleave', dragleave)
    dom.addEventListener('drag', drag)
    dom.addEventListener('drop', drop)
    dom.addEventListener('dragend', dragend)
    dom.setAttribute('isInitDrag', 'true')
    instanceDom = dom
  }

  // 初始化逻辑
  let instanceDom: null | HTMLElement = null
  if (dom instanceof HTMLElement) {
    initEvent(dom)
  }
  watch(dom, () => {
    if (dom) {
      if (isRef(dom)) {
        initEvent(dom.value)
      } else if (isReactive(dom)) {
        initEvent(dom)
      }
    }
  })

  /**
   * 销毁事件
   */
  onUnmounted(() => {
    if (instanceDom) {
      instanceDom.removeEventListener('dragstart', dragstart)
      instanceDom.removeEventListener('dragenter', dragenter)
      instanceDom.removeEventListener('dragover', dragover)
      instanceDom.removeEventListener('dragleave', dragleave)
      instanceDom.removeEventListener('drag', drag)
      instanceDom.removeEventListener('drop', drop)
      instanceDom.removeEventListener('dragend', dragend)
      instanceDom = null
    }
  })

  // 当前脱拽的元素
  let activeDom: HTMLElement | null = null
  // 当前放置的元素
  let targetDom: HTMLElement | null = null

  // 事件处理
  /**
   * 开始拖拽
   */
  function dragstart(e: DragEvent) {
    // console.log('开始拖拽', e)
    e.stopPropagation()
    activeDom = e.target as HTMLElement
    // e.dataTransfer?.setData('text/plain', 'custom-component') // 设置标识
    handlerExtraEvent('dragstart', e)
  }

  /**
   * 进入某个可放置元素
   */
  function dragenter(e: DragEvent) {
    // console.log('进入某个可放置元素', e)
    e.stopPropagation()
    // const target = e.currentTarget as HTMLElement
    // target.classList.add('drop-hover') // 高亮
    handlerExtraEvent('dragenter', e)
  }

  /**
   * 离开某个可放置元素
   */
  function dragleave(e: DragEvent) {
    // console.log('离开某个可放置元素', e)
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    target.classList.remove('drop-hover')
    handlerExtraEvent('dragleave', e)
  }

  /**
   * 放下（成功 drop）
   */
  function drop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    // console.log('成功放下', e)
    // const type = e.dataTransfer?.getData('text/plain')
    // console.log('拖拽的类型:', type)
    //
    // const target = e.currentTarget as HTMLElement
    // target.classList.remove('drop-hover')
    handlerExtraEvent('drop', e)
  }

  /**
   * 获取拖拽位置
   * @param e 脱拽事件
   * @param targetElement 当前放置的节点
   */
  function getDragPosition(e: DragEvent, targetElement: HTMLElement): DragPosition {
    const rect = targetElement.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    // 鼠标相对元素左上角的 X
    const offsetX = x - rect.left
    // 鼠标相对元素左上角的 Y
    const offsetY = y - rect.top

    const thirdWidth = rect.width / 3
    const thirdHeight = rect.height / 3

    if (offsetY < thirdHeight) return 'top'
    if (offsetY > rect.height - thirdHeight) return 'bottom'
    if (offsetX < thirdWidth) return 'left'
    if (offsetX > rect.width - thirdWidth) return 'right'
    return 'center'
  }

  /**
   * 获取最接近的元素
   * @param e 脱拽事件
   * @param candidates 候选元素
   */
  function getClosestNode(e: DragEvent, candidates: Array<Element>) {
    const mouseX = e.clientX
    const mouseY = e.clientY

    let closest = null
    let minDistance = Infinity

    candidates.forEach((node) => {
      const rect = node.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = mouseX - centerX
      const dy = mouseY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < minDistance) {
        minDistance = distance
        closest = node
      }
    })
    if (closest == null) {
      console.error('没有找到最接近的元素')
    }
    return closest
  }

  /**
   * 拖拽结束（无论是否成功 drop）
   */
  async function dragend(e: DragEvent) {
    // console.log('拖拽结束-dragend', e)
    e.stopPropagation()
    // todo 动态生成协议，页面上根据协议来渲染对应的组件，点击组件后，找到当前协议对应的组件，通过修改配置来更新组件的信息。最后通过协议来生成页面代码
    if (targetDom && activeDom) {
      targetDom.classList.remove('drop-hover')
      const scheme = useSchemeStore()
      let allComponentDoms = [...document.querySelectorAll('#render-component')]
      let closestNode = getClosestNode(e, allComponentDoms)!
      let closestNodePosition: DragPosition = 'center'
      console.log('最近的节点')
      console.log(closestNode)
      if (closestNode) {
        closestNodePosition = getDragPosition(e, closestNode)
        console.log('最近的节点位置', closestNodePosition)
      }
      await scheme.updateComponent({
        e,
        targetDom,
        activeDom,
        componentItem,
        closestNode,
        closestNodePosition,
      })
    }
    targetDom = null
    activeDom = null
    handlerExtraEvent('dragend', e)
  }

  return {
    instanceDom,
  }
}

export default useDrawHooks

/**
 * 通过引用初始化脱拽功能
 * @param value ref值
 * @param componentItem 组件项
 */
export function refInitDrawHooks(value: any, componentItem: ComponentItem) {
  if (value instanceof HTMLElement) {
    useDrawHooks(value, componentItem)
  } else if (value instanceof Object) {
    if (value.$el) {
      useDrawHooks(value.$el, componentItem)
    }
  }
}

export type DragPosition = 'top' | 'bottom' | 'left' | 'right' | 'center'
