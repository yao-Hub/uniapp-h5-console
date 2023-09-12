# 介绍说明

- 此插件用于uniapp h5端 真机调试打印
- 此插件为轻量调试工具，支持输出打印日志和捕获输出错误信息
- 测试版本

## 插件使用方法

- 在main.js导入
- 在具体需要打印的地方调用全局变量$console
- 具体使用方法可下载实例插件

## 示例运行

```bash
npm install
```

## 实例

```vue
<!-- main.js -->

import { createSSRApp } from "vue";
import App from "./App.vue";
import appConsole from './plugin/render-console/index';

export function createApp() {
 const app = createSSRApp(App);
  app.use(appConsole);
 return {
  app,
 };
}

<!-- 具体组件.vue -->
<script setup>
import { getCurrentInstance } from 'vue';
const {proxy} = getCurrentInstance();
proxy.$console.log('xxx');
proxy.$console.warn('xxx');
proxy.$console.error('xxx');
</script>

<!-- 全局捕获错误 APP.vue -->
<script>
import { getCurrentInstance } from 'vue';

export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  onError: function (e) {
    const {
      appContext: {
        config: {
          globalProperties: global
        }
      }
    } = getCurrentInstance();
    global.$console.error(e);
  },
}
</script>
```
