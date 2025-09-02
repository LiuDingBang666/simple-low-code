/**
 * @name: 名称
 * @description: TODO 脱拽事件hooks
 * @author: liudingbang
 * @date: 2025/9/2 09:56
 */
import { isReactive, isRef, onUnmounted, type Reactive, type Ref, watch } from 'vue'
import { debounce, throttle } from '@/utils/limit-flow-utils.ts'

/**
 *  脱拽业务逻辑
 * @param dom dom
 * @param options 配置项
 */
const useDrawHooks = (
  dom: Ref<HTMLElement> | Reactive<HTMLElement> | HTMLElement,
  options?: {
    extraEventCallBack: Record<string, any>
  },
) => {
  // 初始化逻辑
  let instanceDom: null | HTMLElement = null
  watch(dom, () => {
    if (dom) {
      if (isRef(dom)) {
        initEvent(dom.value)
      } else if (isReactive(dom)) {
        initEvent(dom)
      } else if (dom instanceof HTMLElement) {
        initEvent(dom)
      }
    }
  })

  /**
   * 初始化事件
   * @param dom
   */
  function initEvent(dom: HTMLElement) {
    dom.addEventListener('dragstart', dragstart)
    dom.addEventListener('dragenter', dragenter)
    dom.addEventListener('dragover', dragover)
    dom.addEventListener('dragleave', dragleave)
    dom.addEventListener('drag', drag)
    dom.addEventListener('drop', drop)
    dom.addEventListener('dragend', dragend)
    instanceDom = dom
  }

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

  // 事件处理
  /**
   * 开始拖拽
   */
  function dragstart(e: DragEvent) {
    console.log('开始拖拽', e)
    activeDom = e.target as HTMLElement
    // e.dataTransfer?.setData('text/plain', 'custom-component') // 设置标识
    handlerExtraEvent('dragstart', e)
  }

  /**
   * 拖拽中（高频触发，不推荐做逻辑）
   */
  const drag = throttle(function (e: DragEvent) {
    console.log('拖拽中', e)
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    if (target) {
      console.log(target)
      let attribute = target.getAttribute('data-can-drop')
      if (attribute && attribute === 'true') {
        targetDom = target
        targetDom.classList.add('drop-hover')
      } else {
        targetDom?.classList.remove('drop-hover')
        targetDom = null
      }
    }
    handlerExtraEvent('drag', e)
  }, 100)

  /**
   * 进入某个可放置元素
   */
  function dragenter(e: DragEvent) {
    console.log('进入某个可放置元素', e)
    // const target = e.currentTarget as HTMLElement
    // target.classList.add('drop-hover') // 高亮
    handlerExtraEvent('dragenter', e)
  }

  /**
   * 离开某个可放置元素
   */
  function dragleave(e: DragEvent) {
    console.log('离开某个可放置元素', e)
    // const target = e.currentTarget as HTMLElement
    // target.classList.remove('drop-hover')
    handlerExtraEvent('dragleave', e)
  }

  /**
   * 在某个可放置元素上移动
   * ⚠️ 必须 e.preventDefault() 否则 drop 不会触发
   */
  const dragover = debounce(function (e: DragEvent) {
    e.preventDefault()
    console.log('在容器上方移动', e)
    handlerExtraEvent('dragover', e)
  }, 100)

  /**
   * 放下（成功 drop）
   */
  function drop(e: DragEvent) {
    e.preventDefault()
    console.log('成功放下', e)
    // const type = e.dataTransfer?.getData('text/plain')
    // console.log('拖拽的类型:', type)
    //
    // const target = e.currentTarget as HTMLElement
    // target.classList.remove('drop-hover')
    handlerExtraEvent('drop', e)
  }

  /**
   * 拖拽结束（无论是否成功 drop）
   */
  function dragend(e: DragEvent) {
    console.log('拖拽结束-dragend', e)
    // 模拟克隆 DOM
    if (targetDom && activeDom) {
      targetDom.classList.remove('drop-hover')
      const clone = activeDom.cloneNode(true) as HTMLElement
      targetDom.appendChild(clone)
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
