<template>
  <view class="test">
    <span>test1</span>
  </view>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const {proxy} = getCurrentInstance();
proxy.$console.log('ddd');
</script>

<style>
.test {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>