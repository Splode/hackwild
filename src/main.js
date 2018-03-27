import Vue from 'vue'
import { Bus } from './lib/bus'
import Logo from './components/Logo.vue'
import TheMobileMenu from './components/TheMobileMenu'
import TheSearchInput from './components/search/TheSearchInput.vue'
import TheSearchResults from './components/search/TheSearchResults.vue'

Vue.component('logo', Logo)
Vue.component('theMobileMenu', TheMobileMenu)
Vue.component('theSearchInput', TheSearchInput)
Vue.component('theSearchResults', TheSearchResults)

/* eslint-disable no-new */
new Vue({
  name: 'VueRoot',

  el: '#app',

  data () {
    return {
      menuOpen: false,
      searchOpen: false
    }
  },

  mounted () {
    Bus.$on('menu-toggled', () => {
      this.menuOpen = !this.menuOpen
    })
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
