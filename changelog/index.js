const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const editor = require("editor");

const cwd = process.cwd();
const filename = "CHANGELOG.md";

function fatal(msg) {
    console.log(chalk.red(`fatal: ${msg}`));
    process.exit(1);
}

async function read() {
    let file = path.join(cwd, filename);

    return new Promise(resolve => {
        fs.readFile(file, "utf8", (err, data) => {
            if (err) fatal(`Could not find a ${filename} file in ${cwd}`);
            else resolve(data);
        });
    });
}

async function write(changelog) {
    let file = path.join(cwd, filename);

    return new Promise(resolve => {
        fs.writeFile(file, err => {
            if (err) fatal(`Could not write to ${filename}`);
            else resolve();
        });
    });
}

// TODO: Refactor this section, as it was just copied over
function parse(data) {
    var docs = [];

    // Get the links
    var links = {};
    var newLines = data.split("\n"); // Seperate into newlines
    data = ""; // Clear out data

    // Loop over the newlines
    for (var i = 0; i < newLines.length; i++) {

        // Get the line
        var line = newLines[i];

        // Search for link
        if (line.split(/\[.*\]:/).length > 1) {
            var link = line.split(": ")[1].trim();
            var version = line.split(": ")[0].split("[").join("").split("]").join("").trim();
            links[version] = link;
        } else {
            data += line + "\n";
        }

    }

    // Get releases
    var releases = data.split("\n## ").slice(1); // Seperate by markdown headers

    // Loop over the releases and create final object
    for (var i = 0; i < releases.length; i++) {

        // Get release data
        var release = releases[i];

        // Get data from item
        var rawVersion = release.split(" ")[0].split("\n")[0];
        var version = rawVersion.split("[").join("").split("]").join("");
        var released = (version !== "Unreleased");
        var date = released ? new Date(release.split(" ")[2].split("\n")[0]) : null;
        var link = (version == rawVersion) ? false : links[version];

        // Storing all of the actual release content
        var content = {};

        // Extract the headers and content
        var headers = release.split("\n### ");
        headers.splice(0, 1);
        for (var j = 0; j < headers.length; j++) {

            // Get the titles and put them in the object
            var header = headers[j].split("\n")[0];
            var notes = headers[j].split("\n- ");
            notes.splice(0, 1);

            for (var k = 0; k < notes.length; k++) {
                notes[k] = notes[k].split("\n").join(" ").trim();
            }

            content[header] = notes;

        }

        // Push object to array
        docs.push({
            version: version,
            released: released,
            date: date,
            link: link,
            content: content
        });
    }

    return docs;
}

// TODO: Refactor this section, as it was just copied over
function stringify(data) {
    var output = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n";
    var linkString = "";

    // Loop over the data
    for (var i = 0; i < data.length; i++) {

        // Get release data
        var release = data[i];

        // Create the release string
        var releaseString = "";

        // Get the release version
        if (release.link) {
            releaseString = "## [" + release.version + "]";
            linkString += "[" + release.version + "]: " + release.link + "\n";
        } else {
            releaseString = "## " + release.version;
        }

        // Get the release date
        if (release.date) {
            var date = new Date(release.date);

            // Get properties from date object
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            // Normalise the 0 values
            month = month < 10 ? month = "0" + month : month;
            day = day < 10 ? day = "0" + day : day;

            releaseString += " - " + year + "-" + month + "-" + day;
        }

        // Loop over expected content in the correct order
        var headers = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"];
        for (var j = 0; j < headers.length; j++) {

            // Get the header
            var header = headers[j];

            // Check whether it exists
            if (release.content[header]) {

                // It exists, loop over inner content
                releaseString += "\n### " + header;
                for (var k = 0; k < release.content[header].length; k++) {
                    releaseString += "\n- " + release.content[header][k];
                    if (k === (release.content[header].length - 1)) {
                        releaseString += "\n";
                    }
                }

            }

        }

        // Loop over any additional custom headers
        for (var key in release.content) {
            if (release.content.hasOwnProperty(key) && headers.indexOf(key) === -1) {
                releaseString += "\n### " + key;
                for (var j = 0; j < release.content[key].length; j++) {
                    releaseString += "\n- " + release.content[key][j];
                    if (j === (release.content[key].length - 1)) {
                        releaseString += "\n";
                    }
                }
            }
        }

        // End line
        releaseString += "\n";

        // Place releaseString into the final output
        output += releaseString;

    }

    // Add the links on the end
    output += linkString + "\n";

    // Callback
    return output.trim() + "\n";
}

const cli = {
    init() {
        let file = path.join(cwd, filename);

        checkExists()
        .then(createNewFile)
        .catch(fatal);

        async function checkExists() {
            let exists = await fs.pathExists(file);

            if (exists) throw `There is already a ${filename} file in ${cwd}`;
            else return;
        }

        async function createNewFile() {
            let header = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n## Unreleased\n";

            fs.writeFile(file, header, err => {
                if (err) throw "Could not write a new changelog file";
                else console.log(`Initialized empty ${filename} in ${cwd}`);
            });
        }
    },

    async parse() {
        let changelog = await read();
        changelog = parse(changelog);
        let string = JSON.stringify(changelog, null, 4);

        console.log(string);
    },

    // TODO: Refactor this as most of it was just copied over
    async status() {
        let changelog = await read();
        changelog = parse(changelog);

        // The final status information
        var statusString = "";

        // Get information about the changelog
        if (!changelog[0].released) {
            if (changelog.length > 1) {
                statusString += "There have been " + (changelog.length - 1) + " versions released";
                statusString += "\nThe most recent of these being v" + changelog[1].version + " from " + moment(changelog[1].date).fromNow();
            } else {
                statusString += "The changelog has no releases to show";
            }

            // Check whether there is any unreleased content
            if (changelog[0].content) {

                statusString += "\n\nUnreleased content:\n  (use \"changelog bump [version | patch | minor | major]\" to release)\n";

                // Loop over the content
                for (var key in changelog[0].content) {
                    if (changelog[0].content.hasOwnProperty(key)) {

                        // Contain the inner string of the item
                        var itemString = "";

                        itemString += "\n  " + key + ":";
                        for (var i = 0; i < changelog[0].content[key].length; i++) {
                            itemString += "\n    - " + changelog[0].content[key][i];
                            if (i === (changelog[0].content[key].length - 1)) {
                                itemString += "\n";
                            }
                        }

                        // Add the item string to the status string with colors
                        switch (key) {
                            case "Added":
                                statusString += chalk.green(itemString);
                                break;
                            case "Changed":
                                statusString += chalk.yellow(itemString);
                                break;
                            case "Deprecated":
                                statusString += chalk.grey(itemString);
                                break;
                            case "Removed":
                                statusString += chalk.red(itemString);
                                break;
                            case "Fixed":
                                statusString += chalk.blue(itemString);
                                break;
                            case "Security":
                                statusString += chalk.magenta(itemString);
                                break;
                            default:
                                statusString += itemString;
                                break;
                        }

                    }
                }

            } else {
                statusString += "\nThere is no content in \"Unreleased\" to show";
            }

        } else {

            if (changelog.length === 1) {
                statusString += "There has been " + changelog.length + " version released";
            } else if (changelog.length > 1) {
                statusString += "There have been " + changelog.length + " versions released";
            }

            if (changelog.length > 0) {
                statusString += "\nThe most recent of these being v" + changelog[0].version + " from " + moment(changelog[0].date).fromNow();
            } else {
                statusString += "The changelog has no releases to show";
            }
        }

        // Write it to the console
        console.log(statusString);
    },

    // TODO: Refactor this section, as it was just copied over
    async update(type) {
        let changelog = await read();
        changelog = parse(changelog);

        // Different words, phrases and text sections
        let header = "";
        let verb = "";
        let past = "";

        // Get the correct section header based on type
        switch (type) {
            case "add":
                header = "Added";
                verb = "added";
                past = "additions";
                break;
            case "change":
                header = "Changed";
                verb = "changed";
                past = "changes";
                break;
            case "deprecate":
                header = "Deprecated";
                verb = "deprecated";
                past = "deprecations";
                break;
            case "remove":
                header = "Removed";
                verb = "removed";
                past = "removals";
                break;
            case "fix":
                header = "Fixed";
                verb = "fixed";
                past = "fixes";
                break;
            case "secure":
                header = "Security";
                verb = "secured";
                past = "secures";
                break;
        }

        // Add unreleased header if one is not already present
        var newHeader = ""; // To show an additional message after creation
        if (!changelog.length) {
            changelog.unshift({
                version: "Unreleased",
                released: false,
                date: null,
                link: null,
                content: {}
            });
            newHeader = "\n# There was no content - creating new \"Unreleased\" header.";
        } else if (changelog[0].released) {
            changelog.unshift({
                version: "Unreleased",
                released: false,
                date: null,
                link: null,
                content: {}
            });
            newHeader = " - creating new \"Unreleased\" header.";
        }

        // Generate update edit message
        var msg = "\n# Please enter what you have " + verb + " in this new version. Lines\n# starting with '#' will be ignored and an empty message aborts\n# the update. Multiple lines will be treated as multiple " + past + ".";
        if (changelog.length > 1) {
            msg += "\n# Currently on version " + changelog[1].version;
        }
        msg += newHeader;
        msg += "\n#";

        // Create .UPDATE_EDITMSG file with above contents and open $EDITOR
        fs.writeFile(".UPDATE_EDITMSG", msg, function(err) {
            if (err) {
                console.log("Could not create temporary file in " + process.cwd());
            } else {
                editor(".UPDATE_EDITMSG", function(code, sig) {

                    // Get the content from the file
                    fs.readFile(".UPDATE_EDITMSG", "utf8", function(err, contents) {
                        if (err) {
                            console.log("Could not read from temporary file in " + process.cwd());
                        } else {

                            // Delete/clean-up the temporary file
                            fs.unlink(".UPDATE_EDITMSG");

                            // Perform validation on update contents
                            var lines = contents.split("\n"); // Seperate into newlines
                            var items = []; // An array of the actual items to add
                            for (var i = 0; i < lines.length; i++) {

                                // Ignore lines with absolutely no content or start with "#"
                                if (lines[i].length > 0 && lines[i].split(" ").join("").split("")[0] !== "#") {
                                    items.push(lines[i]);
                                }

                            }

                            // Abort if no content
                            if (items.length === 0) {
                                console.log("No message was supplied so the update was aborted");
                            } else {

                                // Make sure header exists
                                if (!changelog[0].content[header]) {
                                    changelog[0].content[header] = [];
                                }

                                // For each update item, add it to the changelog
                                for (var i = 0; i < items.length; i++) {
                                    changelog[0].content[header].push(items[i]);
                                }

                                // Stringify and save to file
                                let data = stringify(changelog);
                                fs.writeFile("CHANGELOG.md", data, function(err) {
                                    if (err) {
                                        console.log("Could not write updated changelog");
                                    } else {

                                        // Make sure pluralisation of "item" is correct
                                        if (items.length === 1) {
                                            console.log("Added " + items.length + " item to \"" + header + "\"");
                                        } else {
                                            console.log("Added " + items.length + " items to \"" + header + "\"");
                                        }

                                    }
                                });
                            }
                        }
                    });
                });
            }
        });
    }
};

module.exports = {
    cli
};
