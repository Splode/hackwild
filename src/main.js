import Vue from 'vue'
import Logo from './components/Logo.vue'

require('bootstrap-nucleus')
require('./../static/dracula.css')
require('./assets/stylesheets/main.scss')

Vue.component('logo', Logo)

/* eslint-disable no-new */
new Vue({
  el: '#app'
})
