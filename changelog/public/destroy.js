// Dependencies
var fs = require("fs");

module.exports = function() {

    // Find out if file exists
    fs.stat("CHANGELOG.md", function(err, stats) {
        if (!err) {

            // Found the file, delete it
            fs.unlink("CHANGELOG.md", function(err) {
                if (err) {
                    changelog.display("Could not delete the CHANGELOG.md file", "fatal");
                } else {
                    changelog.display("Removed CHANGELOG.md file from current directory");
                }
            });

        } else {
            changelog.display(null, "fileNotFound");
        }
    });

};
