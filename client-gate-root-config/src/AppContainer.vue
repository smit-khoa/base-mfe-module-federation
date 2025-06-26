<template>
  <div class="gate">
    <div class="sidebar">
      <Sidebar />
    </div>
    <div class="content">
      <Header :title="routeTitle" />
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";

// import { DropdownMenu } from "smit_gate_shared_dependency/components/ui";
// console.log("DropdownMenu", DropdownMenu);

import { onMounted } from "vue";

// Lấy route hiện tại
const route = useRoute();

// Computed property để lấy title từ route meta
const routeTitle = computed(() => {
  return (route.meta?.title as string) || "Default Title";
});

onMounted(() => {
  console.log("onMounted sdfsdfsfd");
});
</script>

<style lang="scss">
.gate {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;

  .content {
    flex: 1;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
}
</style>
