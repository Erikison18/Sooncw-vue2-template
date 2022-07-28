import storage from '@/utils/storage';
import * as http from '@/http';

import ENUM_LIST from '@/api/enum';

const ENUM_KEY = 'ENUM_CACHE';

const ENUM_URLS = ENUM_LIST;

const _enums = storage.getSession(ENUM_KEY) || {};

Object.keys(ENUM_URLS).forEach(key => {
  _enums[key] = _enums[key] || [];
});

/**
 * 静态枚举值
 */
Object.assign(_enums, {
  // yesNoEnum: [
  //     {
  //         value: '1',
  //         displayName: '是'
  //     },
  //     {
  //         value: '0',
  //         displayName: '否'
  //     }
  // ],
});

const state = {
  enums: _enums
};

const mutations = {
  SET_ENUMS() {
    state.enums = {
      ..._enums
    };
    storage.setSession(ENUM_KEY, _enums);
  }
};

const actions = {
  async fetchEnums({ commit }, enumName) {
    if (!enumName || !enumName.length) {
      return;
    }
    if (Array.isArray(enumName[0])) {
      enumName = enumName[0];
    }
    return await Promise.all(
      enumName.map(async key => {
        if (_enums[key] && _enums[key].length) {
          return _enums[key];
        }
        const url = ENUM_URLS[key];
        if (!url) {
          return;
        }
        const res = await http.get(url);
        _enums[key] = res.data;
        commit('SET_ENUMS');
        return res.data;
      })
    );
  }
};
export default {
  namespaced: false,
  state,
  mutations,
  actions
};
