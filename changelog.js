// Dependencies
var fs = require("fs");

// Export back to app
module.exports = {

    // Initialize a new changelog
    init : function(){

        // Get the default text
        var text = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n## Unreleased";

        // Check whether file exists
        fs.stat("CHANGELOG.md", function(err, stats){
            if (!err) {
                console.display("There is already a CHANGELOG.md file in " + process.cwd());
            } else {
                // Write the file
                fs.writeFile("CHANGELOG.md", text, function(err){
                    if (err) {
                        console.display("Could not write a new changelog file", "Fatal");
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
                        console.display("Could not delete the CHANGELOG.md file", "Fatal");
                    } else {
                        console.display("Removed CHANGELOG.md file in current directory");
                    }
                })

            } else {
                console.display("Could not find a CHANGELOG.md file in " + process.cwd(), "Fatal");
            }
        })

    },

    // Show the documentation
    docs : function(){

        console.log("usage: changelog <command> [<args]\n");
        console.log("Basic Commands:");
        console.log("   help        List the documentation");
        console.log("   init        Initialize a blank CHANGELOG.md file in the current directory\n");
        console.log("Danger Zone:");
        console.log("   destroy     Completely destroy any changelog file in the current directory");
    }

}

// Display a message to the console
console.display = function(msg, type){
    if (type) {
        console.log(type + ": " + msg);
    } else {
        console.log("changelog: " + msg);
    }
}
