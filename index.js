#!/usr/bin/env node

// Library functions
var changelog = require("./changelog");

// Remove first two unneeded CLI args
process.argv.splice(0, 2);

if (process.argv.length === 0) {

    // No command line arugments specified, show the docs
    changelog.public.docs();

} else {

    // Command line arguments specified, go through them
    switch(process.argv[0]) {

        // Show the help
        case "help":
            changelog.public.docs();
            break;

        // Initialize a blank changelog file
        case "init":
            changelog.public.init();
            break;

        // Destroy any changelog file
        case "destroy":
            changelog.public.destroy();
            break;

        case "parse":
            if (process.argv[1]) {
                changelog.public.parse(process.argv[1]);
            } else {
                changelog.public.parse();
            }
            break;

        case "add":
        case "change":
        case "deprecate":
        case "remove":
        case "fix":
        case "secure":
            changelog.display("'"  + process.argv[0] + "' is not available yet. Sorry :/");
            break;

        default:
            // Unrecognised command supplied, show error
            changelog.display("'" + process.argv[0] + "' is not a changelog command. See 'changelog help'.");

    }

}
