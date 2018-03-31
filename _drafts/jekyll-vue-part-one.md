---
layout: post
title: Jekyll with Vue.js and Single File Components Workflow - Part One
description: test
tags: Jekyll
category: Jekyll
---

## Setting Up the Project

### New Jekyll Project

```bash
$ jekyll new jekyll-vue-template
```

Let's test to ensure that our Jekyll app scaffolding was successful by spooling up a dev server by running the following command:

```bash
$ bundle exec jekyll s
```

### npm Initialization

Next we'll initialize an npm workflow in the project root, allowing us to work with node modules, including Vue.js and webpack.

```bash
$ npm init
```

> Be sure to update the `exclude` field in your `config.yml` file to keep various development environment files, such as `package.json`, from being generated into your Jekyll production build.

## Installing Vue & webpack

```bash
$ npm i -S vue
```

```bash
$ npm i -D vue-loader vue-style-loader vue-template-compiler
```

### Installing and Configuring webpack 4

Ok, take a deep breath. It's time to take a deep dive into installing and configuring webpack from scratch. This can be a daunting process, but we'll go through this process step-by-step. If you're comfortable with configuring webpack with Vue, feel free to skip to [part two]({% link _drafts/jekyll-vue-part-two.md %}) where we create Vue components and integrate our Vue and Jekyll workflows.

```bash
$ npm i -D webpack webpack-cli
```

```bash
$ npm i -D clean-webpack-plugin cross-env css-loader html-loader node-sass sass-loader
```

### Installing and Configuring Babel

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
