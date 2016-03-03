module.exports = function(docs, i) {

    // Store the release data
    i = i ? i : 0;
    var itemString = "";

    // Loop over the content
    for (var key in docs[i].content) {
        if (docs[i].content.hasOwnProperty(key)) {

            itemString += "\n### " + key + "";
            for (var j = 0; j < docs[i].content[key].length; j++) {
                itemString += "\n- " + docs[i].content[key][j];
                if (j === (docs[i].content[key].length - 1)) {
                    itemString += "\n";
                }
            }

        }
    }

    // Return the content
    return itemString.trim();

}
