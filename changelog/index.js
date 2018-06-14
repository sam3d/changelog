const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const cwd = process.cwd();

function fatal(msg) {
    console.log(chalk.red(`fatal: ${msg}`));
    process.exit(1);
}

async function read() {
    let file = path.join(cwd, "CHANGELOG.md");

    return new Promise(resolve => {
        fs.readFile(file, "utf8", (err, data) => {
            if (err) fatal(`Could not find a CHANGELOG.md file in ${cwd}`);
            else resolve(data);
        });
    });
}

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

const cli = {
    init() {
        let file = path.join(cwd, "CHANGELOG.md");

        checkExists()
        .then(createNewFile)
        .catch(fatal);

        async function checkExists() {
            let exists = await fs.pathExists(file);

            if (exists) throw `There is already a CHANGELOG.md file in ${cwd}`;
            else return;
        }

        async function createNewFile() {
            let header = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n## Unreleased\n";

            fs.writeFile(file, header, err => {
                if (err) throw "Could not write a new changelog file";
                else console.log(`Initialized empty CHANGELOG.md in ${cwd}`);
            });
        }
    },

    async parse() {
        let data = await read();
        let parsed = parse(data);
        let formatted = JSON.stringify(parsed, null, 4);
        
        console.log(formatted);
    }
};

module.exports = {
    cli
};
