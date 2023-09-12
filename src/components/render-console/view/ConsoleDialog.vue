<template>
  <view class="consoleDialog" @click.self="closeDialog" :style="{zIndex: zIndex}">
    <view class="main">
      <view class="opera">
        <text class="icon" v-html="prohibit" @click.stop="emit('clean')"></text>
      </view>
      <view class="content">
        <block v-for="(item, index) in props.consoleList" :key="index">
          <console-item
            :type="item.type"
            :info="item.msg">
          </console-item>
        </block>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { highestZIndex } from '../common/common';
import { prohibit } from '../common/icon';
import ConsoleItem from './ConsoleItem.vue';

const zIndex = ref();

onMounted(async () => {
  await nextTick();
  zIndex.value = highestZIndex();
});

const props = defineProps(['consoleList']);
const emit = defineEmits(['close', 'clean']);
const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
.consoleDialog {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.main {
  height: 60vh;
  background-color: #fff;
  overflow-y: scroll;
}
.opera {
  padding: 0 15rpx;
  height: 60rpx;
  background-color: rgba(239, 241, 242);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
}
.icon {
  cursor: pointer;
  font-size: 0;
}
.content {
  width: 100vw;
}
</style>