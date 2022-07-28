// HTTP 请求
import axios from 'axios';
import HttpConfig from '@/config/http';
import '@/http/interceptor/request.js'; // 导入axios请求监听器
import '@/http/interceptor/response.js'; // 导入axios请求回调监听器
import { trimValue } from '@/utils/tools';

// Axios 配置
axios.defaults.baseURL = HttpConfig.api;
axios.defaults.timeout = HttpConfig.timeout; // 超时时间
axios.defaults.withCredentials = true; // 携带客户端验证身份
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.platform = HttpConfig.auth.platform;

/**
 * URL 参数混入
 * @param {String} url URL
 * @param {Object} params 参数
 * @param {boolean} remove 匹配成功时，是否从参数中移除
 */
function _mixin(url, params, remove = true) {
  if (Array.isArray(params)) {
    return url;
  }
  for (const key in params) {
    const reg = new RegExp(`{${key}}`, 'g');
    if (reg.test(url)) {
      url = url.replace(reg, params[key]);
      if (remove) {
        delete params[key];
      }
    }
  }
  return url;
}

function _filtersData(params) {
  // 全局去除请求参数第一层级的左右空格
  if (Object.prototype.toString.call(params) === '[object Object]') {
    for (const key in params) {
      params[key] = trimValue(params[key]);
    }
  }
}

// 分页查询使用的分页参数和默认值
export const paging = {
  pageNumber: 1,
  pageSize: 10
};

/**
 * 发送请求
 * @param {*} config
 */
const request = function (config) {
  if (config.url) {
    if (config.data && config.data instanceof Object) {
      config.url = _mixin(config.url, config.data);
    }
    if (config.params && config.params instanceof Object) {
      config.url = _mixin(config.url, config.params);
    }
  }

  _filtersData(config.data);

  return axios(config);
};

// 封装 GET 方法
export const get = function (url, params = {}, options = {}) {
  return request({
    method: 'GET',
    url,
    params,
    options
  });
};

// 封装 POST 方法
export const post = function (url, data = {}, options = {}) {
  return request({
    method: 'POST',
    url,
    data,
    ...options
  });
};

// 封装 PUT 方法
export const put = function (url, data = {}, options = {}) {
  return request({
    method: 'PUT',
    url,
    data,
    ...options
  });
};

// 封装 PATCH 方法
export const patch = function (url, data = {}, options = {}) {
  return request({
    method: 'PATCH',
    url,
    data,
    ...options
  });
};

// 封装 DELETE 方法
export const del = function (url, data = {}, options = {}) {
  return request({
    method: 'DELETE',
    url,
    data,
    ...options
  });
};

export default {
  paging,
  get,
  post,
  put,
  patch,
  axios,
  request,
  delete: del,
  config: HttpConfig
};
