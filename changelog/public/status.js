// Dependencies
var fs = require("fs");
var moment = require("moment");

module.exports = function(){

    // Read in the changelog
    fs.readFile("CHANGELOG.md", "utf8", function(err, data){
        if (err){
            changelog.display(null, "fileNotFound");
        } else {

            // Parse the changelog
            changelog.parse(data, function(err, docs){
                if (err){
                    changelog.display(null, "fileNotFound");
                } else {

                    // The final status information
                    var statusString = "";

                    // Get information about the changelog
                    if (!docs[0].released){
                        if (docs.length > 1){
                            statusString += "There have been " + (docs.length - 1) + " versions released";
                            statusString += "\nThe most recent of these being v" + docs[1].version + " from " + moment(docs[1].date).fromNow();
                        } else {
                            statusString += "The changelog has no releases to show";
                        }
                    } else {
                        if (docs.length > 0){
                            statusString += "There have been " + docs.length + " versions released";
                            statusString += "\nThe most recent of these being v" + docs[0].version + " from " + moment(docs[0].date).fromNow();
                        } else {
                            statusString += "The changelog has no releases to show";
                        }
                    }

                    // Write it to the console
                    console.log(statusString);

                }
            });

        }

    });

};
