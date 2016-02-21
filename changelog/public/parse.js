// Dependencies
var fs = require("fs");

module.exports = function(output){

    // Find out if file exists
    fs.readFile("CHANGELOG.md", "utf8", function(err, data){
        if (!err) {

            // File does exist, give contents to parse function
            changelog.parse(data, function(err, docs){

                if (err) {
                    changelog.display(null, "parseError");
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
                                fs.writeFile(output, JSON.stringify(docs, null, 4), function(err){
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
            changelog.display(null, "fileNotFound");
        }
    });

};
