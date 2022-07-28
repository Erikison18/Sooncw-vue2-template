import http from '@/http';
import { trimValue } from '@/utils/tools';

// 操作员管理

// 分页查询操作员支持的查询参数
export const GetOperatorsParams = {
  client: 'manage', // 管理端仅操作管理端的用户
  mobile: null,
  nickName: null,
  status: null,
  userId: null,
  username: null
};

// 分页获取操作员列表
export const GetOperators = async (params = {}, query) => {
  const _params = {};
  Object.keys(GetOperatorsParams).forEach(key => {
    if (params[key] !== '' && params[key] !== null) {
      _params[key] = params[key];
    }
  });
  const res = await http.post('/api/manage/accounts/page', _params, {
    params: {
      pageNumber: query.pageNumber || http.paging.pageNumber,
      pageSize: query.pageSize || http.paging.pageSize
    }
  });
  if (!res || !res.data) return { records: [], total: 0 };
  return res.data;
};

// 根据 ID 获取操作员详情
export const GetOperatorDetail = async userId => {
  if (!userId) throw '用户不存在';
  const res = await http.get(`/api/manage/accounts/user/${userId}`);
  if (!res || !res.data) throw '用户不存在';
  return res.data;
};

// 启用或禁用操作员
export const ToggleOperatorStatus = async (id, status) => {
  await http.patch(`/api/manage/accounts/${id}/validity`, { status });
};

// 新增操作员使用的参数
export const CreateOperatorParams = {
  client: 'manage', // 管理端仅操作管理端的用户
  mobile: null,
  nickName: null,
  password: null,
  status: 'Y',
  username: null
};

// 新增操作员参数验证
export const CreateOperatorValidate = async data => {
  if (!data) throw '请完善操作员信息';

  data.username = trimValue(data.username);
  if (!data.username) throw '请填写登录账号';

  data.nickName = trimValue(data.nickName);
  if (!data.nickName) throw '请填写操作员名称';

  data.password = trimValue(data.password);
  if (!data.password) throw '请填写登录密码';

  data.mobile = trimValue(data.mobile);
  if (!data.mobile) throw '请填写手机号码';
  if (!/^1[3456789]\d{9}$/.test(data.mobile)) throw '请填写正确的手机号';

  return data;
};

// 新增操作员
export const CreateOperator = async (data = {}) => {
  const _params = {
    ...CreateOperatorParams,
    ...data
  };
  await CreateOperatorValidate(_params);
  const res = await http.post('/api/manage/accounts', _params);
  return res.data;
};

// 更新操作员参数
export const UpdateOperatorParams = {
  accountLocked: 'N',
  mobile: null,
  nickName: null,
  password: null,
  status: 'Y'
};

// 新增操作员参数验证
export const UpdateOperatorValidate = async data => {
  if (!data) throw '请完善操作员信息';

  data.nickName = trimValue(data.nickName);
  if (!data.nickName) throw '请填写操作员名称';

  data.mobile = trimValue(data.mobile);
  if (!data.mobile) throw '请填写手机号码';
  if (!/^1[3456789]\d{9}$/.test(data.mobile)) throw '请填写正确的手机号';

  return data;
};

// 更新操作员
export const UpdateOperator = async (id, data = {}) => {
  const _params = {
    ...UpdateOperatorParams,
    ...data
  };
  await UpdateOperatorValidate(_params);
  await http.patch(`/api/manage/accounts/${id}`, _params);
};

// 获取当前用户对应客户端的角色
export const GetOperatorRoles = async (clientId, userId) => {
  const res = await http.get(
    `/api/manage/accounts/user/${userId}/clients/${clientId}/roleIds`
  );
  if (!res || !res.data) return [];
  return res.data;
};

// 设置当前用户对应客户端的角色
export const SetOperatorRoles = async (clientId, userId, roles) => {
  await http.patch(
    `/api/manage/accounts/user/${userId}/clients/${clientId}/roles`,
    {
      rolesIds: roles
    }
  );
};

// 获取门店列表
export const GetStores = async () => {
  const res = await http.post('/api/manage/store/list');
  if (!res || !res.data) return [];
  return res.data;
};

// 查询操作员门店对应关系
export const GetOperatorStores = async userId => {
  const res = await http.get(`/api/manage/store/user/${userId}`);
  if (!res || !res.data) return [];
  return res.data;
};

// 设置操作员门店对应关系
export const SetOperatorStores = async (userId, stores) => {
  await http.patch('/api/manage/store/user', {
    storeNoList: stores || [],
    userId
  });
};
