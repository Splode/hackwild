---
layout: post
title: Jekyll Static Site Generation with Vue.js Single File Components - Part One
# title: Jekyll with Vue.js and Single File Components Workflow - Part One
description: test
tags: Jekyll
category: Jekyll
---

webpack offers many benefits including the ability to compile Vue Single File Components (SFC) into standard JavaScript modules for use throughout our Jekyll site.

This tutorial will assume a basic knowledge of [Jekyll](https://jekyllrb.com/) and [Vue.js](https://vuejs.org/).

## Setting Up the Project

### New Jekyll Project

```bash
$ jekyll new jekyll-vue-template
```

We'll disable the default theme, _Minima_, that Jekyll ships with by commenting it out of or deleting it from our `config.yml` file.

#### config.yml

```yaml
# theme: minima
```

Next, we'll create a `_layouts` directory to store our page layouts and create a default layout, `default.html`, within it. We'll create a top-level `<div>`, which will be used later as an entrypoint for Vue.

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

Let's test to ensure that our Jekyll app scaffolding was successful by spooling up a dev server by running the following command:

```
$ bundle exec jekyll s
```

### npm Initialization

Next we'll initialize an npm workflow in the project root, allowing us to work with node modules, including Vue.js and webpack.

```bash
$ npm init
```

> Be sure to update the `exclude` field in your `config.yml` file to keep various development environment files, such as `package.json`, from being generated into your Jekyll production build.

## Installing Vue & Configuring webpack

Ok, take a deep breath. It's time to take a deep dive into installing and configuring webpack from scratch. This can be a daunting process, but we'll go through this process step-by-step. If you're comfortable with configuring webpack with Vue, feel free to skip to [part two]({% link _drafts/jekyll-vue-part-two.md %}) where we create Vue components and integrate our Vue and Jekyll workflows.

### Installing Vue

First, we'll install Vue as a dependency:

```bash
$ npm i -S vue
```

Next, we'll create a directory in our project root, `src`, where all of our Vue application components will live and we'll also create an entry point for our Vue application, `main.js`. For now, we'll just import Vue.

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
* `node-sass` is required for parsing SASS/SCSS stylesheets
* `sass-loader` allows webpack to compile SASS/SCSS stylesheets into CSS
* `vue-loader` allows webpack to compile Vue Single File Components into JS modules
* `vue-style-loader` allows webpack to resolve `<style>` blocks in Vue SFCs

```bash
$ npm i -D cross-env css-loader node-sass sass-loader vue-loader vue-style-loader
```

### Configuring webpack

We'll begin configuring our webpack workflow by creating a config file, `webpack.config.js` in the project root. We'll set the entry point as the `main.js` file that we created earlier and set the output to `dist/build.js` (both the directory and the bundled script file will be created when we run webpack). We'll set the default environment `mode` to `development`.

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

> Note: webpack 4 now requires the environment `mode` to be explicitly set. We set it to `development` by default and will programmitically set this with npm scripts later in the tutorial.

Next, we'll add the rules for all of the module loaders that we intend to use.

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader']
    },
    {
      test: /\.scss$/,
      use: ['vue-style-loader', 'css-loader', 'sass-loader']
    },
    {
      test: /\.sass$/,
      use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
    },
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

#### webpack.config.js

```js
resolve: {
  alias: {
    vue$: 'vue/dist/vue.esm.js'
  },
  extensions: ['*', '.js', '.vue', '.json']
}
```

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
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
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

#### package.json

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack",
  "build": "cross-env NODE_ENV=production webpack --progress --hide-modules",
  "watch": "cross-env NODE_ENV=development webpack --watch"
}
```

## Sanity Check - Testing our Current Progress

Now that we have Jekyll running and Vue with webpack configured, it's time to test that our workflow is working as intended. We'll test our webpack build by running our `npm dev` script:

```bash
$ npm run dev
```

We should see no errors during the build process and we should now have a newly created `dist` directory in the project root containing a `build.js` file. If we take a look at `build.js`, we'll see that it includes the Vue.js module. You can further test the workflow by running the `build` and `watch` scripts as well. 

> Note that when running `npm run build`, our `build.js` bundle is minified. webpack 4 now performs all sorts of optimizations, such as minifciation, by default when the environment mode is set to `production`.

## Up Next

In [part two]({% link _drafts/jekyll-vue-part-two.md %}), we'll integrate our webpack/Vue workflow with our Jekyll workflow and start using Vue SFCs. We'll also refine our webpack workflow to incorporate code-splitting and cache-control.
