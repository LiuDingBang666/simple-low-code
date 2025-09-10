/**
 * @name: 名称
 * @description: TODO 限流工具
 * @author: liudingbang
 * @date: 2025/9/2 09:57
 */
/**
 * 防抖函数-一抖就重新开始
 * @param fn
 * @param delay
 */
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数-一抖就等一段时间再开始
 * @param fn
 * @param delay
 */
function throttle<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

export { debounce, throttle }
