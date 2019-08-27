<template>

    <div class="username-container">

        <h3>Enter your username:</h3>

        <input @keyup.enter="addUsername" class="username" />

    </div>

</template>


<script>

import { mapState } from 'vuex'

export default {
    name: "Login",
    computed: mapState([
        'username'
    ]),
    methods: {
        addUsername(e) {
            e.preventDefault();

            let username = e.target.value

            let user = {
                id: this.$socket.client.id,
                username: username
            }

            this.$socket.client.emit('newUser', user)
            this.$store.commit('setUsername', username)
        }
    }
};

</script>


<style lang='scss'>

@import "./../styles/variables.scss";

.lobby {
    padding: 40px;
}

</style>
