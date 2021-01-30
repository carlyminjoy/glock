import Vue from "vue";
import VueMeta from "vue-meta"
import App from "./App.vue";
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

const socket = io('https://beat-tha-glock.herokuapp.com')

Vue.use(VueSocketIOExt, socket)
Vue.use(require('vue-moment'))
Vue.use(VueMeta)

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
