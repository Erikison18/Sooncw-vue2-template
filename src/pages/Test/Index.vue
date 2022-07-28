<template>
  <div class="contaner padding">
    <User />
    <UI class="margin-large" />
    <Layout class="margin-large" />
    <Flex class="margin-large" />
    <Auth class="margin-large" />
    <Http class="margin-large" />
    <Message class="margin-large" />
    <Colors class="margin-large" />
  </div>
</template>

<script>
export default {
  components: {
    User: () => import("./components/User"),
    UI: () => import("./components/UI"),
    Layout: () => import("./components/Layout"),
    Auth: () => import("./components/Auth"),
    Http: () => import("./components/Http"),
    Message: () => import("./components/Message"),
    Flex: () => import("./components/Flex"),
    Colors: () => import("./components/Colors")
  }
};
</script>

<style>
.contaner {
  margin: 0 auto;
  max-width: 1200px;
}
</style>
