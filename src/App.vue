<template>
  <div id="app">
    <div v-if="!game" class="waiting-container">
      <waiting @newgame="initGame" />
    </div>

    <transition name="fade">
      <div v-if="game" class="game-chat-container">
        <game :game="game" :username="username" />
        <chat :game="game" :username="username" />
      </div>
    </transition>
  </div>
</template>

<script>
import Waiting from "./components/Waiting.vue";
import Game from "./components/Game.vue";
import Chat from "./components/Chat.vue";

export default {
  name: "app",
  components: {
    Game,
    Chat,
    Waiting
  },
  data() {
    return {
      game: null,
      username: null
    };
  },
  methods: {
    initGame(data) {
      this.username = data.username;
      this.game = {
        player1: data.username,
        player2: data.challenger.username,
        round: 1,
        userTurn: data.username,
        winner: null,
        melody: [],
        step: "add", // 'add', 'listen', 'guess,
        mode: data.mode
      };
    }
  }
};
</script>

<style lang='scss'>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;

  .game-chat-container {
    margin: 0 auto;
    display: flex;
    /* flex-wrap: wrap; */

    .game {
      flex-basis: 70%;
      min-width: 800px;
    }
    .chat {
      flex-basis: 30%;
      min-width: 300px;
    }
  }
}
</style>
