import { clearCache } from '@/utils/app';

// 权限错误，清除缓存，跳转到登录页
export default function _needRelogin() {
  // 清除缓存
  clearCache();
  // 转到登录页
  setTimeout(() => {
    window.location.href = `/login/?return=${encodeURIComponent(
      window.location.href
    )}`;
  }, 1000);
}
