<!--
@description: TODO 脱拽组件
@author: liudingbang
@date: 2025/9/1 16:43
-->

<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item title="一致性 Consistency" name="1">
      <div
        draggable="true"
        class="box"
        @dragstart="dragstart"
        @drag="drag"
        @drop="drop"
        @dragenter="dragenter"
        @dragleave="dragleave"
        @dragover="dragover"
        @dragend="dragend"
      >
        我是元素
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('1')

// 脱拽业务逻辑

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

let activeDom: HTMLElement | null = null
let targetDom: HTMLElement | null = null

/**
 * 开始拖拽
 */
function dragstart(e: DragEvent) {
  console.log('开始拖拽', e)
  activeDom = e.target as HTMLElement
  // e.dataTransfer?.setData('text/plain', 'custom-component') // 设置标识
}

/**
 * 拖拽中（高频触发，不推荐做逻辑）
 */
let drag = throttle(function (e: DragEvent) {
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
}, 100)

/**
 * 进入某个可放置元素
 */
function dragenter(e: DragEvent) {
  console.log('进入某个可放置元素', e)
  // const target = e.currentTarget as HTMLElement
  // target.classList.add('drop-hover') // 高亮
}

/**
 * 离开某个可放置元素
 */
function dragleave(e: DragEvent) {
  console.log('离开某个可放置元素', e)
  // const target = e.currentTarget as HTMLElement
  // target.classList.remove('drop-hover')
}

/**
 * 在某个可放置元素上移动
 * ⚠️ 必须 e.preventDefault() 否则 drop 不会触发
 */
const dragover = debounce(function (e: DragEvent) {
  e.preventDefault()
  console.log('在容器上方移动', e)
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
    clone.style.position = 'absolute'
    clone.style.left = `${e.clientX - activeDom.clientWidth}px`
    clone.style.top = `${e.clientY - activeDom.clientHeight}px`
    targetDom.appendChild(clone)
  }
  targetDom = null
  activeDom = null
}
</script>

<style scoped lang="scss">
.box {
  width: 100px;
  height: 100px;
  @include flex-center();
  border-radius: 5px;
  background-color: red;

  cursor: grab;
}

:global(.drop-hover) {
  border: 1px solid dodgerblue !important;
}
</style>
