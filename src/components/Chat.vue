<template>
  <div class="chat">
    <h5>
      Chatting with:
      <strong>{{ challenger.username }}</strong>
    </h5>

    <div class="chat-container">
      <transition-group name="message">
        <message
          v-for="(message, index) in messages"
          :enemy="message.author.id == challenger.id"
          :message="message"
          :key="index"
        ></message>
      </transition-group>

      <div class="input-container">
        <input class="form-control" v-model="message" @keyup.enter="postMessage(user, message)" />
        <button class="btn btn-primary" @click.prevent="postMessage(user, message)">SEND</button>
        <button class="btn btn-primary" @click.prevent="aiResponse()">AI</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { default as Message } from "./Message";

export default {
  name: "Chat",
  props: {
    game: {
      type: Object
    }
  },
  components: {
    Message
  },
  data() {
    return {
      messages: [],
      message: "",
	  challenger: null,
	  user: null
    };
  },
  methods: {
    postMessage(author, message) {
		this.$socket.client.emit('addMsg', {
        	author: author,
        	message: message,
        	datetime: new Date()
      	});

      	this.message = "";
    },
    async aiResponse() {
      let message = await this.getInsult();
      this.postMessage(this.challenger, message);
    },
    getInsult() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            "https://lakerolmaker-insult-generator-v1.p.rapidapi.com/?mode=random",
            {
              headers: {
                "x-rapidapi-host":
                  "lakerolmaker-insult-generator-v1.p.rapidapi.com",
                "x-rapidapi-key":
                  "b82a516a4bmshd9e853bb88fc02bp1f25a5jsn6a067c1ea61d"
              }
            }
          )
          .then(res => resolve(res.data))
          .catch(e => reject(e));
      });
    }
  },
  sockets: {
    newMsg(msg) {
	    this.messages.push(msg)
    },
    updateUsers(users) {
      let challengerDisconnected = users.filter(u => u.id == this.challenger.id).length == 0;

			if (challengerDisconnected) {
				this.postMessage(this.challenger, '[disconnected]')
			}
		}
  },
  created() {
    this.user = this.game.player1.id == this.$socket.client.id ? this.game.player1 : this.game.player2;
	this.challenger = this.game.player1.id == this.$socket.client.id ? this.game.player2 : this.game.player1;
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
