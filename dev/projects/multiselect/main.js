import { createApp } from "vue";
import VueFormGenerator from "../../../src";
import Multiselect from "vue-multiselect";

import App from "./app.vue";

const app = createApp(App);
app.use(VueFormGenerator);
app.component("multiselect", Multiselect);
app.mount("#app");
