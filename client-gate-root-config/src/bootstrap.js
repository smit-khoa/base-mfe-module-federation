import { createApp } from "vue";
import App from "./AppContainer.vue";
import "./static/global.css";
import "shared/styles";
import router from "./router";
import { Button, Dropdown } from "shared/common";

const app = createApp(App);
app.component("Button", Button.Button);
app.component("Dropdown", Dropdown);
app.use(router);
app.mount("#app");
