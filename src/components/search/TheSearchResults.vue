<template>
  <div class="row" v-if="filteredPosts.length > 0" :class="classes">
    <div class="col-md-8 mx-auto text-center">
      <h2>Search Results for <span>{{ query }}</span></h2>
      <p>Clear</p>
    </div>
    <div class="col-12 PostPreview" v-for="(post, i) in filteredPosts" :key="i">
      <a :href="post.url">
        <h2 class="PostPreview-title PostPreview-title--condensed">{{ post.title }}</h2>
        <div class="PostPreview-footer">
          <p class="PostPreview-body PostPreview-body--condensed">{{ post.date }}</p>
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

  props: {
    classes: {
      type: Array,
      required: false
    }
  },

  data () {
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
        return post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
      })
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
      this.query = payload.query
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
