import { createApp } from 'vue'
import App from './App.vue'
import vuetifyThemesAndComponents from "@/vuetify";

const app = createApp(App);
app.use(vuetifyThemesAndComponents);
app.mount("#app");
