import { getUser } from '@/utils/app';

// 获取缓存中的登录用户
const _cacheUser = getUser();

export default {
  state() {
    return {
      user: _cacheUser // 已登录用户
    };
  },
  mutations: {
    // 设置用户信息
    setUser(state, user) {
      state.user = user;
    },
    removeUser(state) {
      state.user = null;
    }
  },
  actions: {
    setUserByAction(context, user) {
      context.commit('setUser', user);
    },
    removeUserByAction(context) {
      context.commit('removeUser');
    }
  }
};
