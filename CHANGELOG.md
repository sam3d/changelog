# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Fixed
- Error handling used to throw "Fatal" with a capital letter where it should have been "fatal". All of the throws that are fatal have been updated to use the lowercase version.

## 0.3.4 - 2016-03-02
### Added
- Better logging and error handling for `release` command.

## 0.3.3 - 2016-03-02
### Added
- New `release` command that will read the remotes in your git repository, create a new commit and tag containing both the `package.json` file (if found) and the `CHANGELOG.md` file updated for the new version, then publish the release to GitHub.

## 0.3.2 - 2016-02-21
### Added
- New `copy` command that copies the latest release contents to the clipboard in markdown.

### Fixed
- Some error messages would not display correctly and would throw an error themselves because of passing the wrong data type.

## 0.3.1 - 2016-02-20
### Added
- The status page now shows color-coded unreleased items.

## 0.3.0 - 2016-02-20
### Added
- Two basic API commands have been introduced: `parse` and `stringify`.
- During stringification, the items in a release will now be ordered hierarchically (so "Added" will always come above "Fixed" for example).

### Fixed
- Corrected pluralisation on `status` number of versions.
- If a changelog contained no content at all then an error was thrown when attempting to update (due to the lack of an "Unreleased" header). Now a new header is just created instead.

## 0.2.0 - 2016-02-19
### Added
- Basic `status` command to get info about the changelog.
- Will update package.json version number too if found.

### Fixed
- Always add a newline to the end of a stringified file.

## 0.1.1 - 2016-02-18
### Added
- `bump` command that updates the changelog to the next version.

## 0.1.0 - 2016-02-18
### Added
- The ability to use all changelog commands to add changelog content.
- An initialise function to create a blank changelog in the current directory.
- Parse the CHANGELOG.md file to JSON format.
