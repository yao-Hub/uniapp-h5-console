<template>
  <view :class="['consoleItem', props.type]">
    <text class="icon" v-if="props.type === 'warn'" v-html="warn"></text>
    <text class="icon" v-else-if="props.type === 'error'" v-html="error"></text>
    <text class="icon" v-else></text>
    <view class="item">
      <block v-for="(item, index) in states.list" :key="index">
        <json-view v-if="(typeof item) === 'object'" :obj="item"></json-view>
        <text
          v-else
          :class="{
            blueText: ['number', 'boolean'].includes(typeof item),
            grayText: ['null', 'undefined'].includes(item),
          }">
          {{ item }}
        </text>
      </block>
    </view>
  </view>
</template>

<script setup>
import { reactive, toRaw } from 'vue';
import JsonView from './JsonView.vue';
import { warn, error } from '../common/icon';

const props = defineProps(['type', 'info']);
const states = reactive({
  list: []
});
toRaw(props.info).forEach(item => {
  if (item && item.stack) {
    states.list.push(item.stack);
  } else if ([undefined, null].includes(item)) {
    states.list.push(String(item));
  } else {
    states.list.push(item);
  }
});
</script>

<style scoped>
text {
  word-break: break-all;
}
.consoleItem {
  display: flex;
  border-bottom: 1px solid;
}
.item {
  font-size: 28rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  margin-top: 5rpx;
  width: calc(100vw - 50rpx);
}
.log {
  background-color: #fff;
  border-color: rgb(235, 238, 245);
}
.warn {
  background-color: rgba(220, 165, 80, 0.2);
  border-color: rgb(220, 165, 80);
}
.error {
  background-color: rgba(245, 108, 108, 0.2);;
  border-color: rgb(245, 108, 108);
  color: red;
}
.blueText {
  color: rgb(24, 31, 153);
}
.grayText {
  color: rgb(160, 164, 168);
}
.icon {
  font-size: 0;
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
}
</style>