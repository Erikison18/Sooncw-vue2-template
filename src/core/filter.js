// 过滤器
import utils from '@/utils';

export default {}.install = Vue => {

  // 注册工具函数为过滤器
  for (const f in utils) {
    console.log(f);
    Vue.filter(f, utils[f]);
  }

};
