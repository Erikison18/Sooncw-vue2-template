import Vue from "vue";
import VueRouter from "vue-router";
import { getUser } from '@/utils/app';
import * as auth from '@/utils/auth';
import routes from './routes';

Vue.use(VueRouter);

export const routes_default = [
  // 主页
  // 默认情况下，页面会跳转到 { name: 'home' } 路由，
  // 如果为登录，则跳转到 { name: 'login' } 路由
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home"*/ "_v/Home.vue")
  },

  /**
   * 登录页
   * 登录页不使用 layout 布局，所以单独为一个路由
   */
   {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName:"routes" */ '@/views/login/Login')
  },

  // 404
  {
    path: "*",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "NotFound"*/ "_v/NotFound.vue")
  }
];

export const createRouter = params_routes =>
  new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [...params_routes]
  });

const router = createRouter(routes_default);

window.router = router;

// 添加动态路由
router.$addRoutes = (params = []) => {
  const newRoute = createRouter(routes_default);
  router.matcher = newRoute.matcher;
  router.options.routes = newRoute.options.routes;
  router.options.routes.push(...params);
  params.forEach(_route => {
    router.addRoute(_route);
  });
};

// 获取第一个有效的权限路由
// 有效：① 左侧菜单；② 如果存在重定向，则重定向也必须存在；
// 如果没有符合条件的路由，则显示一个空白页；
const _getFirstRoleRoute = routesData => {
  if (!routesData || !routesData.length) return null;

  // 按层级把路由展开为一维数组
  const _flat = [];
  const _top = [];

  const _expand = (data, level = 0) => {
    data.forEach(item => {
      _flat.push(item);

      if (level === 0) {
        _top.push(item);
      }

      if (item.children) {
        _expand(item.children, level + 1);
      }
    });
  };

  _expand(routesData);

  const _routes = _top.filter(item => {
    if (item.meta.redirect && item.meta.redirect.name) {
      return !!_flat.find(v => v.name === item.meta.redirect.name);
    }

    if (item.redirect && item.redirect.name) {
      return !!_flat.find(v => v.name === item.redirect.name);
    }

    return true;
  });

  if (!_routes.length) return null;

  return _routes[0];
};

// 初始化动态路由
export const initDynamicAuthRoute = () => {
  try {
    // 获取缓存路由并根据用户权限进行递归处理
    // 无需指定权限类型，因为这里只处理菜单
    const _authRoutes = auth.parseRoleRoutes(routes);

    // 更新到路由配置
    if (_authRoutes.length) {
      // 缓存第一个有效的路由为默认路由
      const _firstRoleRoute = _getFirstRoleRoute(_authRoutes);
      auth.setFirstRoleRoute(_firstRoleRoute);

      // 添加动态路由
      router.$addRoutes(_authRoutes);
    }
  } catch (error) {
    console.error(error);
  }
};

// 初始化动态路由
initDynamicAuthRoute();

router.beforeEach((to, from, next) => {
  // 获取登录用户
  const _user = getUser();
  if (to.name === 'login') {
    if (_user) {
      next('/');
    } else {
      next();
    }
  } else {
    if (_user) {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
