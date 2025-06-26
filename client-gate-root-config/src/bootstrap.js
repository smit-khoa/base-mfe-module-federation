import { createApp } from "vue";
import App from "./AppContainer.vue";
import "./static/global.css";
import "./styles/tailwind.css";
import "smit_gate_shared_dependency/styles";
import router from "./router";
import { SvgSprite } from "vue-svg-sprite";
import { svgSpritePlugin } from "vue-svg-sprite";
import * as components from "smit_gate_shared_dependency/components/custom";
// import sprites from "./assets/sprites/sprites.svg";

// import spritess from "smit_gate_shared_dependency/sprites";
// console.log("sprites", spritess);

const app = createApp(App);

app.use(router);
// Sử dụng URL đầy đủ cho sprites
// app.use(svgSpritePlugin, { url: spritess });

// app.component("Icon", SvgSprite);
Object.keys(components).forEach((key) => {
  app.component(key, components[key]);
});

app.mount("#app");
