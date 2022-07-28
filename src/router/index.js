import Vue from "vue";
import VueRouter from "vue-router";
import docRoutes from "./doc";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home"*/ "_v/Home.vue")
  },

  // 如果路由层级比较复杂，建议根据功能拆分到不同的目录
  ...docRoutes,

  {
    path: "*",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "NotFound"*/ "_v/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
