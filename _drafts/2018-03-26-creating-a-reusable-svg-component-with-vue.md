---
layout: post
title: Creating a Reusable SVG Component with Vue
excerpt: >
  Using SVG images for vector-based assets can help to significantly shed page weight. SVG images can be sized up and down without sacrificing image quality. Individual elements, such as fill and stroke properties, can even be programmatically controlled.
tags: Vue SVG templating JavaScript
---

Using SVG images for vector-based assets can help to significantly shed page weight. SVG images can be sized up and down without sacrificing image quality. Individual elements, such as fill and stroke properties, can even be programmatically controlled and animated.

Inlining SVG elements is the most robust approach, but for complex images the code can be a messy tangle to work with. Using inline SVGs in multiple places might require copy and pasting great chunks of code, which can quickly become difficult to manage and pollute an otherwise clean code base.

A solution for this is to use Vue components to wrap the SVG inline code. This allows you to separate the inline SVG code from the rest of your application templates. Even better, we can pass in props in order to extend and configure our SVG to suit our needs.

## Creating the SVG Component

In this example, I'll use the HackWild SVG logo developed for this site, though any properly formatted SVG will work. We'll start by creating a Vue single-file component, `svgComp.vue` and scaffold it with the basic structure:

> Note: it's a good idea to name this component in a way that makes sense for your application. Check out the [official Vue style guide](https://vuejs.org/v2/style-guide/) for best practices.

#### Logo.vue

```html
<template>
 <div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    baseProfile="tiny" version="1.2"
    viewBox="0 0 422.1 329.5">
    <path
      stroke-width="5"
      stroke-miterlimit="10"
      d="M108.2 262.6L220 39c-44.1 0-84.5 24.9-104.2 64.4L4 327c44.2 0 84.5-24.9 104.2-64.4zM306.2 226.1L418 2.5c-44.1 0-84.5 24.9-104.2 64.4L202 290.5c44.2 0 84.5-24.9 104.2-64.4z"/>
  </svg>
 </div>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style lang="css" scoped>

</style>
```

We've wrapped our SVG element in a `<div>` container. This is optional and will allow us some styling flexibility, but the `<svg>` element itself can be used as the root template element.

### Register and Mount

Now that we have our SVG component, we'll register it in our primary `App` component. We can then mount it anywhere in our application where we've declared it using `<Logo/>`.

#### App.vue

```html
<template>
  <div id="app">
    <Logo/>
  </div>
</template>

<script>
import Logo from "./components/Logo"

export default {
  name: 'App',

  components: {
    Logo
  }
}
</script>
```

## Controlling Styles with Props

At this point, our SVG component displays default fill and stroke colors (black) and will expand or contract in size to fill its parent container. To gain control over these properties, let's create some basic props in our component.

### SVG Size

To control the overall size, we'll set the `:width` attribute on the `<svg>` to equal a prop, `width`. In this case, we're setting the `:height` attribute to also equal the `width` prop because we always want to maintain a square aspect ratio for the logo. We'll also bind the `:stroke-width` attribute on the `<path>` element to equal the `strokeWidth` prop.

> It's import to note that Vue will transform camel-cased values set in `<script>` tags to kebab-cased values in the `<template>` in order to follow the HTML attribute convention. For example, the prop `strokeWidth` will correlate with `:stroke-width` attribute. 

We'll set the `width` and `strokeWidth` props to be of the type `Number` (the numeric values passed into the attributes for `<svg>` elements will default to pixels). We'll provide a default `width` value of `50`, a default `strokeWidth` value of `5` and explicitly state that these props are not required.

### SVG Fill and Stroke Colors

To control the fill and stroke colors of our SVG component, we'll define several classes in our `<style>` section:  `.white`, `.green` and `.green--outline`. We can then bind the `:class` attribute on the `<path>` element to the `color` prop. The `color` prop will be of a type `String`, have a default value of `white` and a won't be required. 

#### Logo.vue

```html
<template>
 <div>
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
 </div>
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

<style lang="css" scoped>
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
```

### Passing Props

## Interactive Demo

You can edit and view the source for this project at [CodeSandbox](https://codesandbox.io/s/p795vp4x7x).

## Closing Thoughts

SVG images are incredibly flexible and lightweight.
