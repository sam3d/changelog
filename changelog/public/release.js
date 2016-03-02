// Dependencies
var fs = require("fs");
var publishRelease = require("publish-release");
var ghauth = require("ghauth");
var spinner = require("simple-spinner");
var exec = require("child_process").exec;

module.exports = function(){

    // Read the changelog file
    fs.readFile("CHANGELOG.md", "utf8", function(err, data){
        if (err){
            changelog.display(null, "fileNotFound");
        } else {

            // Parse the file
            changelog.parse(data, function(err, docs){
                if (err){
                    changelog.display(null, "parseError");
                } else {

                    // Attempt to get the remotes
                    exec("git remote -v", function(err, stdout, stderr){
                        if (err || stderr){
                            changelog.display("Could not get git remotes", "Fatal");
                        } else {

                            // Split the remotes
                            var remotes = stdout.split(/[\s\t]+/);

                            // Look for origin URL
                            if (remotes.indexOf("origin") != -1){
                                // Found origin
                            } else {
                                // Could not find origin
                            }

                        }
                    });

                }
            });

        }
    });

};
