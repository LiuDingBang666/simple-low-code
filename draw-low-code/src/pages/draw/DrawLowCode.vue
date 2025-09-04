<!--
@description: TODO 脱拽低代码设计器
@author: liudingbang
@date: 2025/9/1 14:38
-->

<template>
  <div @click="resetActive">
    <el-row class="header">
      <el-col class="header-column" :span="24"
        >{{ title }}
        <el-button style="margin-left: 10px" type="danger" @click.stop="reset">重置</el-button>
        <el-button style="margin-left: 10px" type="warning" @click.stop="preview">预览</el-button>
        <el-button style="margin-left: 10px" type="success" @click.stop="developing"
          >出码</el-button
        >
      </el-col>
    </el-row>
    <el-row class="content">
      <el-col class="components" :span="4">
        <DrawComponent />
      </el-col>
      <el-col class="content" :span="16">
        <DrawContent />
      </el-col>
      <el-col class="setting" :span="4">
        <DrawSetting />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import DrawComponent from '@/pages/draw/component/DrawComponent.vue'
import DrawContent from '@/pages/draw/render/DrawContent.vue'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { developing } from '@/utils/tip.ts'
import { useRouter } from 'vue-router'
import DrawSetting from '@/pages/draw/setting/DrawSetting.vue'
import { onUnmounted } from 'vue'
import useActiveComponentStore from '@/store/useActiveComponentStore.ts'

const title = import.meta.env.VITE_APP_TITLE

let scheme = useSchemeStore()

function reset() {
  scheme.clearScheme()
}

const router = useRouter()

function preview() {
  window.open(router.resolve('/preview').href, '_blank')
}

function resetActive() {
  useActiveComponentStore().clearActiveComponent()
}

onUnmounted(() => {
  useActiveComponentStore().clearActiveComponent()
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

  .components {
    overflow-x: hidden;
    border-top-width: 0px;
    height: 100%;
    width: 100%;
  }

  .setting {
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

:global(#render-component) {
  cursor: grab;
}

:global(.active-component) {
  border: 1px solid red !important;
}
</style>
