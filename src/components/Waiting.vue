<template>
  <div class="waiting">
    <transition name="fade">
      <div class="username-container" v-if="!username">
        <h3>Enter your username:</h3>

        <input @keyup.enter="addUsername" class="username" />
      </div>
    </transition>

    <transition name="fade2">
      <div class="challenger-container" v-if="username">
        <h3>
          <strong>{{ username }}</strong
          >, who do you want to challenge?
        </h3>

        <ul>
          <li v-for="user in availableUsers" :key="user.id">
            <div class="name">{{ user.username }}</div>

            <div class="modes">
              <button class="btn btn-success" @click="challenge(user)">
                Easy
              </button>
              <button class="btn btn-danger" @click="challenge(user, 'hard')">
                Hard
              </button>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Waiting",
  props: ["existingUsername"],
  data() {
    return {
      onlineUsers: [],
      newUsername: null
    };
  },
  mounted() {
    if (this.existingUsername) {
      this.username = this.existingUsername;
    }
  },
  computed: {
    availableUsers() {
      return this.onlineUsers.filter(u => u.id != this.$socket.client.id);
    },
    username() {
      let username = this.existingUsername
        ? this.existingUsername
        : this.newUsername;

      return username;
    }
  },
  sockets: {
    updateUsers(users) {
      this.onlineUsers = [
        {
          id: 1,
          username: "Glocktopus"
        },
        {
          id: 2,
          username: "Glockerspaniel"
        },
        {
          id: 3,
          username: "Glocktavia"
        },
        ...users
      ];
    }
  },
  methods: {
    challenge(challenger, mode = "easy") {
      let game = {
        player1: {
          username: this.username,
          id: this.$socket.client.id
        },
        player2: challenger,
        round: 1,
        userTurn: this.username,
        winner: null,
        melody: [],
        step: "add", // add, listen, guess
        mode: mode
      };

      this.$socket.client.emit("startGame", game);
    },
    addUsername(e) {
      e.preventDefault();

      let user = {
        id: this.$socket.client.id,
        username: e.target.value
      };

      this.$socket.client.emit("newUser", user);
      this.newUsername = e.target.value;
    }
  }
};
</script>

<style lang="scss">
@import "./../styles/variables.scss";

.waiting-container {
  padding: 40px;

  .username-container {
    padding: 30px;

    h3 {
      margin-bottom: 30px;
    }

    input {
      width: 400px;
      padding: 5px;
      color: $primary;
      border: 2px solid $primary;
      font-size: 24px;
      text-align: center;
      font-weight: 400;

      &:focus {
        outline: none;
      }
    }
  }

  .challenger-container {
    padding: 30px;

    ul {
      list-style-type: none;
      padding-inline-start: 0;
      max-width: 400px;
      margin: 0 auto;
      margin-top: 30px;

      li {
        background: $primary;
        color: #fff;
        padding: 0;
        margin: 10px auto;
        transition: 0.3s ease;
        text-align: center;
        @extend %boxshadow;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;

        .name {
          text-align: left;
          font-size: 18px;
          padding-left: 15px;
          font-weight: 800;
          flex-basis: 300px;
        }

        .modes {
          flex-basis: 200px;
          padding: 0;
          margin: 0;
          height: 100%;
          display: flex;

          button {
            flex-basis: 50%;
            border: 0;
            margin: 0;
            border-radius: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 900;
            font-size: 16px;

            &:hover {
              background: $primary !important;
            }

            &.btn-success {
              background: $color3;
            }

            &.btn-danger {
              background: $color7;
            }
          }
        }
      }
    }
  }
}
</style>
