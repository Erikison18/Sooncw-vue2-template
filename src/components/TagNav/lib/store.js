// Vuex Module
import { getCache, setCache } from './cache';

export default {
  namespaced: true,

  state: {
    history: [...getCache()] // 访问记录
  },

  getters: {
    history: state => state.history,
    flat: state => [...state.history].map(route => route.fullPath)
  },

  mutations: {
    // 前置添加
    prepend(state, route) {
      if (!this.getters['tagNav/flat'].includes(route.fullPath)) {
        state.history.splice(0, 0, route);
        setCache(state.history);
      }
    },

    // 添加条目
    push(state, route) {
      if (route.meta && !route.meta.tag) return;
      if (!this.getters['tagNav/flat'].includes(route.fullPath)) {
        state.history.push(route);
        setCache(state.history);
      }
    },

    // 移除条目
    splice(state, options = {}) {
      options = {
        index: 0,
        length: undefined,
        rights: false,
        ...options
      };

      if (isNaN(+options.index)) return;

      if (isNaN(+options.length)) {
        if (options.rights) {
          state.history.splice(options.index + 1);
        } else {
          state.history.splice(options.index);
        }
      } else {
        state.history.splice(options.index, options.length);
      }

      setCache(state.history);
    },

    // 移除指定集合之外的条目
    spliceExcept(state, except) {
      state.history = state.history.filter(route =>
        except.includes(route.fullPath)
      );
      setCache(state.history);
    },

    // 更改指定标签的 title 值
    setTitle(state, options = {}) {
      // 合并参数
      const _options = {
        path: '',
        title: '',
        ...options
      };

      if (!_options.path || !_options.title) return;

      const { history } = state;

      const index = history.findIndex(
        route => route.fullPath === _options.path
      );

      if (index === -1) return;

      const target = history[index];

      state.history.splice(index, 1, {
        ...target,
        meta: {
          ...target.meta,
          title: _options.title
        }
      });

      setCache(state.history);
    }
  },

  actions: {
    prepend(context, route) {
      context.commit('prepend', route);
    },

    push(context, route) {
      context.commit('push', route);
    },

    splice(context, options = {}) {
      console.log(22)
      context.commit('splice', options);
    },

    spliceExcept(context, except = []) {
      console.log(33)
      context.commit('spliceExcept', except);
    },

    setTitle(context, options = []) {
      context.commit('setTitle', options);
    }
  }
};
