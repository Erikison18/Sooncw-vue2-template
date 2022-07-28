import configApp from '@/config/app';
import routeAuthWhiteList from '@/config/routeAuthWhiteList';
import authRoutes from '@/router/routes';

// 缓存前缀
const { cachePrefix } = configApp;

// 第一个权限路由缓存标识
const FIRST_ROLE_ROUTE_CACHE_KEY = `${cachePrefix}_first_cache_route`;

// 角色路由权限
export const CACHE_KEY_AUTH_ROLE = `${cachePrefix}_auth_role_router`;

// 角色权限路由缓存标识
export const CACHE_KEY_ROLE_ROUTES = `${cachePrefix}_role_routes`;

// 菜单权限
export const CACHE_KEY_AUTH_MENUS = `${cachePrefix}_auth_menus`;

// 资源权限
export const CACHE_KEY_AUTH_RESOURCES = `${cachePrefix}_auth_resources`;

// 清除敏感登录信息
// 这会清除 cachePrefix 定义开头的所有缓存
export const clearAuth = () => {
  const _regexp = new RegExp(`^[${cachePrefix}]+`);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (_regexp.test(key)) {
      localStorage.removeItem(key);
    }
  }
};

/**
 * 检测是否拥有指定权限
 * @example
 * hasPermission('abc'); // 验证是否拥有该权限（不区分菜单和操作）
 * hasPermission('abc','menu'); // 验证是否拥有该菜单权限
 * hasPermission(['abc', 'def']); // 验证是否拥有某些权限中的一个，满足一个即返回 true
 * @param {String|Array} name 验证的权限名称
 * @param {String} type 权限类型，可选 MENU | COMPONENT | FUNCTION | PAGE | RESOURCE
 */
export const hasPermission = (name, type = 'MENU') => {
  // 开发环境不予验证
  if (process.env.NODE_ENV === 'development') return true;

  // 获取缓存权限
  let _userAuthData = [];

  if (type === 'RESOURCE') {
    _userAuthData = getAuthResources();
  } else {
    const _cacheAuthData = getAuthMenus();

    switch (type) {
      case 'COMPONENT':
        _userAuthData = _cacheAuthData['COMPONENT'];
        break;
      case 'PAGE':
        _userAuthData = _cacheAuthData['PAGE'];
        break;
      case 'FUNCTION':
        _userAuthData = _cacheAuthData['FUNCTION'];
        break;
      default:
        _userAuthData = _cacheAuthData['MENU'];
    }
  }

  // 指定需要使用权限校验，但缓存中不存在权限数据，此时认为客户端访问无效，所以返回无权限
  if (!_userAuthData || !_userAuthData.length) return false;

  // 处理权限数据为 [权限标识, 权限标识, 权限标识] 的格式，以便后续使用 [].includes(目标权限) 进行查找
  _userAuthData = [..._userAuthData].map(row => row.identifier);

  if (Array.isArray(name)) {
    return name.reduce((flag, current) => {
      if (
        routeAuthWhiteList.indexOf(current) !== -1 ||
        _userAuthData.indexOf(current) !== -1
      ) {
        flag = true;
      }
      return flag;
    }, false);
  } else {
    if (routeAuthWhiteList.indexOf(name) !== -1) return true;
    return _userAuthData.indexOf(name) !== -1;
  }
};

// 解析后台返回的权限数据，拆分为 MENU 菜单、BLANK 默认操作、ACTION 按钮操作 等几类
export const resourceParse = resources => {
  let rules = {};
  if (!Array.isArray(resources)) return rules;

  resources.forEach(res => {
    // 获取类型
    let type = res['resourceType'] ? res['resourceType'].toLowerCase() : false;
    if (!type) return;

    let group = rules[type];

    if (!group) {
      rules[type] = [res];
    } else {
      rules[type].push(res);
    }
  });

  return rules;
};

// 初始化权限路由
export const initUserRuleRoutes = () => {
  try {
    // 获取用户拥有权限的菜单路由
    const userAuthRoutes = parseRoleRoutes(authRoutes);
    setRoleRoutes(userAuthRoutes);
    return userAuthRoutes;
  } catch (error) {
    return null;
  }
};

// 缓存菜单权限资源
export const setAuthMenus = (menus = []) => {
  // 根据权限中的 hierarchy 属性，对权限进行分组
  // hierarchy 有 MENU | COMPONENT | FUNCTION | PAGE
  const _data = {
    MENU: [],
    COMPONENT: [],
    FUNCTION: [],
    PAGE: []
  };

  menus.forEach(row => {
    const _group = _data[row.hierarchy];
    if (!_group) {
      _data[row.hierarchy] = [row];
    } else {
      _data[row.hierarchy].push(row);
    }
  });

  localStorage.setItem(CACHE_KEY_AUTH_MENUS, JSON.stringify(_data));
};

// 获取缓存的菜单权限资源
export const getAuthMenus = () => {
  try {
    const _data = localStorage.getItem(CACHE_KEY_AUTH_MENUS);
    return _data ? JSON.parse(_data) : [];
  } catch (error) {
    return [];
  }
};

// 清除缓存的菜单权限资源
export const clearAuthMenus = () => {
  localStorage.removeItem(CACHE_KEY_AUTH_MENUS);
};

// 缓存权限资源
export const setAuthResources = (resources = []) => {
  localStorage.setItem(CACHE_KEY_AUTH_RESOURCES, JSON.stringify(resources));
};

// 获取缓存的权限资源
export const getAuthResources = () => {
  try {
    const _data = localStorage.getItem(CACHE_KEY_AUTH_RESOURCES);
    return _data ? JSON.parse(_data) : [];
  } catch (error) {
    return [];
  }
};

// 清除缓存的菜单权限资源
export const clearAuthResources = () => {
  localStorage.removeItem(CACHE_KEY_AUTH_RESOURCES);
};

// 遍历路由预设，筛选出拥有权限的路由
export const parseRoleRoutes = (routes, authCheckType = 'MENU') => {
  let _routes = [];

  routes.forEach(route => {
    // 注意：这里没有使用路由的 name 属性作为权限校验标识，原因：
    // 后端限制权限标识长度为 64 个字符，且必须唯一，如果前端按照英文词汇组合命名，可能会超出长度；
    // 前端采用 36 位长度 UUID 的形式作为权限唯一标识，同时解决了唯一值和长度限制问题；
    // 虽然可读性降低，但是权限标识维护的过程变得简单了。
    if (hasPermission(route.meta.role, authCheckType)) {
      // 递归子级
      if (route.children) {
        // 解析子菜单
        route.children = parseRoleRoutes(route.children, authCheckType);

        // 如果没有有权限的子级，则清空子级
        if (!route.children.length) {
          delete route.children;
        } else {
          // 如果第一个菜单不是自动跳转菜单，则跳转到第一个子菜单

          // 查找第一个有效的可重定向子路由
          const firstRedirect = route.children.find(child => !!child.meta);

          route.redirect = { name: firstRedirect.name };
        }
      }
      // 返回菜单
      _routes.push(route);
    }
  });

  setRoleRoutes(_routes);

  return _routes;
};

// 缓存角色路由数据
export const setRoleRoutes = routes => {
  localStorage.setItem(CACHE_KEY_ROLE_ROUTES, JSON.stringify(routes));
};

// 获取角色路由数据
export const getRoleRoutes = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY_ROLE_ROUTES));
  } catch (error) {
    return null;
  }
};

// 清除角色路由数据
export const clearRoleRoutes = () => {
  return localStorage.removeItem(CACHE_KEY_ROLE_ROUTES);
};

// 设置用户身份决定的动态路有权限
export const setUserAuthResource = resource => {
  try {
    localStorage.setItem(CACHE_KEY_AUTH_ROLE, JSON.stringify(resource));
    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 缓存第一个有效的权限路由
export const setFirstRoleRoute = route => {
  localStorage.setItem(FIRST_ROLE_ROUTE_CACHE_KEY, JSON.stringify(route));
};

// 获取缓存的第一个有效的权限路由
export const getFirstRoleRoute = () => {
  return JSON.parse(localStorage.getItem(FIRST_ROLE_ROUTE_CACHE_KEY) || '');
};

// 移除缓存的第一个有效的权限路由
export const removeFirstRoleRoute = () => {
  localStorage.removeItem(FIRST_ROLE_ROUTE_CACHE_KEY);
};
