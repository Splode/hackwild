import Vue from 'vue'
import Logo from './components/Logo.vue'

// require('./../css/main.scss')
// require('bootstrap-nucleus')

Vue.component('logo', Logo)

const app = new Vue({
  el: '#app'
})
