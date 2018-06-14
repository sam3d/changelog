const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const cwd = process.cwd();

function fatal(msg) {
    console.log(chalk.red(`fatal: ${msg}`));
    process.exit(1);
}

function init() {
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
}

module.exports = {
    init
};
