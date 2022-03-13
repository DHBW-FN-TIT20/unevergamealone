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

module.exports = router;