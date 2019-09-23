<template>
    <div class="lobby">

        <transition name="fade">
            <challengers v-if='username' :users='availableUsers' />
        </transition>

        <transition name="fade">
            <login v-if='!username' />
        </transition>

    </div>
</template>


<script>

import { mapState } from 'vuex';
import Login from './../components/Login.vue'
import Challengers from './../components/Challengers.vue'

export default {
    name: "Lobby",
    data() {
        return {
            onlineUsers: [
                {
                    id: 1,
                    username: "Glocktopus"
				}
            ]
        }
    },
    components: {
        Login,
        Challengers
    },
    computed: {
		availableUsers() {
            return this.onlineUsers.filter(u => u.id && u.id != this.$socket.client.id && u.username != this.username)
        },
        ...mapState([
            'username'
        ])
	},
	sockets: {
		updateUsers(users) {
			this.onlineUsers = [
				{
                    id: 1,
                    username: "Glocktopus"
				},
				...users
			]
		}
	}
};

</script>


<style lang='scss'>

@import "./../styles/variables.scss";

.lobby {
    padding: 60px;
}

</style>
