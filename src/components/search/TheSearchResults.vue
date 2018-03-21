<template>
  <div class="row">
    <div class="col-md-8 mx-auto text-center">
      <h2 class="Search-title">Search Results for: <span class="Search-query">{{ query }}</span></h2>
      <p class="Button--inline Button--inline--blue" @click="emitQueryClear">Clear</p>
    </div>
    <div class="col-md-8 mx-auto Search-empty" v-if="filteredPosts.length === 0 && query !== ''">
      <h3 class="Search-empty-title">Nothing Found</h3>
    </div>
    <div class="col-12 PostPreview" v-for="(post, i) in filteredPosts" :key="i">
      <a :href="post.url">
        <h2 class="PostPreview-title PostPreview-title--condensed">{{ post.title }}</h2>
        <div class="PostPreview-footer">
          <p class="PostPreview-body PostPreview-body--condensed">{{ post.excerpt }}</p>
          <p class="PostPreview-tag">{{ post.tag }}</p>
        </div>
      </a>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import { Bus } from './../../lib/bus'

export default {
  name: 'TheSearchResults',

  data() {
    return {
      posts: [],
      query: ''
    }
  },

  computed: {
    filteredPosts () {
      if (this.query === '') {
        return []
      }
      const query = this.query.toLowerCase().trim()
      return this.posts.filter(post => {
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tag.toLowerCase().includes(query)
        )
      })
    }
  },

  methods: {
    emitQueryClear () {
      this.query = ''
      Bus.$emit('query-cleared')
    }
  },

  created () {
    axios
      .get('/data/posts.json')
      .then(response => {
        this.posts = response.data
      })
      .catch(e => {
        console.log(e)
      })
  },

  mounted () {
    Bus.$on('query-updated', payload => {
      console.log('call query update in search-results')
      this.query = payload.query
    })
  }
}
</script>

<style lang="scss" scoped>
.Search-title {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  letter-spacing: .015rem;
}

.Search-query {
  color: #ee78bf;
  font-family: 'IBMPlexSans' -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 300;
}

.Search-empty {
  background-color: #354258;
  border: 2px solid #607aa5; 
  border-radius: 4px;
  padding-top: 3rem;
  padding-bottom: 3rem;
  text-align: center;
}

.Search-empty-title {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  letter-spacing: .025rem;
}
</style>
