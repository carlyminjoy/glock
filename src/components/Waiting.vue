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
          <strong>{{ username }}</strong>, who do you want to challenge?
        </h3>

        <ul>
          <li v-for="user in onlineUsers" :key="user.id">
            <div class="name">{{ user.username }}</div>

            <div class="modes">
              <button class="btn btn-success" @click="challenge(user)">Easy</button>
              <button class="btn btn-danger" @click="challenge(user, 'hard')">Hard</button>
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
  data() {
    return {
      onlineUsers: [
        {
          id: 1234,
          username: "Glochtopus"
        }
      ],
      username: null
    };
  },
  methods: {
    challenge(challenger, mode = "easy") {
      this.$emit("newgame", {
        challenger: challenger,
        username: this.username,
        mode: mode
      });
    },
    addUsername(e) {
      e.preventDefault();
      this.username = e.target.value;
    }
  }
};
</script>

<style lang='scss'>
@import "./../styles/variables.scss";

%boxshadow {
  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09),
    0 3px 3px rgba(0, 0, 0, 0.12);
  -moz-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
  -ms-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
  -o-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
}

.waiting-container {
  padding: 40px;

  .username-container {
    padding: 30px;

    h3 {
      margin-bottom: 30px;
    }

    input {
      width: 400px;
      padding: 12px;
      color: $primary;
      border: 2px solid $primary;
      font-size: 18px;
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
