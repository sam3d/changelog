module.exports = function(data, callback){

    // Final output JSON
    var docs = [];
    var err = false;

    // Get the links
    var links = {};
    var newLines = data.split("\n"); // Seperate into newlines
    data = ""; // Clear out data

    // Loop over the newlines
    for (var i = 0; i < newLines.length; i++){

        // Get the line
        var line = newLines[i];

        // Search for link
        if (line.split(/\[.*\]:/).length > 1) {
            var link = line.split(": ")[1].trim();
            var version = line.split(": ")[0].split("[").join("").split("]").join("").trim();
            links[version] = link;
        } else {
            data += line + "\n";
        }

    }

    // Get releases
    var releases = data.split("\n## ").slice(1); // Seperate by markdown headers

    // Loop over the releases and create final object
    for (var i = 0; i < releases.length; i++){

        // Get release data
        var release = releases[i];

        // Get data from item
        var rawVersion = release.split(" ")[0].split("\n")[0];
        var version = rawVersion.split("[").join("").split("]").join("");
        var released = (version !== "Unreleased");
        var date = released ? new Date(release.split(" ")[2].split("\n")[0]) : null;
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

            for (var k = 0; k < notes.length; k++){
                notes[k] = notes[k].split("\n").join(" ").trim();
            }

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
};
