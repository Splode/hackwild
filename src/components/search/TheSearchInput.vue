<template>
  <div class="SearchInput-wrapper">
    <input type="text" class="SearchInput-input" v-model="query" @keyup="emitQuerySearch">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6BA7B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="SearchInput-icon">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </div>
</template>

<script>
import { Bus } from './../../lib/bus'

export default {
  name: 'TheSearchInput',

  data () {
    return {
      query: ''
    }
  },

  methods: {
    emitQuerySearch (e) {
      Bus.$emit('query-updated', { query: e.target.value })
    }
  },

  mounted () {
    Bus.$on('query-cleared', () => {
      this.query = ''
    })
  }
}
</script>

<style lang="scss" scoped>
.SearchInput-wrapper {
  align-items: center;
  display: flex;
}

.SearchInput-icon {
  margin-left: .5rem;
}

.SearchInput-input {
  background-color: #354258;
  border: 0;
  border-radius: 4px;
  color: #61ffab;
  margin-left: 1rem;
  padding: .25rem .5rem;
}
</style>
