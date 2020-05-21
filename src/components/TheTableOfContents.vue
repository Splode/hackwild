<template>
  <aside class="col-lg-3 d-lg-block d-none">
    <div class="position-sticky">
      <h3 class="font-weight-normal">Contents</h3>
      <ul class="p-0">
        <li
          class="mb-2"
          @click="jumpToIntro"
        >Intro</li>
        <li
          v-for="(heading, i) in headings"
          :key="`heading-${i}`"
          class="mb-2"
          @click="jumpToSection(i)"
        >{{ heading.innerText }}</li>
      </ul>
    </div>
  </aside>
</template>

<script>
import jump from 'jump.js'

export default {
  name: 'TheTableOfContents',

  data() {
    return {
      headings: []
    }
  },

  methods: {
    jumpToIntro() {
      jump('#article-title', {
        offset: -80
      })
    },

    jumpToSection(headingIndex) {
      const id = this.headings[headingIndex].id
      jump(`#${id}`, {
        offset: -100
      })
    }
  },

  mounted() {
    const article = document.getElementsByTagName('article')[0]
    const headings = article.querySelectorAll('h2')
    headings.forEach(el => this.headings.push(el))
  }
}
</script>

<style lang="scss" scoped>
div {
  top: 125px;
  & ul {
    color: #ee78bf;
    cursor: pointer;
    list-style-type: none;
  }
}
</style>
