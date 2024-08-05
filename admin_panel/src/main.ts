import { createApp } from 'vue'
import App from '@/App.vue'
import router from "@/router/router";
import vuetifyThemesAndComponents from "@/vuetify";

const app = createApp(App);
app.use(router);
app.use(vuetifyThemesAndComponents);
app.mount("#app");
