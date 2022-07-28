import http from '@/http';
import { trimValue } from '@/utils/tools';

// 角色管理

// 获取指定客户端的所有角色
export const GetRolesOfClient = async clientId => {
  const res = await http.get(`/api/manage/client/${clientId}/roles`);
  if (!res || !res.data) return [];
  return res.data;
};

// 分页查询指定管理端的角色
export const GetRolesOfPage = async (clientId, query) => {
  const res = await http.post(
    `/api/manage/client/${clientId}/roles/page`,
    {},
    {
      params: {
        pageNumber: query.pageNumber || http.paging.pageNumber,
        pageSize: query.pageSize || http.paging.pageSize
      }
    }
  );
  if (!res || !res.data) return { records: [], total: 0 };
  return res.data;
};

// 新增角色入参
export const CreateRoleParams = {
  clientId: null,
  description: null,
  extra: {},
  identifier: null,
  status: 'Y',
  title: null
};

// 新增角色入参校验
export const CreateRoleValidate = async data => {
  if (!data) throw '请完善角色信息';

  data.clientId = trimValue(data.clientId);
  if (!data.clientId) throw '无效的客户端标识';

  data.title = trimValue(data.title);
  if (!data.title) throw '请填写角色名称';

  data.identifier = trimValue(data.identifier);
  if (!data.identifier) throw '请填写角色标识';

  return data;
};

// 新增角色
export const CreateRole = async (data = {}) => {
  const _params = {
    ...CreateRoleParams,
    ...data
  };
  await http.post('/api/manage/client/roles', _params);
};

// 更新角色入参
export const UpdateRoleParams = {
  clientId: null,
  description: null,
  extra: {},
  identifier: null,
  status: 'Y',
  title: null
};

// 更新角色入参校验
export const UpdateRoleValidate = async data => {
  if (!data) throw '请完善角色信息';

  data.title = trimValue(data.title);
  if (!data.title) throw '请填写角色标题';

  data.identifier = trimValue(data.identifier);
  if (!data.identifier) throw '请填写角色标识';

  return data;
};

// 更新角色
export const UpdateRole = async (id, data = {}) => {
  const _params = {
    ...UpdateRoleParams,
    ...data
  };
  await http.patch(`/api/manage/client/roles/${id}`, _params);
};

// 获取角色详情
export const GetRoleDetail = async id => {
  const res = await http.get(`/api/manage/client/roles/${id}`);
  return res.data;
};

// 删除角色
export const DeleteRole = async id => {
  await http.delete(`/api/manage/client/roles/${id}`);
};

// 获取角色对应的权限资源
export const GetRoleAuths = async roleId => {
  const res = await http.get(`/api/manage/client/roles/${roleId}/relation`);
  if (!res || !res.data) return [];
  return res.data;
};

// 配置角色的权限资源
export const UpdateRoleAuth = async (roleId, auths = []) => {
  await http.patch(`/api/manage/client/roles/${roleId}/relation`, {
    relationIds: auths
  });
};
