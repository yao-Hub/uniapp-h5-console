<template>
  <view>
    <!-- <view
      v-if="!ifDialogShow"
      class="consoleBtn"
      :style="boxStyle"
      @mousedown="boxMousedown"
      @mousemove="boxMousemove"
      @mouseup="boxMouseup"
      @click="toggleDialog">
      <text>console</text>
    </view> -->
    <view
      v-if="!ifDialogShow"
      class="consoleBtn"
			:style="boxStyle"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd">
      <text>console</text>
    </view>
    <console-dialog
      v-else
      :consoleList="states.list"
      @clean="cleanConsole"
      @close="toggleDialog"></console-dialog>
  </view>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, nextTick, toRaw } from 'vue';
import { highestZIndex } from '../common/common';
import ConsoleDialog from './ConsoleDialog.vue'

// function debounce(func, delay) {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func.apply(this, args);
//     }, delay);
//   };
// }

// const boxStyle = reactive({
//   position: 'absolute',
//   left: 0,
//   top: 0,
//   zIndex: 999,
//   'user-select': 'none',
//   // transform: 'translate(0, 0)'
// });

// const isDragging = ref(false);
// const offsetX = ref(0);
// const offsetY = ref(0);

// const boxMousedown = debounce((e) => {
//   isDragging.value = true;
//   offsetX.value = e.clientX - e.target.getBoundingClientRect().left;
//   offsetY.value = e.clientY - e.target.getBoundingClientRect().top;
// }, 10);

// const boxMousemove = (e) => {
//   if (isDragging.value) {
//     const x = e.clientX - offsetX.value;
//     const y = e.clientY - offsetY.value;
//     // boxStyle.transform = `translate(${x}px, ${y}px)`;
//     boxStyle.left = `${x}px`;
//     boxStyle.top = `${y}px`;
//   }
// };

// const boxMouseup = (e) => {
//   isDragging.value = false;
// };

// const ifDialogShow = ref(false);
// const toggleDialog = () => {
//   ifDialogShow.value = !ifDialogShow.value;
// };

// onMounted(async () => {
//   await nextTick();
//   boxStyle.zIndex = highestZIndex();
//   document.addEventListener('mousemove', boxMousemove);
//   document.addEventListener('mouseup', boxMouseup);
// });

// onUnmounted(() => {
//   document.removeEventListener('mousemove', boxMousemove);
//   document.removeEventListener('mouseup', boxMouseup);
// });

const boxStyle = reactive({
	position: 'absolute',
  left: 0,
  top: 0,
});
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const onTouchStart = (event) => {
  isDragging.value = false;
  startX.value = event.touches[0].clientX;
  startY.value = event.touches[0].clientY;
};
const onTouchMove = (event) => {
  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;
  const deltaX = currentX - startX.value;
  const deltaY = currentY - startY.value;
  boxStyle.left += deltaX;
  boxStyle.left += deltaY;
  startX.value = currentX;
  startY.value = currentY;
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
		isDragging.value = true;
  }
};
const onTouchEnd = () => {
	if (!isDragging.value) {
		// 如果没有移动，执行点击事件
		toggleDialog();
	}
};

const ifDialogShow = ref(false);
const toggleDialog = () => {
  ifDialogShow.value = !ifDialogShow.value;
};

const props = defineProps(['consoleData']);

const consoleDataRef = ref(props.consoleData);
const states = reactive({
  list: toRaw(consoleDataRef)
});

const cleanConsole = () => {
  states.list = [];
};
</script>

<style scoped>
.consoleBtn {
  border: 1px solid #DCDFE6;
  padding: 8rpx;
  color: #fff;
  border-radius:10rpx;
  background: #67C23A;
  cursor: pointer;
  z-index: 999;
}
</style>