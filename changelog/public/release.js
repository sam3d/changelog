// Dependencies
var fs = require("fs");
var publishRelease = require("publish-release");
var ghauth = require("ghauth");
var spinner = require("simple-spinner");

module.exports = function(){

    // Read the changelog file
    fs.readFile("CHANGELOG.md", "utf8", function(err, data){
        if (err){
            changelog.display("fileNotFound");
        } else {

            // Parse the file
            changelog.parse(data, function(err, docs){
                if (err){
                    changelog.display("parseError");
                } else {

                    // CHANGELOG read and parsed correctly, attempt
                    // to read the git remotes and then publish the
                    // release to GitHub.

                }
            });

        }
    });

};
