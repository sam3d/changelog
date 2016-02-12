// Dependencies
var fs = require("fs");
var colors = require("colors/safe");

changelog = {

    // Public (front-facing, exposed components)
    public : {

        // Initialize a new changelog
        init : function(){

            // Get the default text
            var text = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n## Unreleased";

            // Check whether file exists
            fs.stat("CHANGELOG.md", function(err, stats){
                if (!err) {
                    changelog.display("There is already a CHANGELOG.md file in " + process.cwd());
                } else {
                    // Write the file
                    fs.writeFile("CHANGELOG.md", text, function(err){
                        if (err) {
                            changelog.display("Could not write a new changelog file", "Fatal");
                        } else {
                            console.log("Initialized empty CHANGELOG.md file in " + process.cwd());
                        }
                    });
                }
            });

        },

        // Destory any changelog file in the current directory
        destroy : function(){

            // Find out if file exists
            fs.stat("CHANGELOG.md", function(err, stats){
                if (!err) {

                    // Found the file, delete it
                    fs.unlink("CHANGELOG.md", function(err){
                        if (err) {
                            changelog.display("Could not delete the CHANGELOG.md file", "Fatal");
                        } else {
                            changelog.display("Removed CHANGELOG.md file from current directory");
                        }
                    })

                } else {
                    changelog.display("Could not find a CHANGELOG.md file in " + process.cwd(), "Fatal");
                }
            })

        },

        // Show the documentation
        docs : function(){

            console.log("usage: changelog <command> [<args]");
            console.log("beta: " + colors.grey("grey") + " items are not yet available\n");
            console.log("Basic Commands:");
            console.log("   help      List the documentation");
            console.log("   init      Initialize a blank CHANGELOG.md file in the current directory");
            console.log(colors.grey("   parse     Parse the CHANGELOG.md file to json format\n"));
            console.log("Changelog Commands:");
            console.log(colors.grey("   add       'Added' for new features"));
            console.log(colors.grey("   change    'Changed' for changes in existing functionality"));
            console.log(colors.grey("   deprecate 'Deprecated' for once stable features removed in upcoming releases"));
            console.log(colors.grey("   remove    'Removed' for deprecated features removed in this release"));
            console.log(colors.grey("   fix       'Fixed' for any bug fixes"));
            console.log(colors.grey("   secure    'Security' to invite users to upgrade in case of vulnerabilities\n"));
            console.log("Danger Zone:");
            console.log("   destroy   Completely destroy any changelog file in the current directory");
        }

    },

    // Display a message to the console
    display: function(msg, type){
        if (type) {
            console.log(type + ": " + msg);
        } else {
            console.log("changelog: " + msg);
        }
    }

}

// Export back to app
module.exports = changelog;
