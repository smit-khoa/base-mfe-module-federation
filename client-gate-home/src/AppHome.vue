<template>
  <div class="home flex flex-col items-center justify-center">
    <h1>home</h1>
    <button @click="navigateTo('/1')">Go to App 1</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  methods: {
    navigateTo(path) {
      // this.$router.push(path);
      location.href = path;
    },
  },
});
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
}
</style>
