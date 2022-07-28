<template>
  <div class="nav">
    <NavItem
      v-for="(item, index) in menus"
      :key="index"
      :item="item"
      :collapse="collapse"
    />
  </div>
</template>

<script>
import { getRoleRoutes } from '@/utils/auth';

export default {
  name: 'Nav',
  components: {
    NavItem: () => import('./NavItem')
  },
  props: {
    // 是否水平折叠收起菜单
    collapse: Boolean
  },
  computed: {
    // 渲染的菜单
    menus() {
      const addDynamicRoute = getRoleRoutes();
      const showNavRoute = [...addDynamicRoute];
      return this.eachRoutes(showNavRoute);
    }
  },
  methods: {
    findParentRoute(routeName) {
      for (let item of this.$router.options.routes) {
        if (item.name === routeName) {
          return item;
        }
      }
    },
    // 遍历路由配置，筛选可显示的菜单
    eachRoutes(routes) {
      let _res = [];

      routes.forEach(route => {
        // 获取当前条目配置信息
        const { meta } = route;

        if (meta && meta.title !== '' && meta.hidden !== true) {
          // 构建条目
          const item = {
            title: meta.title,
            icon: meta.icon || '',
            name: route.name,
            to: { name: route.name }
          };

          // 是否存在子菜单
          if (Array.isArray(route.children)) {
            const _child = this.eachRoutes(route.children);
            if (_child.length) {
              item['child'] = _child;
            }
          }

          _res.push(item);
        }
      });

      return _res;
    },

    // 菜单选择
    handleOpen(key, path) {
      console.log(key, path);
    }
  }
};
</script>

<style lang="scss">
@import '../../../styles/const.scss';
.nav {
  padding: $void;
  position: relative;
}
</style>
