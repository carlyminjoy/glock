<template>
  <div id="app">
    <div class="page-container">
      <game />
      <chat />
    </div>
  </div>
</template>

<script>
import Game from "./components/Game.vue";
import Chat from "./components/Chat.vue";

export default {
  name: "app",
  components: {
    Game,
    Chat
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

  .page-container {
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
