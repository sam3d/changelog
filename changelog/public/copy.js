// Dependencies
var fs = require("fs");
var ncp = require("copy-paste");

module.exports = function() {

    // Get the changelog
    fs.readFile("CHANGELOG.md", "utf8", function(err, contents) {
        if (err) {
            changelog.display(null, "fileNotFound");
        } else {

            // Parse the changelog
            changelog.parse(contents, function(err, docs) {
                if (err) {
                    changelog.display(null, "parseError");
                } else {

                    // Make sure the changelog has content
                    if (docs.length > 0 && Object.keys(docs[0].content).length > 0) {

                        // Copy it to the users clipboard
                        ncp.copy(changelog.stringifyIndex(docs), function() {
                            changelog.display("The latest data from \"" + docs[0].version + "\" was copied to the clipboard");
                        });


                    } else {
                        changelog.display("There was no content in the changelog to copy", "fatal");
                    }

                }
            });

        }
    });

};
