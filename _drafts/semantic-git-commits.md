---
layout: post
title: Semantic Git Commit Messages for Improved Readability
description: >
  Using a semantic Git commit method can greatly improve...
tags: Git
category: Git
---

Using a simple semantic naming system for your git commits can greatly improve your git log readability at a glance. It helps to clarify the record of changes to a project and helps focus commits into .

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
fix: only display 
```

## docs

The `docs:` tag is fairly straightforward and should be used to identify changes to the project documentation, either internal or client-facing.

#### Example

```
docs: add detailed installation instructions for Ubuntu
```

## style

## refactor

## test

## chore

http://karma-runner.github.io/2.0/dev/git-commit-msg.html
