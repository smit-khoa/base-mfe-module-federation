<template>
  <div :class="s.business">
    <h1>App Business</h1>
    <Table />
  </div>
</template>

<script setup lang="ts">
import { useCssModule } from "vue";

const s = useCssModule();
</script>

<style lang="scss" module>
.business {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;

  h1 {
    color: #333;
    margin-bottom: 16px;
  }
}
</style>
