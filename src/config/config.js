const env = process.env.NODE_ENV;

export default {
  // API 接口和阿里云 OSS
  api: process.env.VUE_APP_API_BASE,

  // 权限验证
  basicAuthClientId: process.env.VUE_APP_AUTH_CLIENT_ID,
  basicAuthClientSecret: process.env.VUE_APP_AUTH_CLIENT_SECRET,

  // 环境检测上下文，在组件中可使用 this.$config.isXXXX 使用
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  isPre: env === 'preview'
};
