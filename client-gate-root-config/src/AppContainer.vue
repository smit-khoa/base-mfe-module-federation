<template>
  <div class="app">
    <div>
      <h3>Navigation dksfhskdfhksjhs</h3>
      <router-link to="/">Home</router-link> |
      <router-link to="/1">App 1</router-link> |
      <router-link to="/2">App 2</router-link>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app > div:first-child {
  padding: 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.app > div:first-child a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
}

.app > div:first-child a:hover {
  text-decoration: underline;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
