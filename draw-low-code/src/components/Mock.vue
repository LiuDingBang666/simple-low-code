<template>
  <div style="height: 100%" :class="['main1']">
    <div
      style="
        min-width: 100px;
        min-height: 100px;
        padding: 10px;
        border: 1px solid black;
        display: inline-block;
        margin: 10px;
      "
      :class="['main2']"
    ></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main1 {
  background: red;
}
.main2 {
  background: yellow;
}
</style>
