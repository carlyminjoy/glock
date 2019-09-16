import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import App from "./App.vue";
import Lobby from "./pages/Lobby.vue";
import Play from "./pages/Play.vue";
import Leaderboard from "./pages/Leaderboard.vue";
import axios from 'axios';

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
    path: "/play",
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
    game: null
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setGame(state, game) {
      state.game = game;
    },
    setWinner(state, winner) {
      state.game.winner = winner;
    },
    setStep(state, step) {
      state.game.step = step;
    },
    addRound(state) {
      state.game.round++;
    },
    addMelodyNote(state, note) {
      state.game.melody.push(note);
    },
    switchUser(state) {
      let currentUser = state.game.userTurn;
      state.game.userTurn =
        currentUser == state.game.player1.username
          ? state.game.player2.username
          : state.game.player1.username;
    }
  },
  getters: {
    game: state => {
      return state.game;
    },
    username: state => {
      return state.username;
    }
  },
  actions: {
    makeValidMove(context, note) {
      context.commit("addMelodyNote", note);
      context.commit("switchUser");
      context.commit("addRound");
      context.commit("setStep", "listen");
    },
    gameover(context, data) {
        context.commit('setWinner', data.winner);
        axios.post('/api/add', data);
    }
  }
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
