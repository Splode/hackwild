---
layout: post
title: Combining Jekyll with Vue.js with Single File Components
description: test
tags: Jekyll
category: Jekyll
---

## Setting Up the Project

### New Jekyll Project

```bash
jekyll new jekyll-vue-template
```

```bash
bundle exec jekyll s
```

### npm Initialization

Next we'll initialize an npm workflow in the project root, allowing us to work with node modules including Vue.js and webpack.

```bash
npm init
```

> Be sure to update the `exclude` field in your `config.yml` file to keep various development environment files, such as `package.json`, from being generated into your Jekyll production build.

## Installing Vue & webpack

```bash
npm install --save vue
```

```bash
npm install --save-dev vue-loader vue-style-loader vue-template-compiler
```

### A Source for All Things Vue

```bash
mkdir src && touch src/main.js
```

### Installing and Configuring webpack 4


