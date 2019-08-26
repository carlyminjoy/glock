<template>
  <div class="message" :class="{'enemy' : enemy }">
    <p class="author">
      <span class="date">{{ message.datetime | moment('H:mm A') }}</span>
      <br />
      {{message.author }}
    </p>
    <p>{{ message.message }}</p>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    message: {
      type: Object
    },
    enemy: {
      type: Boolean
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang='scss'>
@import "./../styles/variables.scss";

.message {
  /* background: lightblue; */
  background: $color3;
  border-radius: 4px 4px 0 4px;
  font-size: 14px;
  text-align: left;
  padding: 10px 15px;
  margin: 10px 0;
  margin-left: 30px;

  &.enemy {
    margin-left: 0;
    margin-right: 30px;
    background: #eee;
    border-radius: 4px 4px 4px 0;

    p {
      text-transform: lowercase;
    }
  }

  p {
    margin: 0;

    &.author {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 800;
      padding-bottom: 4px;
      margin-bottom: 4px;
      // color: lightslategray;

      & > span.date {
        font-size: 8px;
        font-weight: 400;
      }
    }
  }
}
</style>
