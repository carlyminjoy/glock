<template>
    <div class="message" :class="{'enemy' : enemy, 'user' : !enemy }">
        <span class="date">{{ message.author.toUpperCase() }} - {{ message.datetime | moment('H:mm A') }}</span>
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
  font-size: 14px;
  text-align: left;
  padding: 5px 15px 10px 15px;
  margin: 10px 0;
  @extend %boxshadow;
  width:fit-content;

  &.user {
    border-radius: 10px 10px 0 10px;
    margin: 10px 0 10px auto;
    background: $color3;
    // background: linear-gradient(180deg, #43f5e1 0%, $color3 40%);
  }

  &.enemy {
    margin-left: 0;
    margin-right: 30px;
    border-radius: 10px 10px 10px 0;
    align-self:left;
    background: #eee;
    // background: linear-gradient(180deg, #0197fc 0%, $color5 40%);
    // color: #eee;

    p {
      text-transform: lowercase;
    }
  }

  p {
    margin: 0;
    word-break:break-all;
    line-height:18px;
  }

    span.date {
        font-size: 8px;
        letter-spacing: 1px;
        font-weight: 600;

  }
}
</style>
