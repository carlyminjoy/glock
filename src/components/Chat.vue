<template>
  <div class="chat">
    <h5>
      Chatting with:
      <strong>{{ challenger }}</strong>
    </h5>

    <div class="chat-container">
      <transition-group name="message">
        <message
          v-for="(message, index) in messages"
          :enemy="message.author == challenger"
          :message="message"
          :key="index"
        ></message>
      </transition-group>

      <div class="input-container">
        <input class="form-control" v-model="message" @keyup.enter="postMessage(username, message)" />
        <button class="btn btn-primary" @click.prevent="postMessage(username, message)">SEND</button>
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
    },
    username: {
      type: String
    }
  },
  components: {
    Message
  },
  data() {
    return {
      messages: [],
      message: "",
      challenger: null
    };
  },
  methods: {
    postMessage(author, message) {
      this.messages.push({
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
  mounted() {
    this.challenger =
      this.game.player1 == this.username
        ? this.game.player2
        : this.game.player1;
    this.aiResponse();
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
    overflow-y: auto;
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
  height: auto;
}

.message-enter,
.message-leave-to {
  opacity: 0;
  padding: 0;
  height: 0;

  * {
    padding: 0;
  }
}
</style>
