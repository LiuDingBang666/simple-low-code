/**
 * @name: 名称
 * @description: TODO 设计器协议持久化store
 * @author: liudingbang
 * @date: 2025/9/1 15:26
 */

import { defineStore } from 'pinia'

export default defineStore('scheme', () => {
  return {
    scheme: {},
    setScheme(scheme: any) {
      this.scheme = scheme
    },
    getScheme() {
      return this.scheme
    },
  }
})
