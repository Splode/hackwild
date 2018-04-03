---
layout: post
title: Jekyll Static Site Generation with Vue.js Single File Components - Part Two
description: Create a statically generated site with Jekyll with Vue Single File Components and webpack optimizations.
tags: Jekyll
category: Jekyll
---

> This is the second in a two-part series where we create a statically generated site with Jekyll integrated with a Vue.js workflow.

In the [first part]({% link _drafts/jekyll-vue-part-one.md %}) of this series we setup a Jekyll project and configured webpack to use Vue Single File Components (SFC). In this article, we'll finish integrating Jekyll with Vue and enhance our build process by implementing cache-control and 

## Integrating Vue and Jekyll

### Creating a Simple Vue Component

In our `src` directory, we'll create a `components` directory to house all of our application components. Within this folder, we'll create a simple `HelloWorld.vue` single file component and give it a basic scaffolding. We'll also add in an `<h1>` title, a component name, and a few styles:

#### HelloWorld.vue

```html
<template>
  <h1>Jekyll-Vue Template</h1>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>

<style scoped>
h1 {
  color: darkslategrey;
  font-size: 2rem;
}
</style>
```

### Register Vue Components

Now that we've created a Vue component, we'll need to register it with our primary Vue instance. We'll do this by importing the component in our `main.js` file. We also need to create a new Vue instance and give it an entry point. We'll use an id of `app` and update our Jekyll layout to reflect this shortly. Lastly, we'll attach the component to the Vue instance using the `component` method available on the Vue instance.

#### main.js

```js
import Vue from 'vue'
import HelloWorld from './components/HelloWorld'

Vue.component('helloWorld', HelloWorld)

const app = new Vue({
  el: '#app'
})
```

### Mounting Vue Components in Jekyll Pages

Mounting the Vue components in Jekyll `includes` and `layouts`.

## Enhancing our Webpack Build Process

### Installing and Configuring Babel

It can be very helpful to ES2015 language features when working with Vue and Babel makes this incredibly simple. Let's install the Babel transpiler so that any ES2015 syntax we use in our JS and Vue files can be transpiled by webpack and Babel.

```bash
$ npm i -D babel-core babel-loader babel-preset-env babel-preset-stage-3
```

#### .babelrc

```js
{
  'presets': [
    ['env', { 'modules': false }],
    'stage-3'
  ]
}
```