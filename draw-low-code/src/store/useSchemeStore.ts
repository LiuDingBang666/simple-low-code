/**
 * @name: 名称
 * @description: TODO 设计器协议持久化store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSchemeStore = defineStore(
  'scheme',
  () => {
    // state
    const scheme = ref({})

    // actions
    function setScheme(newScheme: any) {
      scheme.value = newScheme
    }

    function getScheme() {
      return scheme.value
    }

    function clearScheme() {
      scheme.value = {}
    }

    // expose
    return { scheme, setScheme, getScheme, clearScheme }
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
