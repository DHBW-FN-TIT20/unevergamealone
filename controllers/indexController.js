/**
 * Controller for all static files
 * @module indexController
 */
module.exports = {
    /**
     * GET-Static static index.html
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str static index.html
     */
    showIndex: function(req, res, next) {
        res.sendFile("index.html");
    },
    /**
     * GET-Static static impressum.html
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str static impressum.html
     */
    showImpressum: function(req, res, next) {
        // TODO: change from absolute path to relative path and fix 'TypeError: path must be absolute or specify root to res.sendFile'
        res.sendFile("/home/floqueboque/Projects/Programming/WebEngineering/unevergamealone/public/impressum.html");
    }
};