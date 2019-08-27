<template>
  <div id="app">
    <div v-show="!game" class="waiting-container">
      <waiting :existing-username='username'/>
    </div>

    <transition name="fade">
      <div v-if="game" class="game-chat-container">
        <game @gameover='endGame()' :game="game" :username="username" />
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
    endGame() {
      this.game = null;
    }
  },
  sockets: {
    connect() {
      console.log('socket connected', this.$socket.client.id)
    },
    newGame(game) {
      this.game = game;
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
