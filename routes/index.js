/**
 * Routers of the static files
 * @module index
 */
let express = require('express');
let router = express.Router();
let indexController = require('../controllers/indexController');

/**
 * GET of /index.html
 */
router.get('/', indexController.showIndex);

/**
 * GET of /impressum
 */
router.get('/impressum', indexController.showImpressum);

/**
 * GET of /sitemap.xml
 */
router.get('/sitemap.xml', indexController.showSitemap);

/**
 * GET of /robots.txt
 */
router.get('/robots.txt', indexController.showRobots);

module.exports = router;