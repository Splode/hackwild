---
layout: post
title: Creating a Command Line Application with Node.js
description: >
  Create live image previews for file uploads using the File API and the FileReader object in vanilla JavaScript.
tags: JavaScript Node CLI terminal
category: JavaScript
---

## Getting Started

```bash
$ npm init
```

For this project we're going to be using <a href="https://github.com/tj/commander.js/" target="_blank" rel="noopener">Commander.js</a>. Commander offers many convenient tools for creating CLI applications, including option parsing and Git-style subcommands. We'll install it as a dependency to our application:

```bash
$ npm i -S commander
```

```bash
$ mkdir bin lib && touch bin/index.js
```

#### index.js

```js
const pckg = require('./../package.json')

console.log(pckg.version)
```

> Note that it might make sense to use `package` as the variable name for importing `package.json`, but `package` is a reserved word so it's best to use another name, like `pckg`.

```bash
$ node /bin/index.js
```

### Globally Registering our Application

Having to prepend every command with `node`. We want our command to be accessible globally, not just in this particular project directory.

To register this command globally, we first need to give Node a hint about the

#### index.js

```js
#!/usr/bin/env node
```

#### package.json

```json
"bin": {
  "jin": "./bin/index.js"
}
```

```bash
$ npm link
```

We can now run our application using the command we specified in our `package.json` anywhere. To test this, let's run it both in the current project directory and outside the current directory:

```bash
$ jin
0.0.1
```

In both instances, the command should return the same version number.

### Commander Basics

#### index.js

```js
#!/usr/bin/env node

const pjson = require('./../package.json')
const program = require('commander')

program.version(pjson.version)
program.parse(process.argv)
```

If we run the application again but add the `--version` option, we'll achieve the same effect as we did when we used `console.log` in the previous example:

```bash
$ jin --version
0.0.1
```

## Creating Commands

#### index.js

```js
#!/usr/bin/env node

const pckg = require('./../package.json')
const program = require('commander')

program.version(pckg.version)

program
  .command()
  .alias()
  .description()
  .action()

program.parse(process.argv)
```

#### index.js

```js
#!/usr/bin/env node

const pckg = require('./../package.json')
const program = require('commander')

program.version(pckg.version)

program
  .command('add <notebook> [note]')
  .alias('a')
  .description(
    'Add a new note to a notebook. Creates the specified notebook if it does not already exist.'
  )
  .action((notebook, note) => {
    console.log(notebook)
    if (note) {
      console.log(note)
    }
  })

program
  .command('list <notebook> [index]')
  .alias('ls')
  .description(
    'List the notes for a give notebook. Show the note at the given index.'
  )
  .action((notebook, index) => {
    console.log(notebook)
    if (index) {
      console.log(index)
    }
  })

program.parse(process.argv)
```

## Creating and Using Actions
