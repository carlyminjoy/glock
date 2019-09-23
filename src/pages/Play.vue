<template>
  <div class="play-container">
    <transition name="fade">
      <game @gameover="game = null" />
    </transition>

    <transition name="fade">
      <chat />
    </transition>
  </div>
</template>


<script>
import Game from "./../components/Game.vue";
import Chat from "./../components/Chat.vue";

export default {
    name: "Play",
    components: {
        Game,
        Chat
    }
};
</script>


<style lang='scss'>
.play-container {
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
</style>
