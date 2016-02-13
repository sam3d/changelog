// Dependencies
var fs = require("fs");
var colors = require("colors/safe");

changelog = {

    // Public (front-facing, exposed components)
    public : {

        // Initialize a new changelog
        init : function(){

            // Get the default text
            var text = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n## Unreleased\n\n";

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

        },

        // Destory any changelog file in the current directory
        destroy : function(){

            // Find out if file exists
            fs.stat("CHANGELOG.md", function(err, stats){
                if (!err) {

                    // Found the file, delete it
                    fs.unlink("CHANGELOG.md", function(err){
                        if (err) {
                            changelog.display("Could not delete the CHANGELOG.md file", "Fatal");
                        } else {
                            changelog.display("Removed CHANGELOG.md file from current directory");
                        }
                    });

                } else {
                    changelog.display("Could not find a CHANGELOG.md file in " + process.cwd(), "Fatal");
                }
            });

        },

        // Parse data
        parse : function(output){

            // Find out if file exists
            fs.readFile("CHANGELOG.md", "utf8", function(err, data){
                if (!err) {

                    // File does exist, give contents to parse function
                    changelog.parse(data, function(err, docs){

                        if (err) {
                            changelog.display("Could not parse the CHANGELOG.md file in " + process.cwd() + ". Please make sure it adheres to the keepachangelog.com standard", "Fatal");
                        } else {

                            if (output){

                                // If filename extension not included
                                if (output.split(".").length < 2) {
                                    output += ".json";
                                }

                                // Make sure file doesn't already exist
                                fs.stat(output, function(err, stats){

                                    if (err) {

                                        // Write the file
                                        fs.writeFile(output, docs, function(err){
                                            if (err) {
                                                changelog.display("There was an error writing " + output + " in the current directory", "Fatal");
                                            } else {
                                                changelog.display("CHANGELOG.md parsed to " + process.cwd() + "/" + output);
                                            }
                                        });

                                    } else {

                                        changelog.display(output + " already exists in the current directory", "Fatal");

                                    }

                                });


                            } else {
                                // No file wanted, just print
                                console.log(JSON.stringify(docs, null, 4));
                            }
                        }

                    });

                } else {
                    changelog.display("Could not find a CHANGELOG.md file in " + process.cwd(), "Fatal");
                }
            });

        },

        // Show the documentation
        docs : function(){

            console.log("usage: changelog <command> [<args]");
            console.log("beta: " + colors.grey("grey") + " items are not yet available\n");
            console.log("Basic Commands:");
            console.log("   help      List the documentation");
            console.log("   init      Initialize a blank CHANGELOG.md file in the current directory");
            console.log(colors.grey("   parse     Parse the CHANGELOG.md file to json format\n"));
            console.log("Changelog Commands:");
            console.log(colors.grey("   add       'Added' for new features"));
            console.log(colors.grey("   change    'Changed' for changes in existing functionality"));
            console.log(colors.grey("   deprecate 'Deprecated' for once stable features removed in upcoming releases"));
            console.log(colors.grey("   remove    'Removed' for deprecated features removed in this release"));
            console.log(colors.grey("   fix       'Fixed' for any bug fixes"));
            console.log(colors.grey("   secure    'Security' to invite users to upgrade in case of vulnerabilities\n"));
            console.log("Danger Zone:");
            console.log("   destroy   Completely destroy any changelog file in the current directory");
        }

    },

    // Display a message to the console
    display: function(msg, type){
        if (type) {
            console.log(type + ": " + msg);
        } else {
            console.log("changelog: " + msg);
        }
    },

    // Parse changelog data
    parse: function(data, callback){

        // Final output JSON
        var docs = [];
        var err = false;

        // Get releases
        var releases = data.split("\n## ").slice(1); // Seperate by markdown headers

        // Get links
        var rawLinks = releases[releases.length - 1].split("\n\n")[1].split("\n"); // Raw link data
        rawLinks.pop(); // Remove last (empty) item from raw link array
        var links = {}; // Actual links with version link dictionary pairs
        for (var i = 0; i < rawLinks.length; i++){
            var link = rawLinks[i].split(": ")[1]; // Seperate version numbers from links
            var version = rawLinks[i].split(":")[0].split("[").join("").split("]").join(""); // Remove square brackets from links
            links[version] = link; // Add to the link object
        }

        // Remove links from array
        releases[releases.length - 1] = releases[releases.length - 1].split("\n\n").splice(-2, 1).join("\n\n");

        // Loop over the releases and create final object
        for (var i = 0; i < releases.length; i++){

            // Get release data
            var release = releases[i];

            // Get data from item
            var rawVersion = release.split(" ")[0].split("\n")[0];
            var version = rawVersion.split("[").join("").split("]").join("");
            var released = (version !== "Unreleased");
            var date = new Date(release.split(" ")[2].split("\n")[0]);
            var link = (version == rawVersion) ? false : links[version];

            // Storing all of the actual release content
            var content = {};

            // Extract the headers and content
            var headers = release.split("\n### ");
            headers.splice(0, 1);
            for (var j = 0; j < headers.length; j++){

                // Get the titles and put them in the object
                var header = headers[j].split("\n")[0];
                var notes = headers[j].split("\n- ");
                notes.splice(0, 1);
                content[header] = notes;

            }

            // Push object to array
            docs.push({
                version: version,
                released: released,
                date: date,
                link: link,
                content: content
            });
        }

        // Callback
        callback(err, docs);
    }

};

// Export back to app
module.exports = changelog;
