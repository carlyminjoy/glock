<template>
	<div class="game" v-if='game'>
		<div class="game-container">
			<h1>
				beat
				<br />the
				<br />
				<strong>glock</strong>
			</h1>

			<h5 class='round'>Round {{ game.round }}</h5>

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

            <div class='game-messages'>
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

                    </div>
                </transition>

                <div class="actions">
                    <button
                        class="btn"
                        v-if="game.userTurn == user.username && game.step == 'listen'"
                        @click="listen()"
                    >Listen</button>
                </div>
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
import axios from 'axios'; 

export default {
	components: {
		Key,
        Spinner
    },
	data() {
		return {
            game: null,
			guesses: [],
			notes: notes,
			challenger: null,
			user: null,
			speed: 1000,
			timer: 0
		};
	},
	computed: mapState(["username"]),
	sockets: {
		updateUsers(users) {
            let vm = this;
            console.log('users', users);
			let challengerDisconnected =
				users.filter(u => u.username == vm.challenger.username).length == 0;

			// if (challengerDisconnected) {
            //     vm.gameover(vm.user.username);
			// }
		}
	},
	created() {
        let vm = this;

        axios.get(`/api/game/${vm.$route.params.id}`)
            .catch(e => console.log("couldn't get game: " + e))
            .then(res => {
                vm.game = res.data;
                console.log('retrieved game', res);

                if (vm.game.mode == "hard") {
                    vm.speed = 500;
                }

                let player = vm.$route.params.player;
                if (player == 1) {
                    vm.user = vm.game.player1;
                    vm.challenger = vm.game.player2;
                } else {
                    vm.user = vm.game.player2;
                    vm.challenger = vm.game.player1;
                }

                if (!vm.$store.getters.username) {
                    vm.$store.commit('setUsername', vm.user.username)
                }
            })
	},
	methods: {
		backToLobby() {
			this.$router.push("/");
        },
        updateGame() {
            let vm = this;

            axios.post('/api/update', vm.game)
                .then(r => vm.$socket.client.emit("move", r.data))
                .catch(e => console.log("couldn't update game: " + e));
        },
		userPlay(note) {
			if (this.game.userTurn == this.user.username) {
				if (this.game.step == "guess") {
					this.userGuess(note);
				} else if (this.game.step == "add") {
					this.userAdd(note);
				}

                this.updateGame();
			}
		},
		userGuess(note) {
            let vm = this;
			vm.guesses.push(note);
			vm.play(note);

			let guessIndex = vm.guesses.length - 1;

			if (vm.game.melody.length == vm.guesses.length) {
                vm.game.step = 'add'
                vm.guesses = [];
			} else if (vm.guesses[guessIndex] != vm.game.melody[guessIndex]) {
                vm.game.winner = vm.challenger.username;
                vm.updateGame();
			}
		},
		userAdd(note) {
            this.play(note);
            this.makeValidMove(note);
        },
        switchUser() {
            this.game.userTurn = this.game.userTurn == this.game.player1.username 
                ? this.game.player2.username
                : this.game.player1.username;
        },
		aiMove() {
            let vm = this;
            vm.makeValidMove(this.getRandomNote());
        },
        makeValidMove(note) {
            this.game.melody.push(note);
            this.game.round++;
            this.game.step = 'listen';
            this.switchUser();
            this.updateGame();
        },
        gameover(winner) {
            this.game.winner = winner;
            this.updateGame();
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
			this.game.step = null;

			setTimeout(() => {
				this.game.step = 'guess';

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

				if (!(vm.game && vm.game.userTurn == vm.user.username && vm.game.step == 'guess')) {
					clearInterval(countdown);
				} else if (vm.timer < 1) {
                    clearInterval(countdown);

                    this.gameover(vm.challenger.username);
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
        padding: 60px;
        position:relative;

		div.timer {
			position: absolute;
			left: 60px;
			top: 60px;
            background: $color8;
            color: #fff;
            border-radius: 50%;
            padding: 5px 30px;
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
            
            &.round {
                position:absolute;
                top: 15px;
                right: 30px;
            }

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
				top: 60px;
				left: 60px;
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
