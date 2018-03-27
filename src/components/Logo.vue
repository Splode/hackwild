<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    baseProfile="tiny" 
    version="1.2" 
    viewBox="0 0 422.1 329.5"
    :width="width"
    :height="width"
  >
    <path 
      :class="color"
      :stroke-width="strokeWidth"
      stroke-miterlimit="10"
      d="M108.2 262.6L220 39c-44.1 0-84.5 24.9-104.2 64.4L4 327c44.2 0 84.5-24.9 104.2-64.4zM306.2 226.1L418 2.5c-44.1 0-84.5 24.9-104.2 64.4L202 290.5c44.2 0 84.5-24.9 104.2-64.4z"
    />
  </svg>
</template>

<script>
export default {
  name: 'Logo',

  props: {
    color: {
      type: String,
      default: 'white', // white, green, green--outline
      required: false
    },
    strokeWidth: {
      type: Number,
      default: 5,
      required: false
    },
    width: {
      type: Number,
      default: 50,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.green {
  fill: #61ffab;
  stroke: none;
}

.green--outline {
  fill: #354258;
  stroke: #61ffab;
}

.white {
  fill: mintcream;
  stroke: none;
}
</style>
