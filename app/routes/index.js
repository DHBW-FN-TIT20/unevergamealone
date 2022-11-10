/**
 * Routers of the static files
 * @module index
 */
let express = require('express');
let router = require('express-promise-router')();
let indexController = require('../controllers/indexController');

/**
 * GET of /index.html
 */
router.get('/', async function(req, res, next){
    await indexController.showIndex(req, res, next);
});

/**
 * GET of /impressum
 */
router.get('/impressum', async function(req, res, next){
    await indexController.showImpressum(req, res, next);
});


// /**
//  * GET of /sitemap.xml
//  */
router.get('/sitemap.xml', async function(req, res, next){
    await indexController.showSitemap(req, res, next);
});

// /**
//  * GET of /robots.txt
//  */
router.get('/robots.txt', async function(req, res, next){
    await indexController.showRobots(req, res, next);
});

module.exports = router;