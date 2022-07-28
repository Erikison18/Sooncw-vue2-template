import Vuex from 'vuex';
import Vue from 'vue';
import userStore from './modules/user.js';
import enumStore from './modules/enum.js';
import tagNav from '@/components/TagNav/lib/store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tagNav,
    userStore,
    enumStore
  }
});
