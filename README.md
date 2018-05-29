# changelog [![npm version](https://badge.fury.io/js/changelogapp.svg)](https://badge.fury.io/js/changelogapp) [![Dependency Status](https://david-dm.org/samholmes1337/changelog.svg)](https://david-dm.org/samholmes1337/changelog)
Easily create, manage and maintain [changelogs](http://keepachangelog.com)

![Demonstration](http://i.imgur.com/GQMsC7n.gif)

[![NPM](https://nodei.co/npm/changelogapp.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/changelogapp/)

## Installation
This project can be used as both a command line application and as a module. 
A simple API is currently available that gives access to _changelog_ functions as an npm module. 

To install as a command line application, run the following:

```console
$ npm install changelogapp -g
```

As an aside, if you have `vim` set as your `$EDITOR`, then do make sure that in your 
`~/.vimrc`, file you add the following line (to enable spellcheck and non-destructive line-wrapping):

```
" Enable spellcheck and wrap for changelog edit messages
autocmd VimEnter .UPDATE_EDITMSG setlocal spell linebreak wrap
```

## Command line usage

Navigate to the directory that you wish to create and modify changelogs in. 

```console
$ changelog <command> [<args>]
```

Below are the commands that can be run from the command line:

### Simple commands
| Command | Description |
|---|---|
| `help` | List the documentation |
| `init` | Initialize a blank `CHANGELOG.md` file in the current directory |
| `parse [filename]` | Parse the `CHANGELOG.md` file to JSON format. If no filename is specified the JSON will be printed to _stdout_, and if it is then the JSON will be saved to the filename specified in the current directory (if no file extension given, it will default to `.json`) |
| `status` | Print out changelog information, including the current version and a summary of the changes made |

### Changelog commands
`add`, `change`, `deprecate`, `remove`, `fix`, and `secure` as arguments all serve the same 
purpose of updating the `Unreleased` section of the changelog with content (corresponding 
to the [keepachangelog](http://keepachangelog.com) categories). 

It will open `$EDITOR`, at which point you can enter the changes made prevalent to that category, separating each new item with a new line.


### Version commands
| Command | Description |
|---|---|
| `bump [version \| patch \| minor \| major]` | This command will bump the `Unreleased` header to the next desired version. If no argument is specified a _patch_ update will automatically be applied. You can specify your own version (provided it adheres to [Semantic Versioning](http://semver.org)) or you can specify a _patch_, _minor_ or _major_ jump |
| `copy` | Copy the contents of the latest release item to the clipboard in markdown format |
| `release` | Create a new commit and tag with the version number and publish the release to GitHub |


## API usage
First things first, install the module as normal by running the following command in the directory you want to install to:

```console
$ npm install changelogapp
```
Currently you can `parse` changelogs to JSON format and `stringify` the result back into a CHANGELOG.md file.

### Parsing a changelog
```javascript
var changelog = require("changelogapp");
var fs = require("fs");

// Get the CHANGELOG.md file
fs.readFile("CHANGELOG.md", "utf8", function(err, docs){

    // Parse the contents
    changelog.parse(docs, function(err, data){
        if (err){
            console.log("There was an error parsing the changelog");
        } else {
            console.log(JSON.stringify(data, null, 4));
        }
    });

});
```

For the above example, the output will be:

```json
[
    {
        "version": "Unreleased",
        "released": false,
        "date": null,
        "link": false,
        "content": {
            "Fixed": [
                "Remove the muffin man"
            ]
        }
    },
    {
        "version": "0.0.1",
        "released": true,
        "date": "2016-02-19T00:00:00.000Z",
        "link": false,
        "content": {
            "Added": [
                "The ability to do some cool stuff",
                "Have you heard of the muffin man?"
            ]
        }
    }
]
```

### Stringify the JSON data back to markdown
```javascript
var changelog = require("changelogapp");
var fs = require("fs");
var parsedChangelog = require("./parsed-changelog.json");

// Stringify the JSON
changelog.stringify(parsedChangelog, function(err, data){
    if (err){
        console.log("Could not stringify the changelog data");
    } else {

        // Write the updated changelog file
        fs.writeFile("CHANGELOG.md", data, function(err){
            if (err)
                throw err;
        });

    }
});
```

Given the JSON example from the previous section, the `stringify` function will generate the following markdown file:

```markdown
# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Fixed
- Remove the muffin man

## 0.0.1 - 2016-02-19
### Added
- The ability to do some cool stuff
- Have you heard of the muffin man?

```


## Warnings
Currently, _changelog_ is very much in beta and a few things may not work perfectly. The most notable case being the fact that the parsing algorithm doesn't handle non-keepachangelog-style changelogs very well (if at all).

While support for changelogs that don't conform to this standard is not planned, if you have a CHANGELOG.md file that you believe should be supported, then create a new issue with the CHANGELOG.md file attached and a description of any errors you get.

