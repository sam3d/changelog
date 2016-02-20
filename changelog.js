// Load all required files
var requireDir = require("require-dir");
changelog = requireDir("./changelog", {recurse: true});
module.exports = changelog;
