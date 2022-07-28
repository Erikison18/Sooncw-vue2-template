import config from "./config";

// 网络请求配置
export default {
  // 后端请求接口
  api: config.api,

  // 登录验证验证信息
  auth: {
    // 应用系统标识
    platform: config.basicAuthPlatform,
    // Basic Auth
    username: config.basicAuthUsername,
    password: config.basicAuthPassword,
  },

  // 请求超时时间
  timeout: 1000 * 20,

  // 响应成功时的自定义状态码
  successCode: 200,

  // 上传的请求头
  uploadHeaders: {
    token: null,
  },

  // 上传允许的图片类型
  uploadAcceptImages: 'images/*',
  uploadFormatImages: ["jpg", "jpeg", "png", "gif"],
};
