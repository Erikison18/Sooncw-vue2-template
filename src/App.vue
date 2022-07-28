<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { clearCache } from '@/utils/app';

export default {
  name: 'App',
  watch: {
    $route() {
      this.updateTitle();
    }
  },
  methods: {
    // 更新页面标题
    updateTitle() {
      const { appConfig } = this;
      const _match = this.$route.matched;

      // 获取路由链路的标题
      const _titles = [..._match]
        .map(part => part.meta.title)
        .filter(set => set);

      document.title = [..._titles, appConfig.title].join(' - ');
    }
  },
  mounted() {
    // 监听 401 事件
    window.addEventListener(
      'AppLoginEvent',
      () => {
        // 清除缓存
        clearCache();
        // 转到登录页
        this.$message({
          type: 'error',
          message: '登录信息无效，请重新登录',
          duration: 1000 * 3,
          onClose() {
            window.location.href = `/login/?return=${encodeURIComponent(
              window.location.href
            )}`;
          }
        });
      },
      false
    );

    // 监听 403 事件
    window.addEventListener(
      'AppForbiddenEvent',
      e => {
        this.msg({
          mode: 'alert',
          type: 'warning',
          icon: true,
          title: '操作提示',
          content: e.data
        });
      },
      false
    );

    // 更新页面标题
    this.updateTitle();
  }
};
</script>

<style lang="scss">
@import "./styles/index.scss";
</style>
