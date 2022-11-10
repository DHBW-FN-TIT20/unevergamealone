const app = require('../app');
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
    showIndex: async function (req, res, next) {        
        await app.db.connect();
        res.sendFile("home.html", { root: __dirname + "/../public/" });
    },

    /**
     * GET-Static static impressum.html
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str static impressum.html
     */
    showImpressum: async function (req, res, next) {
        res.sendFile("impressum.html", { root: __dirname + "/../public/" });
    },

    /**
     * GET-Static sitemap.xml
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str static sitemap.xml
     */
    showSitemap: async function (req, res, next) {
        res.sendFile("sitemap.xml", { root: __dirname + "/../public/" });
    },

    /**
     * GET-Static static robots.txt
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str static robots.txt
     */
    showRobots: async function (req, res, next) {
        res.sendFile("robots.txt", { root: __dirname + "/../public/" });
    }
};