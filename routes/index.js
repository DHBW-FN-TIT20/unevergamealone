let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'U Never Game Alone 2' });
    console.log("Show index.html");
    res.sendFile("index.html");
});

module.exports = router;