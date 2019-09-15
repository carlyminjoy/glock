<template>
	<div class="game">
		<div class="game-container">
			<h1>
				beat
				<br />the
				<br />
				<strong>glock</strong>
			</h1>

			<h5>Round {{ game.round }}</h5>

			<div v-if="game.step =='guess' && !game.winner" class="timer">{{ timer }}</div>

			<svg width="600" height="300">
				<key
					v-for="(settings, note) in notes"
					v-on:play="userPlay"
					:id="note"
					:key="note"
					:note="settings"
				/>
			</svg>

			<p v-if="!game.winner">
				<span v-if="game.userTurn != user.username">
					<span v-if="game.round > 1">Nice moves.</span>
					Waiting on {{ challenger.username }} ...
				</span>

				<span v-else>
					<span v-if="game.step == 'listen'">{{ challenger.username }} has made a move.</span>

					<span v-else-if="game.step == 'add'">
						<span v-if="game.round == 1">Add the first note.</span>
						<span v-else>Add another note.</span>
					</span>

					<span v-else-if="game.step == 'guess'">Now play it back.</span>
				</span>
			</p>

			<spinner v-if="!game.winner && game.userTurn != user.username"></spinner>

			<transition name="gameover">
				<div v-if="game.winner">
					<h5 v-if="game.winner == challenger.username" class="gameover">GAMEOVER</h5>
					<h5 v-else class="winner">WINNER</h5>
					<p>
						<strong>{{ game.winner }} wins.</strong>
					</p>

					<button class="btn ai" @click="backToLobby()">Back to lobby</button>
				</div>
			</transition>

			<div class="actions">
				<button
					class="btn"
					v-if="game.userTurn == user.username && game.step == 'listen'"
					@click="listen()"
				>Listen</button>
			</div>

			<!-- TEMP AI ACTIONS -->
			<button
				v-if="game.player2.id < 5 && game.userTurn == challenger.username && !game.winner"
				class="btn ai"
				@click="aiMove()"
			>AI MOVE</button>

			<audio v-for="(settings, note) in notes" :id="note" preload="auto" :key="note">
				<source :src="settings.sound" type="audio/wav" />
			</audio>
		</div>
	</div>
</template>


<script>

import { mapState, mapGetters } from "vuex";
import { default as Key } from "./Key";
import { default as notes } from "./../config/notes";
import { default as Spinner } from "./../../node_modules/vue-spinners/src/components/CubeSpinner";
import { setTimeout } from "timers";

export default {
	components: {
		Key,
		Spinner
	},
	data() {
		return {
			guesses: [],
			notes: notes,
			challenger: null,
			user: null,
			speed: 1000,
			timer: 0
		};
	},
	computed: mapState(["username", "game"]),
	sockets: {
		newMove(game) {
			this.$store.commit("setGame", game);
		},
		updateUsers(users) {
            let vm = this;
			let challengerDisconnected =
				users.filter(u => u.id == this.challenger.id).length == 0;

			if (challengerDisconnected) {
				vm.$store.dispatch('gameover', {
                    round: vm.game.round,
                    winner: vm.user.username,
                    loser: vm.challenger.username,
                    mode: vm.game.mode
                });
			}
		}
	},
	created() {
		this.user = {
			username: this.username,
			id: this.$socket.client.id
		};

		if (this.game.mode == "hard") {
			this.speed = 500;
		}

		this.user =
			this.game.player1.id == this.$socket.client.id
				? this.game.player1
                : this.game.player2;
                
		this.challenger =
			this.game.player1.id == this.$socket.client.id
				? this.game.player2
				: this.game.player1;
	},
	methods: {
		backToLobby() {
			this.$store.commit("setGame", null);
			this.$router.push("/");
		},
		userPlay(note) {
			if (this.game.userTurn == this.user.username) {
				if (this.game.step == "guess") {
					this.userGuess(note);
				} else if (this.game.step == "add") {
					this.userAdd(note);
				}

				this.$socket.client.emit("move", this.game);
			}
		},
		userGuess(note) {
            let vm = this;
			this.guesses.push(note);
			this.play(note);

			let guessIndex = this.guesses.length - 1;

			if (this.game.melody.length == this.guesses.length) {
				this.submitGuess();
			} else if (this.guesses[guessIndex] != this.game.melody[guessIndex]) {
				vm.$store.dispatch('gameover', {
                    round: vm.game.round,
                    winner: vm.challenger.username,
                    loser: vm.user.username,
                    mode: vm.game.mode
                });
			}
		},
		userAdd(note) {
			this.play(note);

			// End turn, pass to challenger
			this.$store.dispatch("makeValidMove", note);
		},
		aiMove() {
            let vm = this;
			let randNum = Math.floor(Math.random() * 10);

			if (randNum > (this.game.mode == "hard" ? 9 : 5)) {
				vm.$store.dispatch('gameover', {
                    round: vm.game.round,
                    winner: vm.user.username,
                    loser: vm.challenger.username,
                    mode: vm.game.mode
                });
			} else {
				this.$store.dispatch("makeValidMove", this.getRandomNote());
			}
		},
		submitGuess() {
            let vm = this;
			let correct = true;

			this.game.melody.forEach((note, i) => {
				if (note != this.guesses[i]) {
					correct = false;
				}
			});

			correct
				? this.$store.commit("setStep", "add")
				: this.$store.dispatch('gameover', {
                        round: vm.game.round,
                        winner: vm.challenger.username,
                        loser: vm.user.username,
                        mode: vm.game.mode
                    });

			this.guesses = [];
		},
		play(note) {
			if (
				this.game.mode == "easy" ||
				["guess", "add"].includes(this.game.step)
			) {
				this.lightKey(note);
			}
			this.playSound(note);
		},
		playSound(note) {
			let audio = document.getElementById(note);

			audio.pause();
			audio.currentTime = 0;
			audio.play();
		},
		lightKey(note) {
			this.notes[note].lit = true;
			setTimeout(() => (this.notes[note].lit = false), 400);
		},
		listen() {
			this.playMelody(this.speed);
			this.$store.commit("setStep", null);

			setTimeout(() => {
				this.$store.commit("setStep", "guess");

				let timer = parseInt(
					(5000 + this.speed * this.game.melody.length * 2) / 1000
				);

				this.startTimer(timer);
			}, this.game.melody.length * this.speed + 1000);
		},
		startTimer(num) {
			let vm = this;
			vm.timer = num;

			let countdown = setInterval(function() {
				vm.timer = vm.timer - 1;

				if (!vm.game || vm.game.userTurn == vm.challenger.username || vm.game.step == 'add') {
					clearInterval(countdown);
				} else if (vm.timer < 1) {
                    clearInterval(countdown);
                    
                    vm.$store.dispatch('gameover', {
                        round: vm.game.round,
                        winner: vm.challenger.username,
                        loser: vm.user.username,
                        mode: vm.game.mode
                    });
				}
			}, 1000);
		},
		getRandomNote() {
			let notes = ["c", "d", "e", "f", "g", "a", "b", "c2"];
			let randIndex = Math.floor(Math.random() * 8);
			return notes[randIndex];
		},
		playMelody(speed) {
			let x = 0;

			let intervalId = setInterval(() => {
				if (!this.game.melody[x]) {
					clearInterval(intervalId);
				} else {
					this.play(this.game.melody[x]);
				}

				x++;
			}, speed);
		}
	}
};
</script>

<style lang="scss">
@import "./../styles/variables.scss";

.game {
	.game-container {
		padding: 40px;

		div.timer {
			position: absolute;
			left: 30px;
			top: 30px;
			color: $color8;
			font-weight: 800;
			font-size: 32px;
		}

		h1 {
			margin-bottom: 30px;
			font-size: 24px;
			line-height: 20px;
			font-weight: 200;

			strong {
				color: $color7;
				font-weight: 600;
				font-size: 48px;
			}
		}

		h5 {
			letter-spacing: 2px;
			font-weight: 900;
			padding: 0;
			text-transform: uppercase;
			color: $primary;
			margin: 0;

			&.gameover {
				color: $color8;
				margin-bottom: 15px;
			}

			&.winner {
				color: $color3;
				margin-bottom: 15px;
			}
		}

		p.move {
			font-weight: 900;

			&.hide {
				visibility: hidden;
			}

			span {
				color: $color3;
				&.enemy {
					color: $color8;
				}
			}
		}

		div.spinner {
			margin: 30px auto 0;
			.cube1 {
				background-color: $color3 !important;
			}
			.cube2 {
				background-color: $color8 !important;
			}
		}

		svg {
			margin: 30px auto;
		}

		button {
			&.ai {
				position: absolute;
				top: 15px;
				left: 15px;
			}
			font-weight: 600;
			letter-spacing: 1px;
			margin-top: 10px;
			background: $color3;
			color: #fff;
			text-transform: uppercase;
			transition: 0.3s ease;

			&:hover {
				background: $color7;
			}
		}

		h3 {
			visibility: hidden;

			&.show {
				visibility: visible;
			}
		}

		h1,
		h3,
		h4,
		p {
			transition: 0.3s ease-in-out;
		}
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.fade2-enter-active,
.fade2-leave-active {
	transition: opacity 0.5s;
	transition-delay: 0.5s;
}

.fade2-enter, .fade2-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.gameover-enter-active,
.gameover-leave-active {
	transition: opacity 3s;
}

.gameover-enter,
.gameover-leave-to {
	opacity: 0;
}
</style>
