<!--
@description: TODO 属性设置器
@author: liudingbang
@date: 2025/9/4 09:16
-->

<template>
  <div class="title">属性设置</div>
  <div
    class="collapse"
    v-if="getActiveComponent().value && Object.keys(getActiveComponent().value!).length > 0"
  >
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(group, groupIdx) in getAllSettingGroupByComponentItem(getActiveComponent().value!)"
        v-bind="group"
        :key="groupIdx"
      >
        <template
          v-for="(setting, settingIdx) in group.settings"
          :key="groupIdx + '-' + settingIdx"
        >
          <el-tag>{{ setting.name }}</el-tag>
          <el-tag v-if="setting.tip" type="danger">{{ setting?.tip }}</el-tag>
          <Component :is="setting.is" v-bind="setting" />
        </template>
      </el-collapse-item>
    </el-collapse>
    <div v-if="isNoSetting" class="select-tip">请先配置设置器...</div>
  </div>
  <div v-else class="select-tip">请先选择组件...</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useActiveComponentStore, { type ActiveComponent } from '@/store/useActiveComponentStore.ts'
import type { SettingPlugin, SettingPluginGroup } from '@/types/draw/setting.ts'
import { initAllSetting, mergeSettingPluginGroup } from '@/pages/draw/setting/setting-config.ts'

const activeNames = ref<Array<string>>([])

let { getActiveComponent } = useActiveComponentStore()

/**
 * 获取所有设计器组级设计器信息
 * @param currentComponent 当前活跃组件
 */
function getAllSettingGroupByComponentItem(
  currentComponent: ActiveComponent,
): Array<SettingPluginGroup> {
  let settings: Array<SettingPlugin> = initAllSetting(currentComponent?.settings ?? [])
  return mergeSettingPluginGroup(currentComponent?.groups ?? [], settings)
}

const isNoSetting = computed(() => {
  let component = getActiveComponent().value
  return (
    !component?.groups ||
    component?.groups.length === 0 ||
    !component?.settings ||
    component?.settings?.length === 0
  )
})
</script>

<style scoped lang="scss">
.title {
  width: 100%;
  font-weight: bold;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collapse {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}

.select-tip {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.87);
}

.el-tag {
  margin: 5px;
}
</style>
