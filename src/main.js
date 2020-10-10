import Vue from 'vue'
import { Bus } from './lib/bus'
import Logo from './components/Logo'
import TheTableOfContents from './components/TheTableOfContents'
import TheMobileMenu from './components/TheMobileMenu'
import TheSearchInput from './components/search/TheSearchInput'
import TheSearchResults from './components/search/TheSearchResults'
import 'lazysizes'

Vue.component('Logo', Logo)
Vue.component('TheTableOfContents', TheTableOfContents)
Vue.component('TheMobileMenu', TheMobileMenu)
Vue.component('TheSearchInput', TheSearchInput)
Vue.component('TheSearchResults', TheSearchResults)

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
