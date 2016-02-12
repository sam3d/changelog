#!/usr/bin/env node

// Library functions
var changelog = require("./changelog");

// Remove first two unneeded CLI args
process.argv.splice(0, 2);

if (process.argv.length === 0) {

    // No command line arugments specified, show the docs
    changelog.docs();

} else {

    // Command line arguments specified, go through them
    switch(process.argv[0]) {

        // Show the help
        case "help":
            changelog.docs();
            break;

        // Initialize a blank changelog file
        case "init":
            changelog.init();
            break;

        default:
            // Unrecognised command supplied, show error
            console.log("changelog: '" + process.argv[0] + "' is not a changelog command. See 'changelog help'.");

    }

}
