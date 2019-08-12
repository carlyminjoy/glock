<template>
  <rect
    class="key"
    @click="play()"
    :id="'note-' + id"
    :x="x"
    :y="y"
    :rx="rx"
    :ry="ry"
    :width="width"
    :height="height"
    :style="'fill:' + color"
  ></rect>
</template>

<script>
export default {
  props: {
    id: String,
    note: Object
  },
  computed: {
    color() {
      return this.note.lit ? "silver" : this.note.color;
    }
  },
  data() {
    return {
      x: null,
      y: 0,
      rx: 20,
      ry: 20,
      height: null,
      width: 60
    };
  },
  methods: {
    play() {
      this.$emit("play", this.id);
    }
  },
  mounted() {
    this.x = this.note.order * 70;
    this.height = 300 - this.note.order * 15;
  }
};
</script>

<style scoped lang='scss'>
.key {
  /* width: 90px; */
  transition: 0.2s ease-in-out;

  &.lit {
    fill: #555;
  }
}
</style>