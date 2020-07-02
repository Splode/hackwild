---
layout: post
title: Semantic Git Commit Messages for Clarity and Structure
description: Using a semantic Git commit method can greatly improve the readability of Git logs and help to organize the scope of individual commits.
keywords: git, semantic commit, git message, style guide, git log, Christopher Murphy
tags: Git
category: Git
hero_image:
  src: '/static/images/semantic-git-commits--825x464.png'
  alt: The words 'Semantic Git Commit Messages' on a dark background
og_image: '/static/images/semantic-git-commits--1200x600.png'
---

I recently found out about semantic Git commit messages—a method for structuring Git commits into logical chunks by using semantic labels. Inspired by <a href="http://karma-runner.github.io/2.0/dev/git-commit-msg.html" target="_blank" rel="noopener">Karma's style guide</a> for Git commit messages, the following semantic Git commits can greatly improve your Git log readability at a glance. They help to clarify the record of changes to a project and help focus commits into scoped segments.

Semantic Git commits start with a semantic tag and use an imperative voice. Git commit messages should be prefixed with **one** the following tags:

- `feat:` - implement new features for endusers
- `fix:` - bug fix for endusers (not a build-process fix)
- `docs:` - update to project documentation
- `style:` - update code formatting (indentation, tabs vs spaces, etc.)
- `refactor:` - refactoring of code
- `test:` - adding or updating tests
- `chore:` - updates to build process

## feat

The `feat:` tag should be used to identify new features or changes to production code that endusers will see. An example might be adding a method to sort posts based on popularity. It does not include changes to build process code, such as adding HTML minification in the build process pipeline.

#### Example

```sh
"feat: add ability to view most popular posts"
```

## fix

The `fix:` tag should be used to identify any bug fixes to production code. This includes any fix that would effect the enduser, not the build process.

#### Example

```sh
"fix: check if file exists before attempting to unlink"
```

## docs

The `docs:` tag is fairly straightforward and should be used to identify changes to the project documentation, either internal or client-facing.

#### Example

```sh
"docs: add detailed installation instructions for Ubuntu"
```

## style

The `style:` tag should be used to identify changes made to the **code** style, which do not effect the enduser. Note that this is separate from the styling of user interfaces, which does effect the enduser. For example, a style change may indicate a change from using tab indentation to spaces.

For style updates that would effect the enduser, such as CSS changes, use the `feat:` tag instead.

#### Example

```sh
"style: convert from 4 space indentation to 2 spaces"
```

## refactor

The `refactor:` tag should be used to identify refactoring in the codebase. This includes changing variable names, combining or simplifying code, etc.

#### Example

```sh
"refactor: rename ArticleController to PostController"
```

## test

The `test:` tag should be used to identify changes surrounding tests.

#### Example

```sh
"test: add assertions for Collection update and destroy methods"
```

## chore

The `chore:` tag should be used to identify changes to build scripts and other updates that do not alter production code. This might include dependency package updates or build script configuration edits.

#### Example

```sh
"chore: update build script to webpack 4"
```
