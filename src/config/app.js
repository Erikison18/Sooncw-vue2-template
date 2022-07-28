const env = process.env.NODE_ENV;

export default {
  // 系统名称
  title: '神鹰风控运营平台',
  titleEn: 'KDIoT Colud Platform',
  slogan: '神鹰风控运营平台',
  appSlogan: '神鹰风控运营平台',

  // 公司信息
  company: {
    name: '重庆颂车网络科技有限公司',
    nameShot: '颂车网',
    nameEn: 'Chongqing DingDang Data Network Technology Co., Ltd',
    nameEnShot: 'DingDang Data',
    phone: '400-6766-000',
    website: 'http://www.songcw.com/',
    address: '重庆市渝中区化龙桥华盛路 10 号企业天地 2 号楼 8 楼'
  },

  // 环境检测上下文，在组件中可使用 this.$config.isXXXX 使用
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  isSit: env === 'staging',
  isPre: env === 'pre',

  // localStorage 缓存标识
  cachePrefix: '__dingdang_bp_platform__',

  // 分页配置
  page: {
    size: 20, // 每页显示的数据条数
    sizeList: [10, 20, 50, 100], // 支持每页数据选择列表（用于表格页面）
    sizeInline: 10, // 页面内嵌模块列表中每页显示的数据条数（用于页面模块中的表格）
  },

};
