---
layout: post
title: Jekyll Static Site Generation with Vue.js Single File Components
description: Create a statically generated site with Jekyll, Vue Single File Components and webpack optimizations.
tags: Jekyll
category: Jekyll
---

Static Site Generators (SSG) are awesome and Jekyll is one of the most robust options available. It's stable, well supported and straightforward. What would make it even better? The reactivity of Vue.js Single File Components (SFC) and webpack optimizations, of course.

In this article we'll combine the configurability of Jekyll SSG with the reactivity of Vue. We'll cover starting a new Jekyll project, installing Vue, configuring webpack to compile SFCs, and finally mount SFCs in Jekyll views ⚡.

> This tutorial will assume a basic knowledge of <a href="https://jekyllrb.com/" target="_blank" rel="noopener">Jekyll</a> and <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue.js<a/>.

## Setting Up the Project

We'll begin by scaffolding a new Jekyll project. If you don't have Jekyll installed, check out the <a href="https://jekyllrb.com/" target="_blank" rel="noopener">official installation guide</a>.

### New Jekyll Project

```bash
$ jekyll new jekyll-vue-template
```

We'll disable the default theme, _Minima_, that Jekyll ships with by commenting it out of or deleting it from our `config.yml` file.

#### config.yml

```yaml
# theme: minima
```

Next, we'll create a `_layouts` directory to store our page layouts and create a default layout, `default.html`, within it. In our layout we'll create a top-level `<div>`, which will be used later as an entrypoint for Vue.

#### default.html

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Example Title</title>
</head>

<body>
  <div id="app">
    {% raw %}{{ "{{ content "  }}}}{% endraw %}
  </div>
</body>

</html>
```

Lastly, we'll change the layout type in the YAML front matter of `index.md` at the project root to match our newly created `default` layout:

#### index.md

```md
---
layout: default
---

# jekyll-vue-template
```

Let's test to ensure that our Jekyll project scaffolding was successful by spooling up a dev server using the following command:

```
$ bundle exec jekyll s
```

### npm Initialization

After we've successfully setup Jekyll, we'll initialize an npm workflow in the project root allowing us to work with node modules, including Vue.js and webpack.

```bash
$ npm init
```

> Be sure to update the `exclude` field in your `config.yml` file to keep various development environment files, such as `package.json`, from being generated into your Jekyll production build.

## Installing Vue & Configuring webpack

Ok, take a deep breath. It's time to take a dive into installing and configuring webpack from scratch. This can be a daunting process, but we'll go through this process step-by-step. If you're comfortable with configuring webpack with Vue, feel free to skip to the [Integrating Vue and Jekyll](#integrating-vue-and-jekyll) section.

### Installing Vue

First, we'll install Vue as a dependency:

```bash
$ npm i -S vue
```

Next, we'll create a directory, `src`, in our project root where all of our Vue application components will live. We'll also create an entry point for our Vue application, `main.js`. For now, we'll just import Vue.

#### main.js

```js
import Vue from 'vue'
```

### Installing webpack and its Modules

Next, we'll install the `webpack` core module and `webpack-cli`, which allows us to pass commands and arguments through the CLI to webpack.

```bash
$ npm i -D webpack webpack-cli
```

We'll also install several modules and loaders that will assist in handling assets for webpack processing. Let's go through the purpose of each module:

* `cross-env` smooths out the inconsistencies of using environment variables across platforms
* `css-loader` allows webpack to resolve CSS `@import` and `url()` statements
* `node-sass` is required for compiling SASS/SCSS
* `sass-loader` allows webpack to compile SASS/SCSS to CSS
* `vue-loader` allows webpack to compile Vue Single File Components into JS modules
* `vue-style-loader` allows webpack to dynamically inject CSS into the DOM
* `vue-template-compiler` used by `vue-loader` to precompile Vue templates to render functions

```bash
$ npm i -D cross-env css-loader node-sass sass-loader vue-loader vue-style-loader vue-template-compiler
```

### Configuring webpack

We'll begin configuring our webpack workflow by creating a config file, `webpack.config.js` in the project root. We'll set the entry point to the `main.js` file that we created earlier and set the output to `dist/build.js` (both the directory and the bundled script file will be created when we run webpack). We'll set the default environment `mode` to `development`.

#### webpack.config.js

```js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  mode: 'development'
}
```

> Note: webpack 4 now requires the environment `mode` to be explicitly set. We set it to `development` by default in our config file and will programmitically set it with npm scripts later in the tutorial.

Next, we'll add a module rule for Vue SFCs. This rule uses a regular expression to parse any file with a `.vue` extension and loads it with `vue-loader`. We'll also pass in several loaders as options so that our SFC styles can be resolved.

```js
module: {
  rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          scss: ['vue-style-loader', 'css-loader', 'sass-loader']
        }
      }
    }
  ]
}
```

The Vue package ships with several library versions. To make sure we use the correct one, we'll define an alias for `vue`, which webpack will resolve to the runtime + compiler (`vue.esm.js`) version of Vue. For more information on the Vue runtime and compiler, visit the <a href="https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only" target="_blank" rel="noopener">official Vue docs</a>.

To make working with Vue components and other modules more convenient, we'll add an array of file extensions for webpack to resolve when using import statements. This allows us to call a module import using only the filename without the extension. For example, we can use `import vueComponent from 'components/vueComponent'` without the `.vue` extension.

#### webpack.config.js

```js
resolve: {
  alias: {
    vue$: 'vue/dist/vue.esm.js'
  },
  extensions: ['*', '.js', '.vue', '.json']
}
```

Lastly, we'll perform a check on our environment variable to control build settings. If the environment variable is set to `production`, we'll overwrite the default `development` mode that we defined earlier. Webpack will perform several useful optimizations if the mode is set to `production`.

#### webpack.config.js

```js
if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production'
}
```

### Putting it All Together

#### webpack.config.js

```js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production'
}
```

Once we've configured webpack, we'll create the scripts needed to run it. We'll use three separate scripts, `dev` for bundling unminified assets, `build` for bundling production-ready assets, and `watch` for automatic recompilation of assets during development.

#### package.json

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack",
  "build": "cross-env NODE_ENV=production webpack --progress --hide-modules",
  "watch": "cross-env NODE_ENV=development webpack --watch"
}
```

## Sanity Check - Testing our Current Progress

Now that we have Jekyll running and Vue with webpack configured, it's time to test that our workflow is working as intended. We'll test our webpack build by running our `dev` script:

```bash
$ npm run dev
```

We should see no errors during the build process and we should now have a newly created `dist` directory in the project root containing a `build.js` file. If we take a look at `build.js`, we'll see that it includes the Vue.js module. You can further test the workflow by running the `build` and `watch` scripts as well. 

> Note that when running `npm run build`, our `build.js` bundle is minified. webpack 4 now performs all sorts of optimizations, such as minificiation, by default when the environment mode is set to `production`.

## Integrating Vue and Jekyll

### Creating a Simple Vue Component

In our `src` directory, we'll create a `components` directory to house all of our application components. Within this folder, we'll create a simple `HelloWorld.vue` single file component and give it a basic SFC scaffolding. We'll also add in an `<h1>` title, a component name, and a few styles:

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

Now that we've created a Vue component, we'll need to register it with our primary Vue instance. We'll do this by importing the component in our `main.js` file. We also need to create a new Vue instance and give it an element entry point. We'll use an id of `app` and update our Jekyll layout to reflect this shortly. Lastly, we'll attach the component to the Vue instance using the `component` method.

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

Let's update our default layout, `default.html`, with the id of `app` (we defined this in `main.js`). With that in place, we can now mount our component using `<hello-world>`. We can mount instances of this component in any view that extends the default layout, including markdown posts, HTML includes, and HTML layout files.

#### default.html

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Example Title</title>
</head>

<body>
  <div id="app">
    <hello-world></hello-world>
    {% raw %}{{ "{{ content "  }}}}{% endraw %}
  </div>
</body>

</html>
```

or...

#### index.md

```md
---
layout: default
---

<hell-world></hello-world>
```

## Wrapping Up

Static Site Generators like Jekyll offer some unique benefits over Single-Page Applications, especially for sites with lots of static content (like blogs). They're fast, SEO-friendly, and offer site-wide variables, like post collections. Incorporating a reactive library like Vue.js can help to make a statically-generated site feel much more dynamic.

### jekyll-vue-template

If you'd like to review the source for an example Jekyll-Vue project like the one that we've built in this article, check out the <a href="https://github.com/Splode/jekyll-vue-template" target="_blank" rel="noopener">jekyll-vue-template</a>. It's a boilerplate Jekyll project with support for Vue single file components complete with webpack 4 optimizations, including cache-control, code-splitting, and Babel transpiling, and linting with ESLint.