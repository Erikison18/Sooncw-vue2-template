import Vue from "vue";
import Vuex from "vuex";
import * as grant from '@/core/grant';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: grant.getAuthUser(),
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    removeUser(state) {
      state.user = null;
    },
  },
  actions: {
    setUser(contex, user) {
      contex.commit('setUser', user);
    },
    removeUser(contex) {
      contex.commit('removeUser');
    }
  },
  modules: {}
});
