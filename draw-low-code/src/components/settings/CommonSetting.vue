<!--
@description: TODO 通用设计器-样式
@author: liudingbang
@date: 2025/9/10 14:12
-->

<template>
  <div class="setting">
    <el-form ref="form" :model="styleSetting">
      <el-form-item label="宽度">
        <el-input
          style="width: 55%"
          v-model="styleSetting.width"
          type="number"
          min="0"
          placeholder="请输入宽度"
        ></el-input>
        <el-select
          style="width: 30%; margin-left: 10px"
          :clearable="false"
          v-model="styleSetting.widthFormat"
          placeholder="请选择格式"
        >
          <el-option label="px" value="px" />
          <el-option label="rem" value="rem" />
          <el-option label="%" value="%" />
          <el-option label="vw" value="vw" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { SettingPlugin } from '@/types/draw/setting.ts'
import { onMounted, reactive, useAttrs } from 'vue'

let setting: SettingPlugin = useAttrs() as unknown as SettingPlugin

let styleSetting = reactive<CSSStyleDeclaration & any>({
  widthFormat: 'px',
} as any)
onMounted(() => {
  let component = setting.getCurrentComponent()
  console.log(component)
})
</script>

<style scoped lang="scss">
.setting {
  margin: 0px 10px;
  width: 100%;
}
</style>
