// 权限处理
import configApp from '@/config/app';

// 缓存前缀
const {
  cachePrefix
} = configApp;

// 用户缓存标识
const CACHE_KEY_USER = `${cachePrefix}_user`;

// 用户登录有效 token 表述
const CACHE_KEY_TOKEN = `${cachePrefix}_token`;

////////////////////////////////////////////////////////////////////

// 清除敏感登录信息
export const clearAuth = () => {
  const _regexp = new RegExp(`^[${cachePrefix}]+`);
  const _system = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (_regexp.test(key)) {
      _system.push(key);
    }
  }
  _system.forEach(key => {
    localStorage.removeItem(key);
  })
};

////////////////////////////////////////////////////////////////////

// 获取登录的用户信息
export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY_USER));
  } catch (error) {
    return null;
  }
};

// 存储登录的用户信息
export const setAuthUser = async user => {
  try {
    if (user.toString() !== '[object Object]') return;

    // 缓存 Token
    localStorage.setItem(CACHE_KEY_TOKEN, user.token);

    ////////////////////////////////////////////////////////////////////

    // 缓存用户基础数据
    const _user = {
      ...user
    };

    try {
      // delete _user.resources;
      delete _user.tokenInfo;
    } catch (error) {
      console.error(error);
    }

    localStorage.setItem(CACHE_KEY_USER, JSON.stringify(_user));

    ////////////////////////////////////////////////////////////////////

    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 清除登录的用户信息
export const clearAuthUser = () => {
  try {
    localStorage.removeItem(CACHE_KEY_TOKEN);
    localStorage.removeItem(CACHE_KEY_USER);
    return true;
  } catch (error) {
    return false;
  }
};

////////////////////////////////////////////////////////////////////

// 获取 token 信息
export const getAuthToken = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY_TOKEN));
  } catch (error) {
    return null;
  }
};

export const getAuthAccessToken = () => {
  try {
    return localStorage.getItem(CACHE_KEY_TOKEN);
  } catch (error) {
    return null;
  }
};
