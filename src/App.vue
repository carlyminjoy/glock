<template>

    <div id="app">
        <invitation v-if='invitation'></invitation>

        <nav v-if='!game || game.winner'>
            <router-link to="/leaderboard">Leaderboard</router-link>
            <router-link to="/">Lobby</router-link>
        </nav>

        <router-view></router-view>
    </div>

</template>


<script>

import Invitation from './components/Invitation';
import { mapState } from 'vuex'

export default {
    name: "app",
    components: {
        Invitation
    },
	computed: mapState([
		'game','invitation','username'
	]),
	sockets: {
        newGame(game) {
            let hasBeenChallenged = this.username == game.player2.username;

            if (hasBeenChallenged) {
				this.$store.commit('setInvitation', game)
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
