<template>
  <div :class="classes">
  <svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px" y="0px" viewBox="0 0 422.1 329.5" xml:space="preserve" :width="width" :height="height">
    <g>
      <path stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M108.2,262.6L220,39h0c-44.1,0-84.5,24.9-104.2,64.4L4,327h0
		C48.2,327,88.5,302.1,108.2,262.6z" />
      <path stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M306.2,226.1L418,2.5h0c-44.1,0-84.5,24.9-104.2,64.4L202,290.5
		h0C246.2,290.5,286.5,265.6,306.2,226.1z" />
    </g>
  </svg>
</div>
</template>

<script>
export default {
  name: 'Logo',

  props: {
    classes: {
      type: Array,
      required: false
    },
    width: {
      type: String,
      default: '50',
      required: false
    },
    height: {
      type: String,
      default: '50',
      required: false
    }
  }
}
</script>

<style>
</style>
