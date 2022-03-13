/**
 * @module
 * This module exports controller functionality for the index file of the webserver
 */
module.exports = {
    showIndex: function(req, res, next) {
        res.sendFile("index.html");
    },
    showImpressum: function(req, res, next) {
        // TODO: change from absolute path to relative path and fix 'TypeError: path must be absolute or specify root to res.sendFile'
        res.sendFile("/home/floqueboque/Projects/Programming/WebEngineering/unevergamealone/public/impressum.html");
    }
};