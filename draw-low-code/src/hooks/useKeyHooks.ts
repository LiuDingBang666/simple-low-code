import { onMounted, onUnmounted } from 'vue'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'
import UseSchemeStore from '@/store/useSchemeStore.ts'

/**
 * @name: 名称
 * @description: TODO 快捷键hooks
 * @author: liudingbang
 * @date: 2025/9/5 09:09
 */
export function useKeyHooks(callback?: (ev: KeyboardEvent) => void) {
  let { getActiveComponent } = useActiveComponentStore()
  let { deleteComponentById } = UseSchemeStore()

  function handlerKeyEvent() {
    return (ev: KeyboardEvent) => {
      // console.log(ev)
      if (ev.key === 'Backspace') {
        let current = getActiveComponent().value
        if (current && 'id' in current && current.id) {
          deleteComponentById(current.id)
        }
      }
      if (callback) {
        callback(ev)
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handlerKeyEvent())
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handlerKeyEvent())
  })
}
