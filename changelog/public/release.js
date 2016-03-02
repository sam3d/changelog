// Dependencies
var fs = require("fs");
var publishRelease = require("publish-release");
var ghauth = require("ghauth");
var spinner = require("simple-spinner");
var exec = require("child_process").exec;
var isGitUrl = require("is-git-url");
var parseGithubUrl = require("parse-github-url");

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
                            changelog.display("Could not get git remotes. Are you sure this is a git repository?", "Fatal");
                        } else {

                            // Split the remotes
                            var remotes = stdout.split(/[\s\t]+/);

                            // Look for origin URL
                            if (remotes.indexOf("origin") != -1){

                                // Make sure it's a git URL
                                var url = remotes[remotes.indexOf("origin") + 1];
                                if (isGitUrl(url)){

                                } else {

                                    // Not a git URL
                                    changelog.display("The remote 'origin' does not contain a correct git url", "Fatal");

                                }

                            } else {

                                // You need to have "origin" as a remote
                                changelog.display("You do not have a remote called 'origin' in your repository");

                            }

                        }
                    });

                }
            });

        }
    });

};
