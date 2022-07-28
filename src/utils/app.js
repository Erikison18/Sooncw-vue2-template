import appConfig from '@/config/app';

// 应用操作

// 全局缓存前缀
const CAHCE_PREFIX = appConfig.cachePrefix;

// 每次登录失效都需要清除的缓存标识
const CACHE_AUTH = '_auth';

// 已登录用户缓存标识
const CACHE_KEY_USER = `${CAHCE_PREFIX}${CACHE_AUTH}_user`;

// 用户认证 Token，需要在 HTTP 请求头中传递给后端
const CACHE_KEY_TOKEN = `${CAHCE_PREFIX}${CACHE_AUTH}_token`;

// 全局 :: 清除缓存信息，只清除必要的缓存信息
export const clearCache = () => {
  try {
    removeUser();
    removeToken();

    // 需要删除的缓存前缀
    const _regx = new RegExp(`${CAHCE_PREFIX}`);

    // 遍历删除缓存
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (_regx.test(key)) {
        localStorage.removeItem(key);
      }
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////
// 用户

// 保存登录用户信息
export const setUser = user => {
  try {
    if (!user || Object.prototype.toString.call(user) !== '[object Object]')
      throw false;
    localStorage.setItem(CACHE_KEY_USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error(error);
  }
};

// 获取登录用户信息
export const getUser = () => {
  try {
    const _user = localStorage.getItem(CACHE_KEY_USER);
    if (!_user) return null;
    return JSON.parse(_user);
  } catch (error) {
    console.error(error);
  }
};

// 删除用户登录信息
export const removeUser = () => {
  try {
    localStorage.removeItem(CACHE_KEY_USER);
  } catch (error) {
    console.error(error);
  }
};

////////////////////////////////////////////////
// Token

// 设置 Token
export const setToken = token => {
  try {
    if (!token) return;
    localStorage.setItem(CACHE_KEY_TOKEN, token);
  } catch (error) {
    console.error(error);
  }
};

// 获取 Token
export const getToken = () => {
  try {
    return localStorage.getItem(CACHE_KEY_TOKEN);
  } catch (error) {
    console.error(error);
  }
};

// 删除 Token
export const removeToken = () => {
  try {
    localStorage.removeItem(CACHE_KEY_TOKEN);
  } catch (error) {
    console.error(error);
  }
};

/**
 * 递归
 * @param {*} list
 * @param {*} action
 * @param {*} options
 * @returns
 */
 export function eachChildren(list, action, options = { children: 'childList' }) {
  if (list == null || !Array.isArray(list) || list.length === 0) {
    return
  }
  if (action == null) {
    return
  }
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    action(item, list, i)
    eachChildren(item[options.children], action)
  }
}


// 移除空的childList(配合cascader使用)
export const removeEmptyChildList = (data) => {
  if (data == null || data.length == 0) {
    return;
  }
  for (const item of data) {
    if (item.childList == null) {
      continue;
    }
    if (item.childList.length == 0) {
      item.childList = null;
      continue;
    }
    removeEmptyChildList(item.childList);
  }
}