// 缓存操作
import appConfig from '@/config/app';

// 全局缓存前缀
const CAHCE_PREFIX = appConfig.cachePrefix;

// 缓存标识
export const CACHE_NAME = `${CAHCE_PREFIX}_tag_nav`;

// 读取缓存
export const getCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_NAME)) || [];
  } catch (error) {
    return [];
  }
};

// 设置缓存
export const setCache = data => {
  localStorage.setItem(CACHE_NAME, JSON.stringify(data));
};
