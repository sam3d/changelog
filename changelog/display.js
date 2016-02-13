module.exports = function(msg, type){
    if (type) {
        console.log(type + ": " + msg);
    } else {
        console.log("changelog: " + msg);
    }
};
