import Vue from "vue";
import VueRouter from 'vue-router'
import Vuex from 'vuex';
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import App from "./App.vue";
import Lobby from './pages/Lobby.vue'
import Play from './pages/Play.vue'

const socket = io('https://beat-tha-glock.herokuapp.com')

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueSocketIOExt, socket)
Vue.use(require('vue-moment'))

const routes = [
	{
		path: '/',
		component: Lobby
	},
	{
		path: '/play',
		component: Play
	}
]

const router = new VueRouter({routes})

const store = new Vuex.Store({
	state: {
		username: null,
		game: null
	},
	mutations: {
		setUsername (state, username) {
			state.username = username;
		},
		setGame (state, game) {
			state.game = game;
		},
		setWinner(state, winner) {
			state.game.winner = winner;
		}
	},
	getters: {
		game: state => {
			return state.game
		},
		username: state => {
			return state.username
		}
	}
})

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount("#app");
