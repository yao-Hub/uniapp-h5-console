import { createApp, reactive, h, watch, ref } from "vue";
import ConsoleBox from './view/index.vue'

const appConsole = {
  install(app) {
    const states = reactive({
      consoleData: []
    });
    app.config.globalProperties.$console = {
      log: (...msg) => {
        console.log(...msg);
        states.consoleData.push({ type: 'log', msg });
      },
      warn: (...msg) => {
        console.warn(...msg);
        states.consoleData.push({ type: 'warn', msg });
      },
      error: (...msg) => {
        console.error(...msg);
        states.consoleData.push({ type: 'error', msg });
      },
    };

    const new_app = document.createElement('div');
    new_app.id = 'console_box_app'
    document.body.appendChild(new_app);
    const appInstance = createApp({
      render: () => h(ConsoleBox, { consoleData: states.consoleData }),
    });
    appInstance.mount('#console_box_app');

    watch(states.consoleData, (newVal) => {
      const consoleDataRef = appInstance._instance.appContext.provides.consoleDataRef || ref([]);
      consoleDataRef.value = newVal;
    });
  }
};

export default appConsole;