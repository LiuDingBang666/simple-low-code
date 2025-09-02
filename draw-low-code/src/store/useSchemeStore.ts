/**
 * @name: 名称
 * @description: TODO 设计器协议持久化store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { DrawScheme } from '@/types/draw/scheme.ts'

const defaultScheme = {
  version: '1.0.0',
  page: {},
}
export const useSchemeStore = defineStore(
  'scheme',
  () => {
    // state
    const scheme = ref<DrawScheme>(defaultScheme)

    // actions
    function setScheme(newScheme: any) {
      scheme.value = newScheme
    }

    function getScheme() {
      return computed(() => scheme.value)
    }

    function clearScheme() {
      scheme.value = defaultScheme
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
