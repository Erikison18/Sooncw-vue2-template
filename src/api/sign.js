import http from '@/http';
import { getToken } from '@/utils/app';

// 登录和退出登录

// 获取登录验证码图片
export const GetCaptchaImage = captcha_no => {
  return `${http.config.api}/auth/support/captcha/${captcha_no}`;
};

// 登录入参
export const SignLoginParams = {
  grant_type: 'captcha_password', // password 仅密码登录 | captcha_password 密码+验证码
  client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
  client_secret: process.env.VUE_APP_AUTH_CLIENT_SECRET,
  username: null,
  password: null,
  captcha: null,
  captcha_no: null
};

// 登录入参校验
export const SignLoginValidate = async data => {
  if (!data) throw '请完善登录信息';
  if (!data.username) throw '请填写用户名';
  if (!data.password) throw '请填写密码';
  if (!data.captcha) throw '请填写验证码';
  return data;
};

// 登录
export const SignLogin = async data => {
  const _data = {
    ...SignLoginParams,
    ...data
  };

  await SignLoginValidate(_data);
  const res = await http.post('/oauth/token', null, {
    params: _data
  });
  return res;
};

// 获取认证账户信息，登录成功的账户信息
export const GetAuthUser = async () => {
  const res = await http.get('/api/auth/account');
  return res.data;
};

// 获取登录账户的权限菜单
export const GetAuthMenu = async () => {
  const res = await http.get('/api/auth/menus');
  const _data = res.data || [];
  // 移除无意义字段，避免占用过多的本地缓存资源
  return _data.map(row => {
    return {
      menuId: row.menuId,
      identifier: row.identifier,
      title: row.title,
      hierarchy: row.hierarchy,
      source: row
    };
  });
};

// 获取登录账户的权限资源
export const GetAuthResource = async () => {
  const res = await http.get('/api/auth/resources');
  const _data = res.data || [];
  // 移除无意义字段，避免占用过多的本地缓存资源
  return _data.map(row => {
    return {
      menuId: row.menuId,
      identifier: row.identifier,
      title: row.title,
      hierarchy: row.hierarchy,
      source: row
    };
  });
};

// 退出登录
export const SignLogout = async () => {
  const token = getToken();
  http.delete(`/api/auth/revoke?token=${token}`);
};
