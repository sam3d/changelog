#!/usr/bin/env node
const changelog = require("./changelog");
const isModule = !(require.main === module);
const args = process.argv;

if (isModule) useAsModule();
else useAsCLI();

function useAsModule() {
    exports.parse = changelog.parse;
    exports.stringify = changelog.stringify;
}

function useAsCLI() {
    args.splice(0, 2); // Remove first two CLI args

    if (args.length === 0) printDocs();
    else parseArgs();
}

function parseArgs() {
    switch (args[0]) {
        case "help": printDocs(); break;
        case "init": changelog.public.init(); break;
        case "destroy": changelog.public.destroy(); break;

        case "parse":
            if (args[1]) changelog.public.parse(args[1]);
            else changelog.public.parse();
            break;

        case "add":
        case "change":
        case "deprecate":
        case "remove":
        case "fix":
        case "secure":
            changelog.public.update(args[0]);
            break;

        case "bump": changelog.public.bump(args[1]); break;
        case "copy": changelog.public.copy(); break;
        case "release": changelog.public.release(); break;
        case "status": changelog.public.status(); break;

        default:
            changelog.display("'" + args[0] + "' is not a changelog command. See 'changelog help'.");
            break;
    }
}

function printDocs() {
    console.log(`usage: changelog <command> [<args>]
Basic Commands:
   help      List the documentation
   init      Initialize a blank CHANGELOG.md file in the current directory
   parse     Parse the CHANGELOG.md file to JSON format
   status    Get the changelog information and version status

Changelog Commands:
   add       'Added' for new features
   change    'Changed' for changes in existing functionality
   deprecate 'Deprecated' for once stable features removed in upcoming releases
   remove    'Removed' for deprecated features removed in this release
   fix       'Fixed' for any bug fixes
   secure    'Security' to invite users to upgrade in case of vulnerabilities

Version Commands:
   bump       Update 'Unreleased' section to new version
   copy       Copy the latest version to the clipboard
   release    Create a new commit & tag and published the release to GitHub

Danger Zone:
   destroy   Completely destroy any changelog file in the current directory
    `);
}
