//

import _ from 'lodash';
import {getIdentity, getSecret} from './modules/identity';

console.log("Index.js load");

const Home = { template: '<div>Home</div>' }

const routes = [
	  { path: '/', component: Home },
	  { path: '/me', component: require('./identity.vue').default },
	  { path: '/user/:userid', component: require('./user.vue').default }
	]

const router = new VueRouter({
	//  mode: 'history',
	  routes: routes
	})

var app = new Vue({
	router
}).$mount('#app')

