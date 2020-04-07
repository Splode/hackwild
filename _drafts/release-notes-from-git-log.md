---
layout: post
title: Use Git Log to Generate Release Notes
description: Descriptive and consistent commit titles can be used to generate release notes using Git's log command.
tags: Git
category: Git
---

Pairing `git log` with clear and meaningful commit messages

By itself, the `log` command shows quite a bit of information, including the full commit hash, author name and email, date, full commit message, etc.

## Generating Release Notes

In the following example, we use `git log` to generate a list of commits that can be used in release notes. We pass in the `--oneline` formatting flag to denote that we want a condensed version of each commit intended to fit one commit per line. We don't want to display all the commits, only the commits between the previous release and this upcoming release. We can limit the range of the log by using the `revision range` argument.

```sh
git log --oneline v0.7.0...v0.7.1
```

```git
2c36613 feat: display post date in post header
0cee78d style: updates in various md posts
a5ad3d1 chore(deps): upgrade various deps
3bee705 feat: remove google analytics script
33e1a8a update: remove shell prompt symbol in jekyll-vue post code blocks
007595b feat: adjust styling of code blocks in post
9a3c41f chore: upgrade node-sass
e5df77a feat: add hero image alt text field to post
91b98b5 fix: set image max width
```

One of the benefits of using the `git log` to generate release notes in this manner is that GitHub will automatically hyperlink commit hashes in release notes to the actual commit. This provides a convenient way for viewers to navigate to various points in a codebase where a change took place.

## Customize Log Format

The output from `git log` can be customized in a number of ways.

## Conclusion

I've found that this approach, when paired with meaningful commit messages, can be used to build consistent and helpful documentation for projects. It provides a clear path for collaborators (and you) to navigate the changes associated with a codebase in a given period of time. It is also flexible in that it the `log` output can be formatted any number of ways, and the process can be automated in various workflows.
