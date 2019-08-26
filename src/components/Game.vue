<template>
	<div class="game">
		<div class="game-container">
			<h1>glockenspiel says</h1>
			<h5>Round {{ game.round }}</h5>
			<p :class="{'hide' : game.winner}" class='move'>
				<span :class="{ 'enemy' : game.userTurn == challenger }"> {{ game.userTurn }}'s move</span>
			</p>

			<svg width="600" height="300">
				<key
					v-for="(settings, note) in notes"
					v-on:play="userPlaysNote"
					:id="note"
					:key="note"
					:note="settings"
				/>
			</svg>

				<p v-if='!game.winner'>
					<span v-if='game.userTurn != username'>Nice moves. Waiting on {{ challenger }} ... </span>

					<span v-else>

						<span v-if='game.step == "listen"'>
							<span v-if='game.round != 1'>{{ challenger }} has made a move.</span>
						</span>

						<span v-else-if='game.step == "add"'>

							<span v-if='game.round == 1'>Add the first note.</span>
							<span v-else>Add another note.</span>

						</span>

						<span v-else-if='game.step == "guess"'>

							Now play it back.

						</span>

					</span>
				</p>

				<spinner v-if="game.userTurn != username"></spinner>
				
				<template v-if="game.winner">
					<h5 class='gameover'>GAMEOVER</h5>
					<p>
						<strong>{{ game.winner }} wins.</strong>
					</p>
				</template>
				<div class="actions">
					<button class="btn" v-if="game.userTurn == username && game.step == 'listen'" @click="listen()">Listen</button>
				</div>

			<audio v-for="(settings, note) in notes" :id="note" preload="auto" :key="note">
				<source :src="settings.sound" type="audio/wav" />
			</audio>
		</div>
	</div>
</template>

<script>

import { default as Key } from "./Key";
import { default as notes } from "./../config/notes";
import { default as Spinner } from "./../../node_modules/vue-spinners/src/components/CubeSpinner";
import { setTimeout } from 'timers';

export default {
	props: {
		game: {
			type: Object
		},
		username: {
			type: String
		}
	},
	components: {
		Key,
		Spinner
	},
	data() {
		return {
			guesses: [],
			notes: notes,
			challenger: null
		}
	},
	mounted() {
		console.log(this.game)
		this.challenger = this.game.player1 == this.username ? this.game.player2 : this.game.player1
	},
	computed: {
		step() {
			return this.game.step
		}
	},
	watch: {
		step(next, prev) {
			console.log(next)
		}
	},
	methods: {
		userPlaysNote(note) {
			if (this.game.userTurn == this.username) {

				if (this.game.step == 'guess') {

					this.guesses.push(note);
					this.play(note);
	
					if (this.game.melody.length == this.guesses.length) {
						this.submitGuess();
					}
				} else if (this.game.step == 'add') {
					this.game.melody.push(note);
					this.play(note);

					// End turn, pass to challenger
					this.game.userTurn = this.challenger;
					this.game.round++;
					this.game.step = 'listen';

					// AI makes a move
					this.aiMove(this.game.melody.length * 2000);
				}
			}
		},
		aiMove(delay) {
			setTimeout(() => {
				this.game.melody.push(this.getRandomNote());
				this.game.userTurn = this.username;
				this.game.step = 'listen';
			}, delay);
		},
		submitGuess() {
			let correct = true;

			this.game.melody.forEach((note, i) => {
				if (note != this.guesses[i]) {
					correct = false;
				}
			});

			correct
				? this.game.step = 'add'
				: this.game.winner = this.challenger;
			
			this.guesses = [];
		},
		play(note) {
			this.lightKey(note);
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
		reset() {
			this.clearMelody();
			this.clearGuesses();
		},
		listen() {
			this.playMelody(1000);
			this.game.step = null;

			setTimeout(() => {
				this.game.step = 'guess';
			}, this.game.melody.length * 1000 + 1000)
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

		h1 {
			margin-bottom: 45px;
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
		}

		p.move {
			font-weight: 900;

			&.hide {
				visibility:hidden;
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
			font-weight: 600;
			letter-spacing: 1px;
			margin-top: 15px;
			background: $color3;
			color: #fff;
			text-transform: uppercase;
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

.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
}

.fade2-enter-active, .fade2-leave-active {
		transition: opacity .5s;
		transition-delay: 1s;
}

.fade2-enter, .fade2-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
}

</style>
