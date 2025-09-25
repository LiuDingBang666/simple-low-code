import { onMounted, onUnmounted } from 'vue'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'
import UseSchemeStore from '@/store/useSchemeStore.ts'
import type { ComponentItem } from '@/types/draw/scheme.ts'

/**
 * @name: 名称
 * @description: TODO 快捷键hooks
 * @author: liudingbang
 * @date: 2025/9/5 09:09
 */
export function useKeyFunctionHooks(callback?: (ev: KeyboardEvent) => void) {
  let { clearActiveComponent } = useActiveComponentStore()
  let { deleteComponentById, undo, getUndoStack, scheme, updateComponent } = UseSchemeStore()
  // 输入框是否聚焦
  let isFocus = false

  let currentCopyItem: ComponentItem | null = null
  let copyType: 'copy' | 'cut' | null = null
  function handlerKeyEvent() {
    return (ev: KeyboardEvent) => {
      // console.log(ev)
      if (ev.key === 'Backspace' && !isFocus) {
        handleCurrentActiveComponent((current) => {
          deleteComponentById(current.id)
          clearActiveComponent()
          getUndoStack().value.push(JSON.parse(JSON.stringify(scheme)))
        })
      }
      if (callback) {
        callback(ev)
      }
      // ctrl + z 撤销
      if (ev.ctrlKey && ev.key === 'z') {
        undo()
      }
      // ctrl + c 复制
      if (ev.ctrlKey && ev.key === 'c') {
        currentCopyItem = getActiveComponentItem()
        copyType = 'copy'
      }
      // ctrl + x 剪切
      if (ev.ctrlKey && ev.key === 'x') {
        currentCopyItem = getActiveComponentItem()
        copyType = 'cut'
      }
      // ctrl + v 粘贴
      if (ev.ctrlKey && ev.key === 'v') {
        if (currentCopyItem && copyType) {
          if (copyType === 'cut') {
            deleteComponentById(currentCopyItem.id!)
          }
          // 选择放置的位置 如果有活跃的，就放在当前活跃的下面
          let active = getActiveComponentItem()
          if (active) {
          }
          currentCopyItem = null
          copyType = null
        }
      }
    }
  }

  function handlerFocusin() {
    return (event: any) => {
      const el = event.target as any
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
        isFocus = true
      }
    }
  }

  function handlerFocusout() {
    return (event: any) => {
      const el = event.target as any
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
        isFocus = false
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handlerKeyEvent())
    document.addEventListener('focusin', handlerFocusin())
    document.addEventListener('focusout', handlerFocusout())
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handlerKeyEvent())
    document.removeEventListener('focusin', handlerFocusin())
    document.removeEventListener('focusout', handlerFocusout())
  })
}

/**
 * 获取当前激活的组件
 */
function getActiveComponentItem(): (ComponentItem & { id: string }) | null {
  let { getActiveComponent } = useActiveComponentStore()
  let current = getActiveComponent().value
  if (current && 'id' in current && current.id) {
    return current as ComponentItem & { id: string }
  }
  return null
}

/**
 * 处理当前激活的组件
 * @name: 获取当前激活的组件
 * @param callback 回调函数
 */
function handleCurrentActiveComponent(callback: (item: ComponentItem & { id: string }) => void) {
  let current = getActiveComponentItem()
  if (!current) {
    return
  }
  callback(current)
}
