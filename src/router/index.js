'use strict';
import Vue from 'vue'
import Router from 'vue-router';

const Home = () => System.import('../views/home/index.vue');
const About = () => System.import('../views/about/index.vue');

// create the router and configure the routes
const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
});

Vue.use(Router);

export default router;