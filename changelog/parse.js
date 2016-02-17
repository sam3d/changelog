module.exports = function(data, callback){

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
                notes[k] = notes[k].split("\n").join(" ");
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
