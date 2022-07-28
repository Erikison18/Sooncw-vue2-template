const env = process.env.NODE_ENV;

export default {
  // 环境检测上下文，在组件中可使用 this.$config.isXXXX 使用
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  isSit: env === 'staging',
  isPre: env === 'pre',

  // localStorage 缓存标识
  cachePrefix: '__sc_app',

  // 分页配置
  page: {
    size: 20, // 每页显示的数据条数
    sizeList: [10, 20, 50, 100], // 支持每页数据选择列表（用于表格页面）
    sizeInline: 10, // 页面内嵌模块列表中每页显示的数据条数（用于页面模块中的表格）
  },

};
