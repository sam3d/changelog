# changelog [![npm version](https://badge.fury.io/js/changelogapp.svg)](https://badge.fury.io/js/changelogapp)
Easily create, manage and maintain [changelogs](keepachangelog.com)

[![NPM](https://nodei.co/npm/changelogapp.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/changelogapp/)

## Installation
Currently this project can only be used as a command line application. An API will be available soon that gives access to _changelog_ functions as an npm module. To install as a command line application run the following:

```console
npm install changelogapp -g
```

## Command line usage
Navigate to the directory that you wish to create and modify changelogs in. Below is the output from the documentation screen found by running `changelog help`:

```console
usage: changelog <command> [<args>]

Basic Commands:
   help      List the documentation
   init      Initialize a blank CHANGELOG.md file in the current directory
   parse     Parse the CHANGELOG.md file to JSON format

Changelog Commands:
   add       'Added' for new features
   change    'Changed' for changes in existing functionality
   deprecate 'Deprecated' for once stable features removed in upcoming releases
   remove    'Removed' for deprecated features removed in this release
   fix       'Fixed' for any bug fixes
   secure    'Security' to invite users to upgrade in case of vulnerabilities

Danger Zone:
   destroy   Completely destroy any changelog file in the current directory
```

## API usage
_Coming soon!_

## Warnings
Currently, _changelog_ is very much in beta and a few things may not work perfectly. The most notable case being the fact that the parsing algorithm doesn't handle non-keepachangelog-style changelogs very well (if at all).

While support for changelogs that don't conform to this standard do not plan to be supported, if you believe that you have a CHANGELOG.md file that you believe should be supported then create a new issue with the CHANGELOG.md file attached and a description of any errors you get.
