---
layout: post
title: Jekyll Static Site Generation with Vue.js Single File Components - Part Two
description: test
tags: Jekyll
category: Jekyll
---

## Vue Single File Components

### A Source for All Things Vue

We'll create a directory in our project root, `src`, where all of our Vue application components will live and we'll also create an entry point for our Vue application, `main.js`.

### Connecting Vue and Jekyll

Mounting the Vue components in Jekyll `includes` and `layouts`.

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