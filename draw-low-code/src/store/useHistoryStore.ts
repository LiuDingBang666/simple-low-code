import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const history = ref<any[]>([])
  const future = ref<any[]>([])

  function push(state: any) {
    history.value.push(JSON.parse(JSON.stringify(state)))
    future.value = []
  }

  function undo(currentState: any) {
    if (history.value.length > 0) {
      const prev = history.value.pop()
      future.value.push(JSON.parse(JSON.stringify(currentState)))
      return prev
    }
    return null
  }

  function redo(currentState: any) {
    if (future.value.length > 0) {
      const next = future.value.pop()
      history.value.push(JSON.parse(JSON.stringify(currentState)))
      return next
    }
    return null
  }

  function clear() {
    history.value = []
    future.value = []
  }

  return { history, future, push, undo, redo, clear }
})

export default useHistoryStore
