<template>
	<div class="chat">
		<h5>
			Chatting with:
			<strong>{{ usersString }}</strong>
		</h5>

		<div class="chat-container">
			<transition-group name="message">
				<message
					v-for="(message, index) in messages"
					:enemy="message.author != username"
					:message="message"
					:key="index"
				></message>
			</transition-group>

			<div class="input-container">
				<input class="form-control" v-model="message" @keyup.enter="postMessage(username, message)" />
				<button class="btn btn-primary" @click.prevent="postMessage(username, message)">SEND</button>
			</div>
		</div>
	</div>
</template>


<script>

import { mapState } from 'vuex'
import axios from "axios";
import { default as Message } from "./Message";

export default {
	name: "Chat",
	components: {
		Message
	},
    computed: {
        usersString() {
            if (this.users.length < 1) return null;
            return this.users.map(u => u.username).join(', ');
        },
        username() {
            return this.$store.getters.username
        }
    },
	data() {
		return {
			messages: [],
			message: "",
            users: []
		};
	},
	methods: {
		postMessage(author, message) {
            let vm = this;

			vm.$socket.client.emit('addMsg', {
				author: (author && author != undefined) ? author : vm.username,
				message: message,
				datetime: new Date()
			});

			vm.message = "";
		}
	},
	sockets: {
        onlineUsers(users) {
            let vm = this;
            vm.users = users;
        },
		newMsg(msg) {
			this.messages.push(msg)
		},
		updateUsers(users) {
            let vm = this;
			let newUsers = users.filter(u => !vm.users.includes(u))
            let disconnectedUsers = vm.users.filter(u => !users.includes(u))
            
            disconnectedUsers.forEach(u => {
				this.postMessage(u.username, `[${u.username} disconnected]`)
			})
		}
    },
    mounted() {
        this.$socket.client.emit("getUsers");
    }
};
</script>

<style lang='scss'>
@import "./../styles/variables.scss";

.chat {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	background: $primary;
	height: 100vh;
	padding: 30px;
	position: relative;
	// overflow-y: auto;

	.chat-container {
		max-height: 85%;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	h5 {
		font-size: 16px;
		color: #eee;
		// text-align:left;
	}
}

.input-container {
	display: flex;
	position: absolute;
	bottom: 30px;
	justify-content: stretch;
	width: calc(100% - 60px);

	input {
		flex-basis: 200px;
		flex-grow: 1;
	}

	button {
		flex-basis: 60px;
		flex-grow: 1;
		background: $color3;
		margin-left: 10px;
		border: none;
		color: $primary;
		font-weight: 800;
	}
}

.message-enter-active,
.message-leave-active {
	transition: all 0.3s ease;
	max-height:300px;
}

.message-enter,
.message-leave-to {
	opacity: 0;
	max-height:0;
}
</style>
