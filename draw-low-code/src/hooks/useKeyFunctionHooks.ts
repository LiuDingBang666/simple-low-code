import { onMounted, onUnmounted } from 'vue'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'
import UseSchemeStore from '@/store/useSchemeStore.ts'

/**
 * @name: 名称
 * @description: TODO 快捷键hooks
 * @author: liudingbang
 * @date: 2025/9/5 09:09
 */
export function useKeyFunctionHooks(callback?: (ev: KeyboardEvent) => void) {
  let { getActiveComponent, clearActiveComponent } = useActiveComponentStore()
  let { deleteComponentById, undo, getUndoStack, scheme } = UseSchemeStore()
  let isFocus = false

  function handlerKeyEvent() {
    return (ev: KeyboardEvent) => {
      // console.log(ev)
      if (ev.key === 'Backspace' && !isFocus) {
        let current = getActiveComponent().value
        if (current && 'id' in current && current.id) {
          deleteComponentById(current.id)
          clearActiveComponent()
          getUndoStack().value.push(JSON.parse(JSON.stringify(scheme)))
        }
      }
      if (callback) {
        callback(ev)
      }
      // ctrl + z 撤销
      if (ev.ctrlKey && ev.key === 'z') {
        undo()
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
