// Dependencies
var fs = require("fs");
var publishRelease = require("publish-release");
var ghauth = require("ghauth");
var spinner = require("simple-spinner");
var exec = require("child_process").exec;
var isGitUrl = require("is-git-url");
var parseGithubUrl = require("parse-github-url");
var fileExists = require("file-exists");

module.exports = function() {

    // Read the changelog file
    fs.readFile("CHANGELOG.md", "utf8", function(err, data) {
        if (err) {
            changelog.display(null, "fileNotFound");
        } else {

            // Parse the file
            changelog.parse(data, function(err, docs) {
                if (err) {
                    changelog.display(null, "parseError");
                } else {

                    // Attempt to get the remotes
                    exec("git remote -v", function(err, stdout, stderr) {
                        if (err || stderr) {
                            changelog.display("Could not get git remotes. Are you sure this is a git repository?", "fatal");
                        } else {

                            // Split the remotes
                            var remotes = stdout.split(/[\s\t]+/);

                            // Look for origin URL
                            if (remotes.indexOf("origin") != -1) {

                                // Make sure it's a git URL
                                var url = remotes[remotes.indexOf("origin") + 1];
                                if (isGitUrl(url)) {

                                    // Parse the URL
                                    var remote = parseGithubUrl(url);

                                    // Authenticate the user with github
                                    ghauth({
                                        configName: "changelog",
                                        scopes: ['repo', 'public_repo'],
                                        note: "Allows the changelog CLI to publish releases",
                                        userAgent: "changelogapp"
                                    }, function(err, auth) {

                                        // If there is an error, notify
                                        if (err) {
                                            changelog.display("Could not authenticate you with GitHub", "fatal");
                                        } else {

                                            // Make sure latest version has been released
                                            if (docs[0].released) {

                                                // Get the version
                                                var version = docs[0].version;

                                                // Create the command
                                                var command = "git reset && ";
                                                command += "git add CHANGELOG.md ";
                                                command += fileExists("package.json") ? "package.json && " : "&& ";
                                                command += "git commit -m '" + version + "' && ";
                                                command += "git tag v" + version + "&& ";
                                                command += "git push origin master && git push origin v" + version;

                                                // Show the progress spinner
                                                changelog.display("Creating new commit and tag for v" + version + " and pushing to GitHub");
                                                spinner.start();

                                                // Make the release!
                                                exec(command, function(err, stdout, stderr) {

                                                    if (err) {
                                                        changelog.display("Could not perform release", "fatal");
                                                    } else {

                                                        spinner.stop();
                                                        changelog.display("Pushed to GitHub, uploading release data for publishing");
                                                        spinner.start();

                                                        // Make sure the changelog has content
                                                        if (docs.length > 0 && Object.keys(docs[0].content).length > 0) {

                                                            // Store the release data
                                                            var itemString = "";

                                                            // Loop over the content
                                                            for (var key in docs[0].content) {
                                                                if (docs[0].content.hasOwnProperty(key)) {

                                                                    itemString += "\n### " + key + "";
                                                                    for (var i = 0; i < docs[0].content[key].length; i++) {
                                                                        itemString += "\n- " + docs[0].content[key][i];
                                                                        if (i === (docs[0].content[key].length - 1)) {
                                                                            itemString += "\n";
                                                                        }
                                                                    }

                                                                }
                                                            }

                                                            // Publish the release
                                                            publishRelease({
                                                                token: auth.token,
                                                                owner: remote.owner,
                                                                repo: remote.name,
                                                                tag: "v" + version,
                                                                name: "v" + version,
                                                                draft: false,
                                                                notes: itemString.trim(),
                                                                prerelease: false
                                                            }, function(err, data) {

                                                                // Stop the spinner
                                                                spinner.stop();

                                                                // If error, notify
                                                                if (err) {
                                                                    changelog.display("There was an error publishing the release to GitHub", "Warning");
                                                                } else {
                                                                    changelog.display("v" + version + " has been published on GitHub");
                                                                }

                                                            });


                                                        } else {
                                                            changelog.display("There was no content in the changelog to copy", "fatal");
                                                        }

                                                    }

                                                });

                                            } else {
                                                changelog.display("The CHANGELOG.md has unreleased content, could not release", "fatal");
                                            }

                                        }

                                    });

                                } else {

                                    // Not a git URL
                                    changelog.display("The remote 'origin' does not contain a correct git url", "fatal");

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
