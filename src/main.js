import Vue from 'vue'
import { Bus } from './lib/bus'
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
  name: 'VueRoot',

  el: '#app',

  data () {
    return {
      searchOpen: false
    }
  },

  mounted () {
    Bus.$on('query-cleared', () => {
      this.searchOpen = false
    })
    Bus.$on('query-updated', payload => {
      if (payload.query === '') {
        this.searchOpen = false
      } else {
        this.searchOpen = true
      }
    })
  }
})
