'use strict';

export default {

  state: {
    mode: 1
  },

  mutations: {
    switchToAction1(state) {
      state.mode = 1;
    },
    switchToAction2(state) {
      state.mode = 2;
    }
  },

  actions: {
    action1({ commit, state }) {
      commit('switchToAction1');
    },
    action2({ commit, state }) {
      commit('switchToAction2');
    }
  }

};