import { createApp } from "vue";
import VueFormGenerator from "../../../src";

import App from "./app.vue";

const app = createApp(App);
app.use(VueFormGenerator);
app.mount("#app");
