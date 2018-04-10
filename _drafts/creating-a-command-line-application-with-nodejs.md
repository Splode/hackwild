---
layout: post
title: Creating a Command Line Application with Node.js
description: >
  Create live image previews for file uploads using the File API and the FileReader object in vanilla JavaScript.
tags: JavaScript
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

Next, we'll make two directories, `bin` and `lib`, to house our application logic. It's customary for the applications executable files, or _binaries_, to be held in the `bin` directory and the _libraries_ essential to the application execution in the `lib` directory. So, we'll also create an entrypoint, `index.js`, for our application in the `bin` directory.

```bash
$ mkdir bin lib && touch bin/index.js
```

Let's start by just outputting the version number of our application. Instead of having to manually keep track of the application version in multiple places, we'll use the version field already defined in our `package.json` file (which allows us to take advantage of npm's semantic versioning tools):

#### index.js

```js
const pckg = require('./../package.json')

console.log(pckg.version)
```

> Note that it might make sense to use `package` as the variable name for importing `package.json`, but `package` is a reserved word so it's best to use another name, like `pckg`.

Now, when we run this file with `node` we should expect to see the version, `0.0.1`, output to the console.

```bash
$ node /bin/index.js
```

### Globally Registering our Application

Having to prepend every command with `node` and a path is clunky and laborious. We want our command to be accessible globally, not just in this particular project directory, so that we can call it just by typing `notes`.

To register this command globally, we first need to give Node a hint about the intended rutime environment for our application. We'll do this by setting the following special comment at the beginning of our application entrypoint:

#### index.js

```js
#!/usr/bin/env node
```

We're going to be using npm to create a symbolic link to our application entry point. To do this, we'll start by registering a `bin` object in our `package.json` file. We'll set the **key** name to the command we'd like to call the application with, and set the **value** to the relative path of the application entry point:

#### package.json

```json
"bin": {
  "notes": "./bin/index.js"
}
```

> Note that we need to choose a command that isn't already used by your system.

Next, we'll use the npm `link` command while in our project root to create a global link to our application entry point:

```bash
$ npm link
```

We can now run our application using the command we specified in our `package.json` anywhere. To test this, let's run it both in the current project directory and outside the current directory:

```bash
$ notes
0.0.1
```

In both instances, the command should return the same version number.

### Commander Basics

Commander makes it quite easy to create CLI applications. It includes several useful methods, including automatically generated `help` and `version` flags. We can start using Commander in our application by simply requiring it and calling the `parse()` method at the end of our script and passing in the process arguments.

#### index.js

```js
#!/usr/bin/env node

const pckg = require('./../package.json')
const program = require('commander')

program.version(pckg.version)
program.parse(process.argv)
```

If we run the application again but add the `--version` flag set, we'll achieve the same effect as we did when we used `console.log` in the previous example:

```bash
$ notes --version
0.0.1
```

## Creating Commands

There are three primary ways to working with commands with Commander:

1.  Use primary command with options
2.  Use secondary commands with options
3.  Use git-style sub-commands with options

We'll use the second approach, using secondary commands with options. This approach allows us to define several different commands, each with the potential to have its own options and help output.

We'll start by laying out the structure of a basic command, which chains several methods together on the Commander instance (in this case, `program`). The basic structure for this approach uses the following methods:

- The `command()` method is used to define the phrase used to call the command.
- The `alias()` method is used to set an optional alias to the command.
- The `description()` method defines a description for the command to be displayed in the help output.
- The `action()` method is where we will pass in command arguments to functions that we'd ultimately like to call for each command.

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

Once we have our command structure in place, we'll start populating each method with the appropriate arguments, starting with the `command()` method.

The `command()` method takes a `String` argument with the following syntax: `'command <required> [optional]'`, where `command` is the sub-command name followed by arguments. The `<>` brackets indicate a required argument, while the `[]` brackets indicated an optional requirement.

> The application will error-out if the `add` command is run without providing the required `note` argument.

We're going to set the command to `add` and set the `note` argument as required. We'll also set a command alias, `a`. This allows us to call the `add` command with either `add` or `a`.

Next, we provide a description of the command to be displayed when a user accesses the help output using the `--help` flag.

Lastly, we'll specify the functions to be called when this command is run. The `action()` method accepts a callback that has the command arguments passed in. We'll pass in the `note` argument and simply log it for now.

#### index.js

```js
#!/usr/bin/env node

const pckg = require('./../package.json')
const program = require('commander')

program.version(pckg.version)

program
  .command('add <note>')
  .alias('a')
  .description(
    'Add a new note.'
  )
  .action(note => {
    console.log(note)
  })

program
  .command('list [index]')
  .alias('ls')
  .description(
    'List all notes. Show the note at the given index.'
  )
  .action(index => {
    console.log(index)
  })

program.parse(process.argv)
```

Here's an example of how we would call the command that we just wrote:

```bash
$ note add "This is a new note."
```

## Creating and Using Actions

With our command created, it's time to write the logic that handles the `add` event.
