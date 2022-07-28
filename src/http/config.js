// 网络请求配置
export default {
  // 后端请求接口，此处的接口由根目录下的 .env 文件定义
  api: process.env.VUE_APP_API_BASE,

  // 登录验证验证信息
  // 具体配置值咨询后端
  auth: {
    platform: '',
    username: process.env.VUE_APP_API_BASIC_AUTH_CLIENT_ID,
    password: process.env.VUE_APP_API_BASIC_AUTH_CLIENT_SECRET,
  },

  // 指定请求超时的毫秒数(0 表示无超时时间)
  timeout: 1000 * 60 * 10,

  // 响应成功时的自定义状态码
  successCode: '0000',
};
