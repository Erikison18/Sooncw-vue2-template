<template>
  <div class="contaner">
    <Welcome />
  </div>
</template>

<script>
import { getFirstRoleRoute } from '@/utils/auth';

export default {
  name: "Home",
  components: {
    Welcome: () => import("_c/Welcome")
  },
  created() {
    const _roleRoute = getFirstRoleRoute();
    if (_roleRoute) {
      this.$router.push({ name: _roleRoute.name });
    }
  }
};
</script>
