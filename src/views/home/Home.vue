<template>
  <div class="page padding">
    <StyledCard>
      <div class="flex main-center cros-center" style="height: calc(100vh - 120px)"></div>
    </StyledCard>
  </div>
</template>

<script>
import { getFirstRoleRoute } from '@/utils/auth';

export default {
  name: 'home',
  components: {
    StyledCard: () => import('_c/StyledCard')
  },
  created() {
    const _roleRoute = getFirstRoleRoute();
    if (_roleRoute) {
      this.$router.push({ name: _roleRoute.name });
    }
  }
};
</script>
