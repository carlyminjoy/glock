<template>

    <div class="waiting">

        <transition name='fade'>
            <div class='username-container' v-if='!username'>

                <h3>Enter your username:</h3>

                <input @keyup.enter='addUsername' class='username' />

            </div>
        </transition>

        <transition name='fade2'>
            <div class='challenger-container' v-if='username'>

                <h3><strong>{{ username }}</strong>, who do you want to challenge?</h3>

                <ul>
                    <li @click='challenge(user)' v-for='user in onlineUsers' :key='user.id'>
                        <p>{{ user.username }}</p>
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
                username: 'Bob (AI)'
            }
        ],
        username: null
     }
  },
  methods: {
      challenge(challenger) {
          this.$emit('newgame', {
              challenger: challenger,
              username: this.username
          })
      },
      addUsername(e) {
          e.preventDefault();
          this.username = e.target.value;
      }
  }
}

</script>

<style lang='scss'>

@import "./../styles/variables.scss";

%boxshadow {
    -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
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
            width:300px;
            padding: 12px;
            border:2px solid $primary;
        }
    }
    
    .challenger-container {
        padding: 30px;
        
        ul {
            list-style-type:none;
            padding-inline-start:0;
            max-width: 300px;
            margin: 0 auto;
            margin-top: 30px;

            li {
                background: $color7;
                color: #fff;
                padding: 16px;
                transition: 0.3s ease;
                text-align:center;
                @extend %boxshadow;

                &:hover {
                    background: $color3;
                    cursor:pointer;
                }
                
                p {
                    font-size: 24px;
                    line-height: 24px;
                    margin: 0;
                }
            }
        }
    }

}

</style>
