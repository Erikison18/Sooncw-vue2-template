/**
 * 用户权限管理插件
 * 
 * 该插件旨在简化权限验证流程、增强权限校验方式。插件本身具有普遍
 * 适应性，它并不关心业务层具体如何实现，只是提供一套方案和机制。
 * 
 * 用前须知：
 * 
 * 1、你需要自己对后端数据进行修整，并适配为插件可用的格式：
 * 
 * ```js
 * [{ name: '权限唯一标识', label: '权限描述中文' }]
 * ```
 * 
 * 2、对于置灰的权限校验对象，除了使用 v-auth 指令判断权限外，还需
 * 要在业务逻辑 js 中添加限定，如：禁用相关的事件、阻止流程的执行等。
 * 
 * 用法：
 * 
 * 1、在 main.js 注册插件 ：
 * 
 * ```js
 * // 权限管理插件
 * import auth from '@/plugins/auth';
 * Vue.use(auth, {
 *   cachePrefix: config.cachePrefix,
 * });
 * ```
 * 
 * 2、在合适的时机（如登录成功）更新权限：
 * 
 * ```js
 * // 模拟登录
 * // 登录验证，拿到用户信息
 * const user = await Api.Login();
 * // 更新用户信息到权限插件
 * this.$auth.set('user', user);
 * 
 * // 获取用户的权限信息
 * const rules = await Api.getAuthResources();
 * 
 * // 解析并存储菜单类权限
 * const ruleMenus = rules.find(row => row.resourceIdentifier === 'MENU')
 *                        .map(row => {
 *                          return { name: row.resourceIdentifier, label: row.resourceDisplayName };
 *                        });
 * this.$auth.set('menu', ruleMenus);
 * 
 * // 解析并存储操作类权限
 * const ruleActions = rules.find(row => row.resourceIdentifier === 'ACTION')
 *                          .map(row => {
 *                            return { name: row.resourceIdentifier, label: row.resourceDisplayName };
 *                          });
 * this.$auth.set('action', ruleActions);
 * 
 * // 转到主页
 * this.$router.replace('/');
 * ```
 * 
 * 3、在 html 元素上可以使用 `v-auth` 指令进行权限校验：
 * 
 * ```html
 * <button v-auth="'UserProfile'" @click="doSomething">用户信息</button>
 * ```
 * 
 * 注意，在 html 中使用 v-auth 只可以把按钮置灰，并禁用一部分样
 * 式，我们还需要在 js 中对权限进行校验：
 * 
 * ```js
 * doSomething() {
 *  // 无权限时直接退出执行
 *  if(!this.$auth.hasPermission('UserProfile')) return;
 *  // 其他逻辑···
 * }
 * ```
 * 
 * 更多用法详见下文。
 * 
 * 4、清除权限信息，在退出登录或登录超时时，我们需要清除缓存信息，可以使用下面的语法：
 * 
 * ```js
 * // 清除缓存信息
 * this.$auth.clear();
 * ```
 * 
 * 权限校验语法
 * 
 * `$auth.hasPermission` 支持 2 个参数，第一个参数是权限校验规则，第二个参数是权限类型。
 * 
 * 第 2 个参数可选，如果不指定，则默认为全部权限（含菜单和操作）；
 * 
 * ```js
 * const hasPermission = this.$auth.hasPermission('UserProfile', 'menu');
 * ```
 * 
 * 权限校验规则支持语义语法，比如：
 * 
 * - `|` 分隔表示“或”，给定的条件中，任何一个命中即返回 `true`；
 * - `&` 分隔表示“且”，必须全部满足条件才会返回 `true`；
 * - `*` 表示模糊查询，仅支持后缀模糊查询，如：`User*`，这将匹配所有 `User` 开头的权限；
 * 
 * 三种语法支持混合使用，但需要注意的是 ** | 的优先级比 & 的优先级高 **，比如：
 * 
 * ```
 * A|B&C|D|E
 * ```
 * 上面的权限配置，如果 A 命中，则直接返回 true，否则继续校验 B&C，如果 B&C  同时
 * 命中，则直接返回 true，依次类推。
 * 
 * 示例：
 * 
 * ```
 * // 单一权限校验
 * this.$auth.hasPermission('UserProfile');
 * 
 * // 多个权限任一命中即可
 * this.$auth.hasPermission('UserProfile|UserEdit|UserAvatar');
 * 
 * // 多个权限必须同时具备
 * this.$auth.hasPermission('UserProfile&UserEdit&UserAvatar');
 * 
 * // 混合使用
 * this.$auth.hasPermission('UserProfile|UserEdit&UserAvatar');
 * 
 * // 模糊匹配
 * this.$auth.hasPermission('User*|Member*&Suplier*');
 * ```
 * 
 * 权限校验指令语法
 *
 * 指令权限支持上面的校验规则，还支持额外的参数，语法如下：
 * 
 * ```
 * v-auth.[hidden]="'name,' | ['name,', 'Access Denied.']"
 * ```
 * 
 * 1、最简单的调用，按钮会被置灰显示：
 * 
 * ```html
 * <button v-auth="'UserProfile'">用户信息</button>
 * ```
 * 
 * 2、添加 `hidden` 参数可隐藏按钮：
 * 
 * ```html
 * <button v-auth.hidden="'UserProfile'">用户信息</button>
 * ```
 * 
 * 3、支持自定义提示
 * 
 * ```html
 * <button v-auth="['UserProfile', '权限不足，请联系管理员']">用户信息</button>
 * ```
 * 
 * 指令通常需要和 `$auth` 混合使用。
 * 
 * 更多用法建议阅读源码。
 */
export const Auth = function (options) {
  // 初始化配置
  this.options = {
    ...Auth.DEFAULTS,
    ...(options || {}),
  };

  // 数据
  this.data = {
    // 菜单权限
    menu: {
      key: this._cacheKey('menu'),
      data: [],
    },

    // 操作权限
    action: {
      key: this._cacheKey('action'),
      data: [],
    },
  };

  // 初始化缓存
  this.initCache();
};

// 创建缓存标识
Auth.prototype._cacheKey = function (type) {
  if (!type) return null;
  return [this.options.cachePrefix, 'auth', type].filter(n => n).join('_')
}

// 从 localStorage 读取数据
Auth.prototype.initCache = function () {
  ['menu', 'action'].forEach((type) => {
    const cacheKey = this._cacheKey(type);
    this.set(type, this.getCache(cacheKey, ['menu', 'action'].includes(type) ? [] : null));
  });
}

// 更新 localStorage 中的相关数据
Auth.prototype.setCache = function (key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// 获取指定的 localStorage 数据
Auth.prototype.getCache = function (key, defaultValue) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : (defaultValue || null);
}

// 删除 localStorage 中的相关数据
Auth.prototype.removeCache = function (key) {
  localStorage.removeItem(key);
}

// 清除 localStorage 中的相关数据
Auth.prototype.clearCache = function () {
  // 获取当前全部 localStorage 的 key
  const allKeys = Object.keys(localStorage);
  if (!allKeys.length) return;

  // 拼接当前对应的标识前缀
  const prefix = [this.options.cachePrefix, 'auth'].filter(n => n).join('_');

  // 遍历删除
  allKeys.forEach(key => {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  });
}

// 添加权限
Auth.prototype.update = function (data = {}) {
  this.set('menu', data.menu || []);
  this.set('action', data.action || []);
};

// 合并权限
Auth.prototype.merge = function (type, data) {
  if (!type || !data || !['menu', 'action'].includes(type)) return;

  // 获取原始数据
  const _data = this.data[type].data;

  if (['menu', 'action'].includes(type)) {
    this.set(type, Array.from(new Set([
      ...(Array.isArray(_data) ? _data : []),
      ...(Array.isArray(data) ? data : []),
    ])));
  }

  return this.get(type);
};

// 设置指定数据
Auth.prototype.set = function (type, data) {
  if (!type || !['menu', 'action'].includes(type)) return;

  if (!Array.isArray(data)) return;

  this.data[type].data = data;

  this.setCache(this.data[type].key, data);
};

// 设置指定项的数据
Auth.prototype.get = function (type) {
  if (!type || !['menu', 'action'].includes(type)) return null;
  return this.data[type].data || null;
};

// 清除配置
Auth.prototype.clear = function () {
  this.clearCache();
  this.update({
    menu: [],
    action: []
  });
};

/**
 * 权限匹配校验
 * @param {String} condition 权限匹配模板
 * @param {String} type 权限类型
 * @returns {boolean}
 */
Auth.prototype.hasPermission = function (condition, type) {
  // 注意，如果未指定条件，则此此处需要权限控制并默认返回 false（表示无权限）；
  if (!condition) return false;

  // 获取权限
  let rules;
  if (['menu', 'action'].includes(type)) {
    rules = this.data[type].data.map(row => row.name);
  } else {
    rules = [
      ...this.data['menu'].data,
      ...this.data['action'].data,
    ].map(row => row.name);
  }

  // 未配置权限数据，上面明确要求权限校验，而系统中没有可用的权限数据，则此时认为无权限（比如：未登录）；
  if (!rules || !rules.length) return false;

  // 条目匹配
  const picker = function (identifier) {
    const res = rules.filter(name => {
      if (/\*/.test(identifier)) return new RegExp(`^(${identifier})`).test(name);
      return name === identifier;
    });
    return !!res.length;
  };

  // 校验方法
  const match = function (identifier) {
    if (identifier === undefined) return true;

    // 尝试使用 & 打散为数组
    const ids = identifier.split('&');
    // & 符号打散时，需要完全匹配
    const matchingFlag = ids.length;

    // 如果只有一位，则直接返回查找结果
    if (ids.length === 1) return picker(ids[0]);

    // 归并查找
    return ids.reduce((flag, part) => {
      flag += picker(part) ? 1 : 0;
      return flag;
    }, 0) === matchingFlag;
  };

  // 打散数组
  const conditions = condition.split('|');

  // 如果只有一个条件，则直接匹配并返回结果
  if (conditions.length === 1) return match(conditions[0]);

  // 避免直接遍历
  return conditions.some(part => match(part));
};

// 默认配置项
Auth.DEFAULTS = {
  cachePrefix: '', // 缓存前缀标识
  whiteList: [], // 白名单
};

export default {
  install: function (Vue, options) {
    // 实例化权限控制
    const $auth = new Auth(options);

    // 指令权限校验
    const directiveAuth = function (el, binding, vnode) {
      // 获取指定的配置
      const {
        value,
        modifiers
      } = binding;

      // 解析权限入参
      const condition = Array.isArray(value) ? value[0] : value;

      // 无权限时的提示
      const commentText = Array.isArray(value) && value.length >= 2 ? value[1] : 'Access Denied.';

      // 未设置参数，直接返回
      if (!condition) return;

      // 获取所有权限
      const hasPermission = $auth.hasPermission(condition);

      // 有权限，无需处理
      if (hasPermission) return;

      // 需要移除元素
      if (modifiers.hidden) {
        const comment = document.createComment(` ${commentText} `);
        vnode.elm = comment;
        return;
      }

      // 设置禁用
      el.setAttribute('disabled', 'disabled');
      el.setAttribute('title', commentText);
      el.style.opacity = 0.5;
      el.style.pointerEvents = 'none';
    };

    // 注册指令，在 html 中可以使用 v-auth="" 校验权限
    Vue.directive('auth', {
      bind: directiveAuth,
      componentUpdated: directiveAuth,
    });

    // 添加实例方法，在 js 中，可以使用 this.$auth 操作权限
    Vue.prototype.$auth = $auth;
  }
};
