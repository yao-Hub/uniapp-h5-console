<template>
  <view class="app">
    <image class="logo" src="/static/logo.png" @click="goTest"></image>
  </view>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const {proxy} = getCurrentInstance();
const arr = [{a: 1}, {a: 2}, {a: 3}];
const obj = {a: 1, b: 2};
proxy.$console.log('arr', arr, obj, 111, false, NaN, undefined, null, () => {});
proxy.$console.warn('arr');
proxy.$console.error('arr');
proxy.$console.error(a);


const goTest = () => {
  uni.navigateTo({
    url: '/pages/test_1/index'
  });
};
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}
</style>
