// import qs from "qs";
import axios from "axios";
import config from "./config";

// Axios 配置
axios.defaults.baseURL = config.api
axios.defaults.timeout = config.timeout; // 超时时间
axios.defaults.withCredentials = false; // 携带客户端验证身份，出现跨域时，请尝试设置为 false
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

// 请求拦截器
import request from './request';
axios.interceptors.request.use(...request);

// 响应拦截器
import response from './response';
axios.interceptors.response.use(...response);

/**
 * 发送请求
 * @param {*} config
 */
const _request = function (config) {
  return axios(config);
};

// 封装 GET 方法
export const get = function (url, params = {}, options = {}) {
  return _request({
    method: "GET",
    url,
    params,
    ...options
  });
};

// 封装 POST 方法
export const post = function (url, data = {}, options = {}) {
  return _request({
    method: "POST",
    url,
    data,
    ...options
  });
};

// 封装 PUT 方法
export const put = function (url, data = {}, options = {}) {
  return _request({
    method: "PUT",
    url,
    data,
    ...options
  });
};

// 封装 PATCH 方法
export const patch = function (url, data = {}, options = {}) {
  return _request({
    method: "PATCH",
    url,
    data,
    ...options
  });
};

// 封装 DELETE 方法
export const del = function (url, data = {}, options = {}) {
  return _request({
    method: "DELETE",
    url,
    data,
    ...options
  });
};
