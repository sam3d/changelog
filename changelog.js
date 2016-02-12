// Dependencies
var fs = require("fs");

// Export back to app
module.exports = {

    // Initialize a new changelog
    init : function(){

        // Get the default text
        var text = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n## [Unreleased]";

        // Check whether file exists
        fs.stat("CHANGELOG.md", function(err, stats){
            if (!err) {
                console.log("There is already a CHANGELOG.md file in " + process.cwd());
            } else {
                // Write the file
                fs.writeFile("CHANGELOG.md", text, function(err){
                    if (err) {
                        console.error("Fatal", "Could not write a new changelog file");
                    } else {
                        console.log("Initialized empty CHANGELOG.md file in " + process.cwd());
                    }
                });
            }
        });

    },

    // Show the documentation
    docs : function(){

        console.log("usage: changelog <command> [<args]");
        console.log("");
        console.log("Basic Commands:");
        console.log("   help        List the documentation");
        console.log("   init        Initialize a blank CHANGELOG.md file in the current directory");

    }

}

// Throw an error
console.error = function(type, msg){
    console.log(type + ": " + msg);
}
