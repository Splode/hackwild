---
layout: post
title: Generating Project Documentation with Git Log
description: Git's log command can be used to generate consistent project documentation, such as release notes and changelogs.
tags: Git
category: Git
---

The git sub-command `log` shows the commits in a repository and is a useful tool for inspecting the history of a project. Its output can generate project documentation such as release notes and changelogs. Pairing `git log` with clear and [meaningful commit messages](article/semantic-git-commits/) can be a powerful tool in the project documentation toolkit.

## Generate Basic Release Notes

By itself, the log command shows quite a bit of information, including the full commit hash, author name, and email, date, full commit message, etc. We can pare down this information using git log's many options.

In the following example, we use git log to generate a list of commits that can for release notes. We pass the `--oneline` formatting flag to denote that we want a condensed version of each commit intended to fit one commit per line. We can limit the range of the log by using the `revision range` argument. In this case, we’ll display only the commits between the previous tag `v0.7.0` and the current tag `v0.7.1`.

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

We can write this information to a changelog by directing output and appending to a file. In this example, we’ll append it to a changelog. This will append the contents of git log to the `CHANGELOG` file, or create it if it doesn’t exist.

```bash
git log --oneline v0.7.0...v0.7.1 >> CHANGELOG
```

A benefit of generating release notes in this way is that GitHub will hyperlink commit hashes in release notes to the actual commit. This provides a convenient way to navigate to different points in a codebase’s history.

### Customize Log Format

Customizing the git log output is simple. Formatting the output involves passing the `--format` flag along with a formatting string and placeholders.

In this example, we’re going to alter the format of the log output so that it better integrates with markdown. Each log entry is an item in a list of commits, so we’ll add a leading `-` to each line item, displaying the log as an unordered list in markdown. The `%h` placeholder denotes an abbreviated commit hash and the `%s` placeholder denotes the commit subject (or title).

```git
$ git log --format="- %h %s"

- 2c36613 feat: display post date in post header
...
```

You can find more formatting placeholders in [the official git log documentation](https://www.git-scm.com/docs/git-log).

## Using Shortlog for Teams

The `shortlog` command is especially useful when generating release notes for projects with many collaborators. `shortlog` groups commits by author, sorted by name. In this example, we’ll pass the `-n` flag to sort by the number of commits by author.

```git
$ git shortlog -n --format="- %h %s" v0.7.1...v0.8.0

Christopher Murphy (9):
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

## Conclusion and Related Projects

I’ve found that this approach, when paired with meaningful commit messages, helps build consistent documentation for projects. It provides a clear path for collaborators (and you) to navigate the changes associated with a codebase in a given period. It’s also flexible in that the log output can be formatted in any number of ways. As a command-line tool, it integrates with many workflows, including continuous integration and deployment.
