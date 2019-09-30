<template>
  
    <div class="challengers">

        <h3>
          	<strong>{{ username }}</strong>, who do you want to challenge?
        </h3>

        <ul>
            <challenger @challenge='challenge' v-for="user in users" :user='user' :key="user.id" />
        </ul>

    </div>

</template>


<script>

import { mapState } from 'vuex'
import Challenger from './Challenger.vue'
import axios from 'axios';

export default {
	name: "Challengers",
	props: {
		users: {
			type: Array
		}
	},
	components: {
		Challenger
	},
	computed: mapState([
		'username'
	]),
	methods: {
		challenge(challenger, mode) {
            axios.post('/api/new', {
                player1: {
                    username: this.username,
                    id: this.$socket.client.id
                },
                player2: challenger,
                mode: mode
            })
            .then(res => {
                this.$router.push(`/play/${res.data._id}/1`)
            })

		}
	}
};
</script>

<style lang='scss'>

@import "./../styles/variables.scss";

.challengers {
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

    ul {
      list-style-type: none;
      padding-inline-start: 0;
      max-width: 400px;
      margin: 0 auto;
      margin-top: 30px;

}
</style>
