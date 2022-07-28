import http from '@/http';

// 获取指定菜单权限的资源权限及该菜单下的子菜单（无限级）的资源
export const GetMenuChildrenResouces = async menuId => {
  const res = await http.get(
    `/api/manage/client/menus/${menuId}/sub/resources/ids`
  );
  if (!res || !res.data) return [];
  return res.data;
};

// 获取指定菜单的资源权限
export const GetResourcesOfMenu = async menuId => {
  const res = await http.get(`/api/manage/client/menus/${menuId}/resources`);
  if (!res || !res.data) return [];
  return res.data;
};

// 清空指定菜单下的所有权限资源
export const DeleteResourceOfMenu = async menuId => {
  await http.delete(`/api/manage/client/menus/${menuId}/resources`);
};

// 新增资源权限入参
export const CreateResourceParams = {
  description: null,
  identifier: null,
  menuId: null,
  method: 'GET',
  title: null,
  url: null
};

// 新增资源权限校验
export const CreateResourceValidate = async data => {
  if (!data) throw '请完善资源信息';
  return data;
};

// 新增资源权限
export const CreateResource = async (data = {}) => {
  const _params = {
    ...CreateResourceParams,
    ...data
  };
  await CreateResourceValidate(_params);
  await http.post('/api/manage/client/menus/resources', _params);
};

// 更新资源权限入参
export const UpdateResourceParams = {
  description: null,
  identifier: null,
  method: 'GET',
  title: null,
  url: null
};

// 更新资源权限校验
export const UpdateResourceValidate = async data => {
  if (!data) throw '请完善资源信息';
  return data;
};

// 更新资源权限
export const UpdateResource = async (id, data = {}) => {
  const _params = {
    ...UpdateResourceParams,
    ...data
  };
  await UpdateResourceValidate(_params);
  await http.patch(`/api/manage/client/menus/resources/${id}`, _params);
};

// 删除指定的权限资源
export const DeleteResource = async id => {
  await http.delete(`/api/manage/client/menus/resources/${id}`);
};
