---
layout: post
title: Semantic Git Commit Messages for Improved Readability
description: >
  Using a semantic Git commit method can greatly improve...
tags: Git
category: Git
---

Using a simple semantic naming system for your git commits can greatly improve your git log readability at a glance. It helps to clarify the record of changes to a project and helps focus commits into .

These semantic Git commit message tags are inspired by Karma's 

Git commit messages should begin with **one** the following tag prefixes:

* `feat:` - implement new features for endusers
* `fix:` - bug fix for endusers (not a build-process fix)
* `docs:` - update to project documentation
* `style:` - update code formatting (indentation, tabs vs spaces, etc.)
* `refactor:` - refactoring of code
* `test:` - adding or updating tests
* `chore:` - updates to build process

## feat

The `feat:` tag should be used to identify new features or changes to production code that endusers will see. An example might be adding a method to sort posts based on popularity. It does not include changes to build process code, such as adding HTML minification in the build process pipeline.

#### Example

```
feat: add ability to view most popular posts
```

## fix

The `fix:` tag should be used to identify any bug fixes to production code. This includes any fix that would effect the enduser, not the build process.

#### Example

```
fix: check if file exists before attempting to unlink
```

## docs

The `docs:` tag is fairly straightforward and should be used to identify changes to the project documentation, either internal or client-facing.

#### Example

```
docs: add detailed installation instructions for Ubuntu
```

## style

The `style:` tag should be used to identify changes made to the **code** style, which do not effect the enduser. Note that this is separate from the styling of user interfaces, which does effect the enduser. For example, a style change may indicate a change from using tabs for indentation to spaces.

For style updates that would effect the enduser, such as CSS changes, use the `feat:` tag instead.

#### Example

```
style: convert from 4 space indentation to 2 spaces
```

## refactor

The `refactor:` tag should be used to identify refactoring in the codebase. This includes changing variable names, combining or simplifying code, etc.

#### Example

```
refactor: rename ArticleController to PostController
```

## test

The `test:` tag should be used to identify changes surrounding tests.

#### Example

```
test: add assertions for Collection update and destroy methods
```

## chore

The `chore:` tag should be used to identify changes to build scripts and other updates that do not alter production code. This might include dependency package updates or build script configuration edits.

#### Example

```
chore: update build script to webpack 4
```

http://karma-runner.github.io/2.0/dev/git-commit-msg.html
