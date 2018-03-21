import Vue from 'vue'
import Logo from './components/Logo.vue'
import TheSearchInput from './components/search/TheSearchInput.vue'
import TheSearchResults from './components/search/TheSearchResults.vue'

// require('./../css/main.scss')
// require('bootstrap-nucleus')

Vue.component('logo', Logo)
Vue.component('theSearchInput', TheSearchInput)
Vue.component('theSearchResults', TheSearchResults)

/* eslint-disable no-new */
new Vue({
  el: '#app'
})
