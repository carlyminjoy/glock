<template>
  <div class="chat">
    <h4>Chatting with {{ playerTwo }}</h4>

    <div class="chat-container">
      <div
        class="message"
        :class="{'enemy' : message.author == playerTwo }"
        v-for="(message, index) in messages"
        :key="index"
      >
        <p class="author">{{message.author }}</p>
        <p>{{ message.message }}</p>
      </div>

      <div class="input-container">
        <input class="form-control" v-model="message" />
        <button class="btn btn-primary" @click.prevent="postMessage(user, message)">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  //   props: ["user", "playerTwo"],
  data() {
    return {
      user: "Carly",
      playerTwo: "Buddy",
      messages: [
        {
          author: "Buddy",
          message: "You suck"
        }
      ],
      message: ""
    };
  },
  methods: {
    postMessage(author, message) {
      this.messages.push({
        author: author,
        message: message
      });

      this.message = "";

      if (author != this.playerTwo) {
        setTimeout(() => this.aiResponse(), 2000);
      }
    },
    aiResponse() {
      let message = "You still suck.";
      this.postMessage(this.playerTwo, message);
    }
  }
};
</script>

<style lang='scss'>
.chat {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #2c3e50;
  height: 100vh;
  padding: 30px;
  position: relative;
  overflow-y: scroll;

  .chat-container {
    max-height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
}

.message {
  background: lightblue;
  border-radius: 4px 4px 0 4px;
  font-size: 14px;
  text-align: left;
  padding: 10px 15px;
  margin: 10px 0;
  margin-left: 30px;
}
.message.enemy {
  margin-left: 0;
  margin-right: 30px;
  background: #eee;
  border-radius: 4px 4px 4px 0;
}

p {
  margin: 0;
}

.author {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
  margin-bottom: 4px;
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
  }
}
</style>
