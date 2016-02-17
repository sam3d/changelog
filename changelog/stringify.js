module.exports = function(data, callback){

    // The final string output
    var output = "# Change Log\nAll notable changes to this project will be documented in this file.\nThis project adheres to [Semantic Versioning](http://semver.org/).\n\n";
    var linkString = "";

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

        // Loop over the content
        for (var key in release.content) {
            if (release.content.hasOwnProperty(key)) {
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
    output += "\n" + linkString;

    // Callback
    callback(null, output);
};
