# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Fixed
- Corrected pluralisation on `status` number of versions
- If a changelog contained no content at all then an error was thrown when attempting to update (due to the lack of an "Unreleased" header). Now a new header is just created instead.

### Added
- Two basic API commands have been introduced: `parse` and `stringify`

## 0.2.0 - 2016-02-19
### Added
- Basic `status` command to get info about the changelog
- Will update package.json version number too if found

### Fixed
- Always add a newline to the end of a stringified file

## 0.1.1 - 2016-02-18
### Added
- `bump` command that updates the changelog to the next version

## 0.1.0 - 2016-02-18
### Added
- The ability to use all changelog commands to add changelog content
- An initialise function to create a blank changelog in the current directory
- Parse the CHANGELOG.md file to JSON format
