<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    document.title = "颂车前端应用开发模板";
  }
};
</script>

<style lang="scss">
@import "./styles/index.scss";
</style>
