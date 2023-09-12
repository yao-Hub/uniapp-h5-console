import { createSSRApp } from "vue";
import App from "./App.vue";
import appConsole from './components/render-console/index';

export function createApp() {
	const app = createSSRApp(App);
  app.use(appConsole);
	return {
		app,
	};
}
