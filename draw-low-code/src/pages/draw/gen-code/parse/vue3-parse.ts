/**
 * @name: 名称
 * @description: TODO
 * @author: liudingbang
 * @date: 2025/9/5 14:33
 */
import type { DrawScheme } from '@/types/draw/scheme.ts'

export function defaultVue3ParseScheme(scheme: DrawScheme): Record<string, string> {
  console.log(scheme)
  return {
    'index.vue': '<body></body>',
  }
}
