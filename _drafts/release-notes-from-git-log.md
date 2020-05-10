---
layout: post
title: Generating Project Documentation with Git Log
description: Descriptive and consistent commit titles can be used to generate release notes using Git's log command.
tags: Git
category: Git
---

Pairing `git log` with clear and meaningful commit messages

By itself, the `log` command shows quite a bit of information, including the full commit hash, author name and email, date, full commit message, etc.

## Generate Basic Release Notes

In the following example, we use `git log` to generate a list of commits that can be used in release notes. We pass the `--oneline` formatting flag to denote that we want a condensed version of each commit intended to fit one commit per line. We don’t want to display all the commits, only the commits between the previous release and this upcoming release. We can limit the range of the log by using the `revision range` argument.

```git
$ git log --oneline v0.7.0...v0.7.1

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

A benefit of generating release notes in this way is that GitHub will hyperlink commit hashes in release notes to the actual commit. This provides a convenient way to navigate to different points in a codebase's history.

### Customize Log Format

The output from `git log` can be customized in a number of ways.

Formatting the output involves passing the `--format` flag along with a formatting string.

```git
$ git log --format="- %h %s"

- 2c36613 feat: display post date in post header
...
```

## Shortlog

The `shortlog` command is especially useful when generating release notes for projects with numerous collaborators. `shortlog` groups commits by author, sorted alphabetically by default.

```git
$ git shortlog -n --format="- %h %s" v0.7.1...v0.8.0

Christopher Murphy (10):
      - 3a7411f Merge pull request #72 from Splode/dependabot/npm_and_yarn/acorn-6.4.1
      - 473aaf6 Merge branch 'dev'
      - ef77bc9 chore: configure travis-ci to build on macos
      - c508944 docs: update screenshots, assets
      - 59a1ca8 fix: capitalize app title
      - 1f28690 Merge pull request #86 from JamesDBartlett/master
      - 273e698 Merge branch 'master' into dev
      - cf857b6 chore: add git-chglog config
      - 856ab3e docs: add CHANGELOG
      - 94fbbd9 0.8.0

James D. Bartlett III (2):
      - 62bc01c Update pomotroid.json to fix scoop install
      - fbb5caa increase max time to 90 minutes

dependabot[bot] (1):
      - d998c75 chore(deps): bump acorn from 6.4.0 to 6.4.1
```

## Conclusion

I've found that this approach, when paired with meaningful commit messages, can be used to build consistent and helpful documentation for projects. It provides a clear path for collaborators (and you) to navigate the changes associated with a codebase in a given period of time. It's also flexible in that it the `log` output can be formatted any number of ways, and the process can be automated in various workflows.
