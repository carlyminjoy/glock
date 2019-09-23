import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import App from "./App.vue";
import Lobby from "./pages/Lobby.vue";
import Play from "./pages/Play.vue";
import Leaderboard from "./pages/Leaderboard.vue";

const socket = io("https://beat-tha-glock.herokuapp.com");

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueSocketIOExt, socket);
Vue.use(require("vue-moment"));

const routes = [
  {
    path: "/",
    component: Lobby
  },
  {
    path: "/play/:id/:player",
    component: Play
  },
  {
    path: "/leaderboard",
    component: Leaderboard
  }
];

const router = new VueRouter({ routes });

const store = new Vuex.Store({
    state: {
        username: null,
        invitation: null
    },
    mutations: {
        setUsername(state, username) {
            state.username = username;
        },
        setInvitation(state, invitation) {
            state.invitation = invitation
        }
    }
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
