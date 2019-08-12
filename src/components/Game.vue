<template>
  <div class="game">
    <h1>Melody makers</h1>

    <svg width="800" height="350">
      <key
        v-for="(settings, note) in notes"
        v-on:play="userPlaysNote"
        :id="note"
        :key="note"
        :note="settings"
      />
    </svg>

    <div class="actions">
      <button v-if="!status.gameStarted" @click="startGame()">Go</button>
      <button v-if="status.melodyReady && status.gameStarted" @click="listen()">Listen</button>
    </div>

    <h3>{{ status.message }}</h3>

    <audio v-for="(settings, note) in notes" :id="note" preload="auto" :key="note">
      <source :src="settings.sound" type="audio/wav" />
    </audio>
  </div>
</template>

<script>
import { default as Key } from "./Key";
import { default as notes } from "./../config/notes";

export default {
  props: {
    msg: String
  },
  components: {
    Key
  },
  data() {
    return {
      melody: [],
      guesses: [],
      notes: notes,
      status: {
        message: "Ready?",
        gameStarted: false,
        melodyReady: false,
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

        this.status.message =
          "Okay, here's the new melody! Waiting for Player 2 ...";
        this.playMelody(1000);

        // AI makes a move
        setTimeout(() => {
          this.aiMove(), 10000;
        });
      }
    },
    aiMove() {
      this.melody.push(this.getRandomNote());
      this.clearGuesses();
      this.status.message = "Your turn!";
      this.status.melodyReady = true;
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
        this.status.message = "Too bad! Game over :(";
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
      this.status.gameStarted = false;
      this.status.listening = false;
      this.status.guessing = false;
      this.status.adding = false;
      this.status.gameOver = false;
      this.status.message = "Ready?";
    },
    startGame() {
      this.status.gameStarted = true;
      // Run AI until 2-player option available
      this.createMelody(1000, 4);
    },
    createMelody(speed, count) {
      this.reset();
      this.status.message = "Listen and repeat.";

      for (let i = 0; i < count; i++) {
        this.melody.push(this.getRandomNote());
      }

      this.status.melodyReady = true;
      console.log(this.melody);
    },
    listen() {
      this.status.listening = true;
      this.status.melodyReady = false;
      this.playMelody(1000);
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div.game {
  cursor: url("https://cdn.imgbin.com/13/17/18/imgbin-percussion-mallet-glockenspiel-drum-stick-xylophone-drum-stick-sVpUBXmd4ja6qqG77z1GyW1cx_t.jpg"),
    auto;
}
button {
  padding: 10px 15px;
  margin: 10px;
  font-size: 16px;
  background: #eee;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 4px;
}
</style>
