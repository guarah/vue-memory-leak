'use strict';
import Vue from 'vue';
import Vuex from 'vuex';

import actionSwitcher from './modules/actionSwitcher';



Vue.use(Vuex);

// create the store
const store = new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production', // when in 'development' make it so whenever Vuex state is mutated outside of mutation handlers, an error will be thrown

  modules: {
    actionSwitcher
  }

});


export default store;