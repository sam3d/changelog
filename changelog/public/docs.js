// Dependencies
var colors = require("colors/safe");

module.exports = function(){
    console.log("usage: changelog <command> [<args>]");
    console.log("beta: " + colors.grey("grey") + " items are not yet available\n");
    console.log("Basic Commands:");
    console.log("   help      List the documentation");
    console.log("   init      Initialize a blank CHANGELOG.md file in the current directory");
    console.log("   parse     Parse the CHANGELOG.md file to JSON format");
    console.log(colors.grey("   status    Get the changelog information and version status\n"));
    console.log("Changelog Commands:");
    console.log("   add       'Added' for new features");
    console.log("   change    'Changed' for changes in existing functionality");
    console.log("   deprecate 'Deprecated' for once stable features removed in upcoming releases");
    console.log("   remove    'Removed' for deprecated features removed in this release");
    console.log("   fix       'Fixed' for any bug fixes");
    console.log("   secure    'Security' to invite users to upgrade in case of vulnerabilities\n");
    console.log("Danger Zone:");
    console.log("   destroy   Completely destroy any changelog file in the current directory");
};
