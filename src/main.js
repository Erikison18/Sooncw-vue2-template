import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";

// ElementUI
import ElementUI from "element-ui";
Vue.use(ElementUI);

// 表格导出
import SCExcelExport from "sc-excel-export";
Vue.use(SCExcelExport);

// 系统配置
import config from "@/config/app";
Vue.prototype.$config = config;

// 水印
import watermark from "@/directives/watermark";
Vue.directive("watermark", watermark);

// 权限管理插件
import auth from "@/plugins/auth";
Vue.use(auth, {
  cachePrefix: config.cachePrefix
});

// 过滤器
import filter from "@/core/filter";
Vue.use(filter);

// 全局混入
import mixins from "@/core/mixins";
Vue.mixin(mixins);

// Vue 配置
Vue.config.productionTip = config.isProduction ? false : true;

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
