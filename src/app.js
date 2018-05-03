var sitedata = {
	test: "TETETTE",
	identity: {
		name: "jokudefault"
	},
	profile: {
		name: "OU JEE"
	},
	knownusers: {},
	items: {}
};

const Home = { template: '<div>Home</div>' }
const User = { template: '#ProfileTemplate' }

const routes = [
	  { path: '/', component: Home },
	  { path: '/me', component: require('./identity.vue').default },
	  { path: '/user', component: User }
	]

const router = new VueRouter({
	//  mode: 'history',
	  routes: routes
	})

var app = new Vue({
	router,
	data: sitedata
}).$mount('#app')

