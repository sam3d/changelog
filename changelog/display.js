module.exports = function(msg, type) {

    if (type) {

        // Check for standard messages
        if (type === "fileNotFound") {
            console.log("Fatal: Could not find a CHANGELOG.md file in " + process.cwd());
        } else if (type === "parseError") {
            console.log("Fatal: Could not parse the CHANGELOG.md file in " + process.cwd() + ". Please make sure it adheres to the keepachangelog.com standard");
        } else {
            console.log(type + ": " + msg);
        }

    } else {
        console.log("changelog: " + msg);
    }

};
