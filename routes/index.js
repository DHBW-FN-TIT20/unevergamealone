let express = require('express');
let router = express.Router();
let indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.showIndex);

module.exports = router;