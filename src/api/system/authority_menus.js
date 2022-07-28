import http from '@/http';
import { trimValue } from '@/utils/tools';

// 权限管理
// 当前系统存在2种权限：菜单、资源
// 菜单权限；用于控制路由层级和交互层级，对应前端的路由层级；
// 资源权限：用于控制接口调用，比如：查询、新增、删除、禁用
// 每个客户端都有一套独立的权限。
// 关系：一个客户端包含多个菜单权限，每个菜单权限可以嵌套多个菜单权限，每个菜单权限可以包含多个资源权限；
// 关系：客户端 > 菜单权限 > 资源权限

// 枚举 - 菜单层级
export const EnumMenuHierarchy = async () => {
  const res = await http.get('/base/auth/enums/menu-hierarchy');
  return res.data;
};

// 递归菜单权限为树结构
export const ReduceAuthMenus = (data = [], pid = '0') => {
  const _data = [];

  data.forEach((row, index) => {
    if (row.parentId === pid) {
      const _row = {
        ...row,
        label: row.title
      };

      // 查找子级
      const _copy = [...data];
      _copy.splice(index, 1);
      const _children = ReduceAuthMenus(_copy, row.menuId);
      if (_children.length) {
        _row.children = _children;
      } else {
        _row.hasChildren = false;
      }

      _data.push(_row);
    }
  });

  return _data;
};

// 获取指定客户端下的菜单权限列表
export const GetAuthMenusOfClient = async clientId => {
  const res = await http.get(`/api/manage/client/${clientId}/menus`);
  if (!res || !res.data) return [];
  return res.data;
};

// 新增菜单权限入参
export const CreateMenuParams = {
  clientId: null,
  description: null,
  extra: {},
  hierarchy: 'MENU',
  icon: null,
  iconUrl: null,
  identifier: null,
  parentId: 0,
  sort: 0,
  status: 'Y',
  title: null
};

// 新增菜单权限校验
export const CreateMenuValidate = async data => {
  if (!data) throw '请完善菜单资源表单';

  data.parentId = data.parentId || '0';

  data.clientId = trimValue(data.clientId);
  if (!data.clientId) throw '无效的客户端标识';

  data.hierarchy = trimValue(data.hierarchy);
  if (!data.hierarchy) throw '请选择菜单层级';

  data.title = trimValue(data.title);
  if (!data.title) throw '请填写菜单权限标题';

  data.identifier = trimValue(data.identifier);
  if (!data.identifier) throw '请填写菜单权限标识';

  return data;
};

// 新增菜单权限
export const CreateMenu = async (data = {}) => {
  const _params = {
    ...CreateMenuParams,
    ...data
  };
  await CreateMenuValidate(_params);
  await http.post('/api/manage/client/menus', _params);
};

// 更新菜单权限入参
export const UpdateMenuParams = {
  description: null,
  extra: {},
  hierarchy: 'MENU',
  icon: null,
  iconUrl: null,
  identifier: null,
  parentId: '0',
  sort: 0,
  status: 'Y',
  title: null
};

// 更新菜单权限校验
export const UpdateMenuValidate = async data => {
  if (!data) throw '请完善菜单资源表单';

  data.parentId = data.parentId || '0';

  data.clientId = trimValue(data.clientId);
  if (!data.clientId) throw '无效的客户端标识';

  data.hierarchy = trimValue(data.hierarchy);
  if (!data.hierarchy) throw '请选择菜单层级';

  data.title = trimValue(data.title);
  if (!data.title) throw '请填写菜单权限标题';

  data.identifier = trimValue(data.identifier);
  if (!data.identifier) throw '请填写菜单权限标识';

  return data;
};

// 更新菜单权限
export const UpdateMenu = async (id, data = {}) => {
  const _params = {
    ...UpdateMenuParams,
    ...data
  };
  await UpdateMenuValidate(_params);
  await http.patch(`/api/manage/client/menus/${id}`, _params);
};

// 删除菜单权限
export const DeleteMenu = async id => {
  await http.delete(`/api/manage/client/menus/menu/${id}`);
};
