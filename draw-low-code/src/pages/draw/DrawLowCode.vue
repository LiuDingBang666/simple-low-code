<!--
@description: TODO 脱拽低代码设计器
@author: liudingbang
@date: 2025/9/1 14:38
-->

<template>
  <div @click="resetActive" style="overflow: hidden">
    <el-row class="header">
      <el-col class="header-column" :span="24"
        >{{ title }}
        <el-button style="margin-left: 10px" type="danger" @click.stop="reset">重置</el-button>
        <el-button style="margin-left: 10px" type="warning" @click.stop="preview">预览</el-button>
        <el-button style="margin-left: 10px" type="success" @click.stop="genCode">出码 </el-button>
      </el-col>
    </el-row>
    <el-row class="content">
      <el-col class="components" :span="4">
        <DrawComponent />
      </el-col>
      <el-col class="main" :span="16">
        <DrawContent />
      </el-col>
      <el-col class="setting" :span="4" @click.stop>
        <DrawSetting />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import DrawComponent from '@/pages/draw/component/DrawComponent.vue'
import DrawContent from '@/pages/draw/render/DrawContent.vue'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { useRouter } from 'vue-router'
import DrawSetting from '@/pages/draw/setting/DrawSetting.vue'
import { onMounted, onUnmounted } from 'vue'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'
import { useKeyFunctionHooks } from '@/hooks/useKeyFunctionHooks.ts'
import { ElNotification } from 'element-plus'
import { genCode } from '@/pages/draw/gen-code/gen-code.ts'

const title = import.meta.env.VITE_APP_TITLE

let scheme = useSchemeStore()
let activeComponent = useActiveComponentStore()

function reset() {
  scheme.clearScheme()
  activeComponent.clearActiveComponent()
}

const router = useRouter()
// 注入键盘事件监听功能
useKeyFunctionHooks()

function preview() {
  window.open(router.resolve('/preview').href, '_blank')
}

function resetActive() {
  useActiveComponentStore().clearActiveComponent()
}

onUnmounted(() => {
  resetActive()
})

onMounted(() => {
  ElNotification.success(
    '欢迎使用低代码平台,如遇到问题，请点击重置后再试试,如果还是不行，请加作者Wechat或提交bug～',
  )
})
</script>

<style scoped lang="scss">
.header {
  height: 10vh;

  .header-column {
    font-weight: bold;
    border-bottom-width: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.content {
  border: 0.5px solid rgba(128, 128, 128, 0.3);
  height: 90vh;
  overflow-x: hidden;

  .components {
    overflow-x: hidden;
    border-right: 0.5px solid rgba(128, 128, 128, 0.3);
    border-top-width: 0px;
    height: 100%;
    width: 100%;
  }

  .main {
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  .setting {
    overflow: hidden;
    border-left: 0.5px solid rgba(128, 128, 128, 0.3);
    border-top-width: 0px;
    height: 100%;
    width: 100%;
  }

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
}

.el-col {
  .full-wh {
    width: 100%;
    height: 100%;
  }
}

// 全局样式
:global(.drop-hover) {
  border: 1px solid dodgerblue !important;
}

:global(.drop-hover-position-left) {
  border-left: 5px dashed lawngreen !important;
}

:global(.drop-hover-position-right) {
  border-right: 5px dashed lawngreen !important;
}

:global(.drop-hover-position-top) {
  border-top: 5px dashed lawngreen !important;
}

:global(.drop-hover-position-bottom) {
  border-bottom: 5px dashed lawngreen !important;
}

:global(#render-component) {
  cursor: grab;
}

:global(.active-component) {
  border: 1px solid red !important;
}
</style>
