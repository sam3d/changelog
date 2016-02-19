// Dependencies
var semver = require("semver");
var fs = require("fs");

module.exports = function(type){

    // Make sure changelog file exists
    fs.readFile("CHANGELOG.md", "utf8", function(err, data){
        if (!err){

            // File does exist, give contents to parse function
            changelog.parse(data, function(err, docs){

                if (err) {
                    changelog.display(null, parseError);
                } else {

                    // Make sure there is content to bump
                    if (docs[0].released || Object.keys(docs[0].content).length === 0){
                        changelog.display("No CHANGELOG.md content available to perform version bump", "Fatal");
                    } else {

                        // Get the previous version
                        var version = (docs.length > 1) ? docs[1].version : "0.0.0";

                        // Check the argument
                        if (semver.valid(type)) {

                            // Update to specific version
                            docs[0].version = type;
                            docs[0].released = true;
                            docs[0].date = new Date();

                            // Save the updated file
                            changelog.stringify(docs, function(err, output){
                                fs.writeFile("CHANGELOG.md", output, function(err){
                                    if (err){
                                        changelog.display("Could not write the updated changelog data to CHANGELOG.md", "Fatal");
                                    } else {
                                        changelog.display("Updated from " + version + " -> " + type);
                                    }
                                });
                            });

                        } else {

                            // If the type has not been specified, default to patch
                            type = (type === null || type === undefined) ? "patch" : type;

                            switch (type) {
                                case "patch":
                                case "minor":
                                case "major":
                                    docs[0].version = semver.inc(version, type);
                                    docs[0].released = true;
                                    docs[0].date = new Date();

                                    // Save the updated file
                                    changelog.stringify(docs, function(err, output){
                                        fs.writeFile("CHANGELOG.md", output, function(err){
                                            if (err){
                                                changelog.display("Could not write the updated changelog data to CHANGELOG.md", "Fatal");
                                            } else {
                                                changelog.display("Updated from " + version + " -> " + docs[0].version);
                                            }
                                        });
                                    });
                                    break;

                                default:
                                    changelog.display("'" + type + "' is not a valid version number or update type", "Fatal");
                            }

                        }

                    }

                }

            });

        } else {
            changelog.display(null, "fileNotFound");
        }

    });

};
