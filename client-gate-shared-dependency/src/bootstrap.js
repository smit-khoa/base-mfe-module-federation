import { createApp } from "vue"
import { svgSpritePlugin } from "vue-svg-sprite"
import App from "./App.vue"

import spritesUrl from "./assets/sprites/sprites.svg"
createApp().use(svgSpritePlugin, {
    url: spritesUrl,
    component: "SvgIcon"
})
// // import "@radix-ui/themes/styles.css";

createApp(App).mount("#app")
