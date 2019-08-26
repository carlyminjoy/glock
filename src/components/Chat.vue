<template>
  <div class="chat">
    <h4>Chatting with {{ playerTwo }}</h4>

    <div class="chat-container">
      <message v-for="(message, index) in messages"
        :enemy="message.author == playerTwo"
        :message='message'
        :key="index"></message>

      <div class="input-container">
        <input class="form-control" v-model="message" @keyup.enter="postMessage(user, message)" />
        <button class="btn btn-primary" @click.prevent="postMessage(user, message)">SEND</button>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import { default as Message } from './Message'

export default {
  name: "Chat",
  props: {
    user: {
      default: "Carly",
      type: String
    },
    playerTwo: {
      default: "Buddy",
      type: String
    },
    winner: {
      default: null,
      type: String
    }
  },
  components: {
    Message
  },
  watch: {
    winner(next, prev) {}
  },
  data() {
    return {
      messages: [],
      message: ""
    };
  },
  methods: {
    postMessage(author, message) {
      this.messages.push({
        author: author,
        message: message,
        datetime: new Date()
      });

      if (author != this.playerTwo) {
        this.message = "";
        setTimeout(() => this.aiResponse(), 2000);
      }
    },
    async aiResponse() {
      let message = await this.getInsult();
      this.postMessage(this.playerTwo, message);
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
</style>
