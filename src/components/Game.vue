<template>
  <div class="game">
    <h1>Glock</h1>

    <svg width="800" height="350">
      <rect
        class="key c"
        @click="addToMelody('c')"
        x="0"
        y="10"
        height="350"
        style="fill:#FF8484;"
      />
      <rect class="key d" @click="addToMelody('d')" x="100" height="335" style="fill:#861388;" />
      <rect class="key e" @click="addToMelody('e')" x="200" height="320" style="fill:#4DCCBD;" />
      <rect class="key f" @click="addToMelody('f')" x="300" height="305" style="fill:#231651;" />
      <rect class="key g" @click="addToMelody('g')" x="400" height="290" style="fill:#2374AB;" />
      <rect class="key a" @click="addToMelody('a')" x="500" height="275" style="fill:#FFE74C;" />
      <rect class="key b" @click="addToMelody('b')" x="600" height="260" style="fill:#FF5964;" />
      <rect class="key c2" @click="addToMelody('c2')" x="700" height="245" style="fill:#A30B37;" />
    </svg>

    <div class="actions">
      <button @click="playMelody(500)">Play</button>
      <button @click="clearMelody()">Clear</button>
      <button @click="createMelody(1000,8)">Random Melody</button>
    </div>

    <audio id="c" preload="auto">
      <source src="c.wav" type="audio/wav" />
    </audio>
    <audio id="d" preload="auto">
      <source src="d.wav" type="audio/wav" />
    </audio>
    <audio id="e" preload="auto">
      <source src="e.wav" type="audio/wav" />
    </audio>
    <audio id="f" preload="auto">
      <source src="f.wav" type="audio/wav" />
    </audio>
    <audio id="g" preload="auto">
      <source src="g.wav" type="audio/wav" />
    </audio>
    <audio id="a" preload="auto">
      <source src="a.wav" type="audio/wav" />
    </audio>
    <audio id="b" preload="auto">
      <source src="b.wav" type="audio/wav" />
    </audio>
    <audio id="c2" preload="auto">
      <source src="c2.wav" type="audio/wav" />
    </audio>
  </div>
</template>

<script>
export default {
  props: {
    msg: String
  },
  data() {
    return {
      melody: [],
      keys: ["c", "d", "e", "f", "g", "a", "b", "c2"]
    };
  },
  methods: {
    addToMelody(note) {
      this.melody.push(note);
      this.playSound(note);
    },
    playSound(note) {
      let audio = document.getElementById(note);

      audio.pause();
      audio.currentTime = 0;
      audio.play();

      this.lightKey(note)

    },
    lightKey(note) {
        let key = document.querySelector(`.key.${note}`);
      let color = key.getAttribute("style");
      key.setAttribute("style", "fill:#CED3DC");
      setTimeout(() => key.setAttribute("style", color), 500);
    },
    createMelody(speed, count) {
      this.melody = [];

      for (let i = 0; i < count; i++) {
        let randIndex = Math.floor(Math.random() * 8);
        this.melody.push(this.keys[randIndex]);
      }

      this.playMelody(speed);
    },
    clearMelody() {
      this.melody = [];
    },
    playMelody(speed) {
      let x = 0;

      let intervalId = setInterval(() => {
        if (!this.melody[x]) {
          clearInterval(intervalId);
        } else {
          this.playSound(this.melody[x]);
        }

        x++;
      }, speed);
    }
  },
  mounted() {
    let keys = document.querySelectorAll(".key");

    keys.forEach(k => {
      k.setAttribute("y", "0");
      k.setAttribute("rx", "20");
      k.setAttribute("ry", "20");
      k.setAttribute("width", "80");
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div.game {

    cursor: url("https://cdn.imgbin.com/13/17/18/imgbin-percussion-mallet-glockenspiel-drum-stick-xylophone-drum-stick-sVpUBXmd4ja6qqG77z1GyW1cx_t.jpg"), auto;
}
svg {

    .key {
        width: 90px;
        transition: 0.2s ease-in-out;
    }
}
</style>
