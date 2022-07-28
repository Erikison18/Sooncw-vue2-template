<template>
  <div class="contaner">
    <Welcome />
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {
    Welcome: () => import("_c/Welcome")
  }
};
</script>
