<template>
	<div class="invitation">
		<p>You have been challenged by {{ invitation.player1.username }}!</p>
		<button @click='accept()'>Accept</button>
	</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
	name: "Invitation",
	computed: mapState([
		'invitation'
	]),
	methods: {
		accept() {
            this.$router.push(`play/${this.invitation._id}/2`)
			this.$store.commit('setInvitation', null);
		}
	}
};
</script>

<style lang='scss'>
@import "./../styles/variables.scss";


.invitation {
	position:absolute;
	top: calc(50vh - 100px);
	left: calc(50vw - 150px);
	height: 200px;
	width: 300px;
	display:block;
	background: #555;
	color:#fff;
    text-align:center;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    @extend %boxshadow;

    p {
        margin-bottom: 30px;
    }
}
</style>