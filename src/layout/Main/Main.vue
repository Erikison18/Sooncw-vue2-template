<template>
  <div class="layout-main">
    <header class="flex cros-center main-space-between header">
      <Logo />
      <span class="message">中小型应用快速成型模板</span>
    </header>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Logo: () => import("./components/Logo")
  }
};
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
