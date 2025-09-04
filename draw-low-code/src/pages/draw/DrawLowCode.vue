<!--
@description: TODO 脱拽低代码设计器
@author: liudingbang
@date: 2025/9/1 14:38
-->

<template>
  <el-row class="header">
    <el-col class="header-column" :span="24"
      >{{ title }}
      <el-button style="margin-left: 10px" type="danger" @click="reset">重置</el-button>
      <el-button style="margin-left: 10px" type="warning" @click="preview">预览</el-button>
      <el-button style="margin-left: 10px" type="success" @click="developing">出码</el-button>
    </el-col>
  </el-row>
  <el-row class="content">
    <el-col class="components" :span="4">
      <DrawComponent />
    </el-col>
    <el-col class="content" :span="16">
      <DrawContent />
    </el-col>
    <el-col class="setting" :span="4"></el-col>
  </el-row>
</template>

<script setup lang="ts">
import DrawComponent from '@/pages/draw/component/DrawComponent.vue'
import DrawContent from '@/pages/draw/render/DrawContent.vue'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { developing } from '@/utils/tip.ts'
import { useRouter } from 'vue-router'

const title = import.meta.env.VITE_APP_TITLE

let scheme = useSchemeStore()

function reset() {
  scheme.clearScheme()
}

const router = useRouter()
function preview() {
  window.open(router.resolve('/preview').href, '_blank')
}
</script>

<style scoped lang="scss">
.header {
  height: 10vh;

  .header-column {
    border-bottom-width: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.content {
  height: 90vh;

  .components {
    overflow-x: hidden;
    border-top-width: 0px;
  }

  .setting {
    border-top-width: 0px;
  }

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
}

.el-col {
  border: 0.5px solid rgba(128, 128, 128, 0.3);

  .full-wh {
    width: 100%;
    height: 100%;
  }
}

:global(.drop-hover) {
  border: 1px solid dodgerblue !important;
}
:global(#render-component) {
  cursor: grab;
}
</style>
