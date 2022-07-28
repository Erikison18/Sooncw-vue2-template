import axios from 'axios';
import { getToken } from '@/utils/app';
import _needRelogin from '@/http/interceptor/common/needRelogin';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 除指定接口外，其他接口需要携带有效的 token 信息
    if (!['/oauth/token'].includes(config.url)) {
      const accessToken = getToken();
      config.headers.Authorization = `Bearer ${accessToken}`;

      if (!accessToken) {
        _needRelogin();
        throw 'needRelogin';
      }
    }

    return config;
  },
  error => {
    if (error === 'needRelogin') {
      _needRelogin();
      return;
    }
    return Promise.reject(error);
  }
);
