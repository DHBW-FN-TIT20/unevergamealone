/**
 * @module
 * This module exports controller functionality for the index file of the webserver
 */
module.exports = {
    showIndex: function(req, res, next) {
        res.sendFile("index.html");
    }
};