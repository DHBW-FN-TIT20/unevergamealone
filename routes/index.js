var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'U Never Game Alone 2' });
  res.sendFile("index.html");
});

module.exports = router;
