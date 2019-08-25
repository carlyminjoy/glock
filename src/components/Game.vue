<template>
  <div class="game">
    <div class="game-container">
      <h1>Mel-o-die</h1>
      <h3 :class="{'show' : status.gameStarted }">Round: {{ status.currentRound }}</h3>

      <svg width="600" height="300">
        <key
          v-for="(settings, note) in notes"
          v-on:play="userPlaysNote"
          :id="note"
          :key="note"
          :note="settings"
        />
      </svg>

      <p>{{ status.message }}</p>
      <spinner v-if="status.waiting"></spinner>

      <template v-if="status.gameOver">
        <h4>G A M E O V E R</h4>
        <p>
          <strong>{{ status.winner }} wins.</strong>
        </p>
        <br />
        <p>
          You made it to round
          <strong>{{ status.currentRound }}</strong>! Try again?
        </p>
      </template>

      <div class="actions">
        <button class="btn" v-if="!status.gameStarted || status.gameOver" @click="startGame()">Go</button>
        <button class="btn" v-if="status.melodyReady && status.gameStarted" @click="listen()">Listen</button>
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

export default {
  props: {
    msg: String
  },
  components: {
    Key,
    Spinner
  },
  data() {
    return {
      melody: [],
      guesses: [],
      notes: notes,
      status: {
        message: "",
        gameStarted: false,
        currentRound: 1,
        melodyReady: false,
        waiting: false,
        listening: false,
        guessing: false,
        adding: false,
        gameOver: false
      }
    };
  },
  methods: {
    userPlaysNote(note) {
      if (this.status.guessing) {
        this.guesses.push(note);
        this.play(note);

        if (this.melody.length == this.guesses.length) {
          this.status.guessing = false;
          this.submitGuess();
        }
      } else if (this.status.adding) {
        this.melody.push(note);
        this.play(note);
        this.status.adding = false;
        this.status.waiting = true;
        this.status.currentRound++;

        this.status.message = `Okay, here's the new melody! Waiting for ${this.status.playerTwo} ...`;
        this.playMelody(1000);

        // AI makes a move
        this.aiMove(this.melody.length * 2000);
      }
    },
    aiMove(delay) {
      setTimeout(() => {
        this.melody.push(this.getRandomNote());
        this.clearGuesses();
        this.status.message = `${this.status.playerTwo} has made a move - your turn!`;
        this.status.melodyReady = true;
        this.status.waiting = false;
      }, delay);
    },
    submitGuess() {
      let correct = true;

      this.melody.forEach((note, i) => {
        if (note != this.guesses[i]) {
          correct = false;
        }
      });

      if (correct) {
        this.status.adding = true;
        this.status.message = "Nice! Now add another note.";
      } else {
        this.status.gameOver = true;
        this.status.winner = this.status.playerTwo;
        this.status.message = "";
      }
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
    clearStatus() {
      this.status.melodyReady = false;
      this.status.currentRound = 1;
      this.status.gameStarted = false;
      this.status.listening = false;
      this.status.guessing = false;
      this.status.adding = false;
      this.status.gameOver = false;
      this.status.waiting = false;
      this.status.winner = null;
      this.status.playerTwo = "Buddy";
      //   this.status.message = "";
    },
    startGame() {
      this.clearMelody();
      this.clearGuesses();
      this.clearStatus();

      this.status.gameStarted = true;
      this.status.message =
        "Click to listen to the melody. Listen carefully, as you'll have to repeat it.";
      // Run AI until 2-player option available
      this.createMelody(1000, 1);
    },
    createMelody(speed, count) {
      this.reset();

      for (let i = 0; i < count; i++) {
        this.melody.push(this.getRandomNote());
      }

      this.status.melodyReady = true;
    },
    listen() {
      //     let timer = 30;
      // this.setTimeout(() => {
      //     this.status.timer = timer;
      //     timer--;
      // }, 1000)
      this.status.listening = true;
      this.status.melodyReady = false;
      this.playMelody(1000);
      this.status.message = "Listen and repeat.";
    },
    getRandomNote() {
      let notes = ["c", "d", "e", "f", "g", "a", "b", "c2"];
      let randIndex = Math.floor(Math.random() * 8);
      return notes[randIndex];
    },
    clearMelody() {
      this.melody = [];
    },
    clearGuesses() {
      this.guesses = [];
    },
    playMelody(speed) {
      let x = 0;

      let intervalId = setInterval(() => {
        if (!this.melody[x]) {
          clearInterval(intervalId);
        } else {
          this.play(this.melody[x]);
        }

        x++;
      }, speed);

      if (this.status.listening) {
        setTimeout(() => {
          this.status.message = "Now play it back!";
          this.status.listening = false;
          this.status.guessing = true;
        }, speed * this.melody.length);
      }
    }
  }
};
</script>

<style lang="scss">
@import "./../styles/variables.scss";

.game {
  .game-container {
    padding: 40px;

    div.spinner {
      margin: 20px auto;
      .cube1 {
        background-color: $color4 !important;
      }
      .cube2 {
        background-color: $color6 !important;
      }
    }

    svg {
      margin: 30px auto;
    }

    button {
      font-weight: 800;
      margin-top: 10px;
      background: $primary;
      color: #fff;
      text-transform: uppercase;
    }

    h3 {
      visibility: hidden;

      &.show {
        visibility: visible;
      }
    }

    h4 {
      color: $color8;
      font-weight: 800;
    }

    h1,
    h3,
    h4,
    p {
      transition: 0.3s ease-in-out;
    }
  }
}
</style>
