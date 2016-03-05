// Dependencies
var semver = require("semver");
var fs = require("fs");
var inquirer = require("inquirer");
var _ = require("underscore");

module.exports = function (type) {

    if (!semver.valid(type)) {
      type = "patch";
    }

    // Make sure changelog file exists
    fs.readFile("CHANGELOG.md", "utf8", function(err, data) {
        if (!err) {

            // File does exist, give contents to parse function
            changelog.parse(data, function(err, docs) {

                if (err) {
                    changelog.display(null, parseError);
                } else {

                    // Make sure there is content to bump
                    if (docs[0].released || Object.keys(docs[0].content).length === 0) {
                        changelog.display("No CHANGELOG.md content available to perform version bump", "Fatal");
                    } else {

                        // Get the previous version
                        var version = (docs.length > 1) ? docs[1].version : "0.0.0";

                        // Get available changes
                        var choices = []
                        if (docs[0].content.Added) {
                            docs[0].content.Added.forEach(function(el) {
                                choices.push("Added: " + el);
                            });
                        }
                        if (docs[0].content.Changed) {
                            docs[0].content.Changed.forEach(function(el) {
                                choices.push("Changed: " + el);
                            });
                        }
                        if (docs[0].content.Depreciated) {
                            docs[0].content.Depreciated.forEach(function(el) {
                                choices.push("Depreciated: " + el);
                            });
                        }
                        if (docs[0].content.Removed) {
                            docs[0].content.Removed.forEach(function(el) {
                                choices.push("Removed: " + el);
                            });
                        }
                        if (docs[0].content.Fixed) {
                            docs[0].content.Fixed.forEach(function(el) {
                                choices.push("Fixed: " + el);
                            });
                        }
                        if (docs[0].content.Security) {
                            docs[0].content.Security.forEach(function(el) {
                                choices.push("Security: " + el);
                            });
                        }

                        // Prompt for options
                        inquirer.prompt([{
                          type: "checkbox",
                          message: "Please select the changes to bump",
                          name: "toBump",
                          choices: choices
                        }], function(answers) {

                            var backup = JSON.parse(JSON.stringify(docs[0]));
                            var content = {};

                            // Parse response
                            answers.toBump.forEach(function(el) {
                                if (el.startsWith("Added: ")) {
                                    if (!content.Added)
                                        content.Added = []
                                    content.Added.push(el.replace(/^Added: +/, ""));
                                }
                                if (el.startsWith("Changed: ")) {
                                    if (!content.Changed)
                                        content.Changed = []
                                    content.Changed.push(el.replace(/^Changed: +/, ""));
                                }
                                if (el.startsWith("Depreciated: ")) {
                                    if (!content.Depreciated)
                                        content.Depreciated = []
                                    content.Depreciated.push(el.replace(/^Depreciated: +/, ""));
                                }
                                if (el.startsWith("Removed: ")) {
                                    if (!content.Removed)
                                        content.Removed = []
                                    content.Removed.push(el.replace(/^Removed: +/, ""));
                                }
                                if (el.startsWith("Fixed: ")) {
                                    if (!content.Fixed)
                                        content.Fixed = []
                                    content.Fixed.push(el.replace(/^Fixed: +/, ""));
                                }
                                if (el.startsWith("Security: ")) {
                                    if (!content.Security)
                                        content.Security = []
                                    content.Security.push(el.replace(/^Security: +/, ""));
                                }
                            });

                            var newVersion = semver.inc(version, type);
                            docs[0].version = newVersion;
                            docs[0].released = true;
                            docs[0].date = new Date();
                            docs[0].content = content;

                            // Attempt to read the package.json file and bump
                            fs.readFile("package.json", "utf8", function(err, data) {
                                if (!err) {
                                  data = JSON.parse(data);
                                  data.version = newVersion;
                                  fs.writeFile("package.json", JSON.stringify(data, null, 2), function(err) {
                                      if (!err) {
                                        console.log("found: package.json and updated version");
                                      }
                                  });
                                }
                            });

                            // Remove handled changes
                            if (backup.content.Added) {
                                backup.content.Added = _.difference(backup.content.Added, docs[0].content.Added);
                                if (backup.content.Added.length == 0)
                                    delete backup.content.Added;
                            }
                            if (backup.content.Changed) {
                                backup.content.Changed = _.difference(backup.content.Changed, docs[0].content.Changed);
                                if (backup.content.Changed.length == 0)
                                    delete backup.content.Changed;
                            }
                            if (backup.content.Depreciated) {
                                backup.content.Depreciated = _.difference(backup.content.Depreciated, docs[0].content.Depreciated);
                                if (backup.content.Depreciated.length == 0)
                                    delete backup.content.Depreciated;
                            }
                            if (backup.content.Removed) {
                                backup.content.Removed = _.difference(backup.content.Fixed, docs[0].content.Removed);
                                if (backup.content.Removed.length == 0)
                                    delete backup.content.Removed;
                            }
                            if (backup.content.Fixed) {
                                backup.content.Fixed = _.difference(backup.content.Fixed, docs[0].content.Fixed);
                                if (backup.content.Fixed.length == 0)
                                    delete backup.content.Fixed;
                            }
                            if (backup.content.Security) {
                                backup.content.Security = _.difference(backup.content.Security, docs[0].content.Security);
                                if (backup.content.Security.length == 0)
                                    delete backup.content.Security;
                            }

                            // Add to the top of the changelog
                            if (!backup.content)
                              docs.unshift(backup);

                            // Save the updated file
                            changelog.stringify(docs, function(err, output) {
                                fs.writeFile("CHANGELOG.md", output, function(err) {
                                    if (err) {
                                        changelog.display("Could not write the updated changelog data to CHANGELOG.md", "Fatal");
                                    } else {
                                        changelog.display("Updated from " + version + " -> " + newVersion);
                                    }
                                });
                            });

                        });

                    }

                }

            });

        } else {
          changelog.display(null, "fileNotFound");
        }
    });

}
