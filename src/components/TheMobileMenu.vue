<template>
  <div class="Hamburger-wrapper">
    <div
      class="Hamburger"
      @click="menuController"
    >
      <div
        class="Hamburger-bar"
        :class="menuClass"
      />
      <div
        class="Hamburger-bar"
        :class="menuClass"
      />
    </div>
  </div>
</template>

<script>
import { Bus } from './../lib/bus'

export default {
  name: 'TheMobileMenu',

  data () {
    return {
      menuIsOpen: false
    }
  },

  computed: {
    menuClass () {
      return {
        'is-open': this.menuIsOpen,
        'is-closed': !this.menuIsOpen
      }
    }
  },

  methods: {
    menuController () {
      this.menuIsOpen = !this.menuIsOpen
      Bus.$emit('menu-toggled')
    }
  }
}
</script>

<style lang="scss" scoped>
.Hamburger-wrapper {
  height: 100%;
}

.Hamburger {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.Hamburger-bar {
  background-color: #6ba7b4;
  width: 25px;
  height: 2px;
  transition: all 0.3s cubic-bezier(0.07, 0.95, 0, 1);
  &.is-open:first-child {
    background-color: #61ffab;
    margin-bottom: 6px;
    transform: rotate(45deg) translateY(6px);
  }
  &.is-open:last-child {
    background-color: #61ffab;
    transform: rotate(-45deg) translateY(-6px);
  }
  &.is-closed:first-child {
    margin-bottom: 6px;
    transform: rotate(0) translate(0);
  }
  &.is-closed:last-child {
    transform: rotate(0) translate(0);
  }
}
</style>
