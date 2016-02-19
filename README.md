# changelog [![npm version](https://badge.fury.io/js/changelogapp.svg)](https://badge.fury.io/js/changelogapp)
Easily create, manage and maintain [changelogs](keepachangelog.com)

[![NPM](https://nodei.co/npm/changelogapp.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/changelogapp/)

## Installation
Currently this project can only be used as a command line application. An API will be available soon that gives access to _changelog_ functions as an npm module. To install as a command line application run the following:

```console
$ npm install changelogapp -g
```

## Command line usage
Navigate to the directory that you wish to create and modify changelogs in. Below are the commands that can be run from the command line:

```console
$ changelog <command> [<args>]
```

### Simple commands
| Command | Description |
|---|---|
| help | List the documentation |
| init | Initialize a blank CHANGELOG.md file in the current directory |
| parse [filename] | Parse the CHANGELOG.md file to JSON format. If no filename is specified the JSON will be printed to _stdout_, and if it is then the JSON will be saved to the filename specified in the current directory (if no file extension given, it will default to .json) |
| status | Print out changelog information, including the current version and a summary of the changes made |

### Changelog commands
`add`, `change`, `deprecate`, `remove`, `fix`, and `secure` as arguments all serve the same purpose of updating the "Unreleased" section of the changelog with content (corresponding to the [keepachangelog](keepachangelog.com) categories). It will open $EDITOR, at which point you can enter the changes made prevalent to that category, separating each new item with a new line.

### Version commands
| Command | Description |
|---|---|
| bump [version &#124; patch &#124; minor &#124; major] | This command will bump the "Unreleased" header to the next desired version. If no argument is specified a _patch_ update will automatically be applied. You can specify your own version (provided it adheres to [Semantic Versioning](http://semver.org)) or you can specify a _patch_, _minor_ or _major_ jump. |

## API usage
_Coming soon!_

## Warnings
Currently, _changelog_ is very much in beta and a few things may not work perfectly. The most notable case being the fact that the parsing algorithm doesn't handle non-keepachangelog-style changelogs very well (if at all).

While support for changelogs that don't conform to this standard is not planned, if you have a CHANGELOG.md file that you believe should be supported, then create a new issue with the CHANGELOG.md file attached and a description of any errors you get.
