module.exports = function(data, callback){

    // The final string output
    var output = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n";
    var linkString = "";
    var err = false;

    try {

        // Loop over the data
        for (var i = 0; i < data.length; i++){

            // Get release data
            var release = data[i];

            // Create the release string
            var releaseString = "";

            // Get the release version
            if (release.link) {
                releaseString = "## [" + release.version + "]";
                linkString += "[" + release.version + "]: " + release.link + "\n";
            } else {
                releaseString = "## " + release.version;
            }

            // Get the release date
            if (release.date) {
                var date = new Date(release.date);

                // Get properties from date object
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                // Normalise the 0 values
                month = month < 10 ? month = "0" + month : month;
                day = day < 10 ? day = "0" + day : day;

                releaseString += " - " + year + "-" + month + "-" + day;
            }

            // Loop over expected content in the correct order
            var headers = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"];
            for (var j = 0; j < headers.length; j++){

                // Get the header
                var header = headers[j];

                // Check whether it exists
                if (release.content[header]){

                    // It exists, loop over inner content
                    releaseString += "\n### " + header;
                    for (var k = 0; k < release.content[header].length; k++) {
                        releaseString += "\n- " + release.content[header][k];
                        if (k === (release.content[header].length - 1)) {
                            releaseString += "\n";
                        }
                    }

                }

            }

            // Loop over any additional custom headers
            for (var key in release.content) {
                if (release.content.hasOwnProperty(key) && headers.indexOf(key) === -1) {
                    releaseString += "\n### " + key;
                    for (var j = 0; j < release.content[key].length; j++) {
                        releaseString += "\n- " + release.content[key][j];
                        if (j === (release.content[key].length - 1)) {
                            releaseString += "\n";
                        }
                    }
                }
            }

            // End line
            releaseString += "\n";

            // Place releaseString into the final output
            output += releaseString;

        }

        // Add the links on the end
        output += linkString + "\n";

    } catch (e) {
        err = e;
    }

    // Callback
    callback(null, output.trim() + "\n");
};
