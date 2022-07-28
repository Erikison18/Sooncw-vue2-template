const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 是否为正式环境
const ENV_IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  // 部署应用时的基本 URL
  publicPath: '/',

  // build时构建文件的目录 构建时传入 --no-clean 可关闭该行为
  outputDir: 'dist',

  // build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: '',

  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  indexPath: 'index.html',

  // 保存修改时执行语法检查
  lintOnSave: true,

  // 默认在生成的静态资源文件名中包含 hash 以控制缓存
  filenameHashing: true,

  // 构建多页面应用，页面的配置
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },

  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,

  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性（注：仅影响构建时注入的标签）
  crossorigin: '',

  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  integrity: true,

  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中
  // 如果你需要基于环境有条件地配置行为，或者想要直接修改配置，那就换成一个函数
  // (该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象
  configureWebpack: {
    // 单独引用依赖包，减小 vendor.js 的大小，格式：{ 包名: 页面引用}
    externals: {
      // 'vue': 'Vue',
    },
    plugins: [
      // 统计构建组成，默认可以通过 http://localhost:8888/ 访问
      // 详细用法<https://www.npmjs.com/package/webpack-bundle-analyzer>
      new BundleAnalyzerPlugin({
        analyzerMode: ENV_IS_PRODUCTION ? 'disabled' : 'server',
      }),
    ]
  },

  // 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作)
  chainWebpack: (cfg) => {
    const config = cfg;
    // 资源引用别名定义
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_v', resolve('src/views'))
      .set('_c', resolve('src/components'));

    return config;
  },

  // css的处理
  css: {
    // 当为 true 时，css 文件名可省略 module 默认为 false
    requireModuleExtension: true,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中,当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS，默认生产环境下是 true，开发环境下是 false
    extract: false,
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
    sourceMap: false,
  },

  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    port: 8080, // 端口号
    host: '0.0.0.0',
    https: false,
    open: true,
  },

  // 是否为 Babel 或 TypeScript 使用 thread-loader，默认 require('os').cpus().length > 1
  parallel: ENV_IS_PRODUCTION ? false : require('os').cpus().length > 1,

  // 向 PWA(Progressive Web App，即 渐进式增强 WEB 应用) 插件传递选项
  pwa: {},

  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: []
};
