<template>

    <li class='challenger'>
    
        <div class="name">{{ user.username }}</div>

        <div class="modes">
            <button class="btn btn-success" @click="challenge()">Easy</button>
            <button class="btn btn-danger" @click="challenge('hard')">Hard</button>
        </div>

    </li>

</template>


<script>

export default {
	name: "Challenger",
	props: {
		user: {
			type: Object
		}
	},
	methods: {
		challenge(mode = 'easy') {
			this.$emit('challenge', this.user, mode)
		}
	}
}

</script>


<style lang='scss'>

@import './../styles/variables.scss';

li.challenger {
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

</style>