// Dependencies
var fs = require("fs");

module.exports = function(){

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

};
