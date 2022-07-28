import system from './system';
import test from './test';

// 聚合各个路由模块，暴露给 ./src/router/index.js 使用
const _routes = [
  system,
];

// 开发环境提供开发组件
if (process.env.NODE_ENV === 'development') {
  _routes.push(test);
}

export default _routes;
