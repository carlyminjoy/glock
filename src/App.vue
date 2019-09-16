<template>

  <div id="app">
    <nav v-if='!game || game.winner'>
        <router-link to="/leaderboard">Leaderboard</router-link>
        <router-link to="/">Lobby</router-link>
    </nav>

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
@import './styles/variables.scss';
@import 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css';
body {
    margin: 0;
    padding: 0;
    overflow-y:hidden;
	
	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin: 0;
        padding: 0;
        
        nav {
            position:fixed;
            padding: 15px;
            z-index:99;

            a {
                padding: 15px;
                text-decoration:none;
                color: $primary;
                font-weight:bold;
                text-transform:uppercase;
                letter-spacing: 2px;
                transition:0.3s ease;

                &:hover {
                    color: $secondary;
                }
            }
        }
	}
}


</style>
