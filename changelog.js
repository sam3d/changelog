changelog = {

    public : {
        init : require("./changelog/public/init"),
        destroy : require("./changelog/public/destroy"),
        parse : require("./changelog/public/parse"),
        docs : require("./changelog/public/docs")
    },

    display : require("./changelog/display"),
    parse : require("./changelog/parse"),
    stringify : require("./changelog/stringify"),
    update : require("./changelog/update")

};

// Export back to app
module.exports = changelog;
