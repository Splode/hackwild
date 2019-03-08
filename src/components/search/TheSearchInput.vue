<template>
  <div class="SearchInput-wrapper">
    <input
      aria-label="Search articles by key term"
      type="text"
      class="SearchInput-input"
      v-model="query"
      @keyup="emitQuerySearch"
    >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#accdd2"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="SearchInput-icon"
    >
      <circle
        cx="11"
        cy="11"
        r="8"
      ></circle>
      <line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
      ></line>
    </svg>
  </div>
</template>

<script>
import { Bus } from './../../lib/bus'

export default {
  name: 'TheSearchInput',

  data() {
    return {
      query: ''
    }
  },

  methods: {
    emitQuerySearch(e) {
      Bus.$emit('query-updated', { query: e.target.value })
    }
  },

  mounted() {
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
  justify-content: flex-end;
}

.SearchInput-icon {
  margin-left: 0.5rem;
}

.SearchInput-input {
  background-color: #354258;
  border: 0;
  border-radius: 4px;
  color: #61ffab;
  margin-left: 1rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.3s cubic-bezier(0.07, 0.95, 0, 1);
  width: 25%;
  &:focus {
    width: 75%;
  }
  @media screen and (min-width: 768px) {
    width: 100%;
    &:focus {
      width: 100%;
    }
  }
}
</style>
