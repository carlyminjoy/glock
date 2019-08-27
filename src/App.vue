<template>

  <div id="app">

    <router-view></router-view>

  </div>

</template>


<script>

import { mapState } from 'vuex'

export default {
	name: "app",
	computed: mapState([
		'game'
	]),
	sockets: {
        newGame(game) {
            let showGame = [game.player1.id, game.player2.id].includes(this.$socket.client.id);

            if (showGame) {
				this.$store.commit('setGame', game)
				this.$router.push('play')
            }
        }
    }
};

</script>


<style lang='scss'>

body {
    margin: 0;
	padding: 0;
	
	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin: 0;
		padding: 0;
	}
}


</style>
