// HTTP 请求
import axios from 'axios';

// 响应拦截器
axios.interceptors.response.use(
  res => {
    const data = res.data;
    const { code, msg } = data;
    if (code && code !== 200) throw msg;
    return data;
  },
  error => {
    if (error.__CANCEL__) return true;

    if (/timeout/.test(error)) return Promise.reject('接口响应超时，请重试！');

    if (error && error.response) {
      // 401，认证过期，重新登录
      if (error.response.status === 401) {
        window.dispatchEvent(new Event('AppLoginEvent'));
        return Promise.reject(
          error.response.data.error_description ||
            error.response.data.message ||
            '登录信息无效，请重新登录'
        );
      }

      // 403，无操作权限
      if (error.response.status === 403) {
        const _message =
          error.response.data.msg ||
          error.response.data.message ||
          error.response.data.error_description ||
          '无操作权限';
        // token 过期
        if (_message.indexOf('token') !== 1) {
          window.dispatchEvent(new Event('AppLoginEvent'));
          return Promise.reject(
            error.response.data.error_description ||
              error.response.data.message ||
              '登录信息无效，请重新登录'
          );
        }
        const _event = new Event('AppForbiddenEvent');
        _event.data = _message;
        window.dispatchEvent(_event);
        return;
      }

      return Promise.reject(
        error.response.data.msg ||
          error.response.data.message ||
          error.response.data.error_description ||
          '请求出现错误'
      );
    }

    return Promise.reject(error.toString());
  }
);
