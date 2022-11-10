/**
 * Routers of the gaming paths
 * @module gaming
 */

let express = require('express');
let router = require('express-promise-router')();
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const multer = require('multer')
const userValidater = require('../handlers/middleware.js');
const path = require('path');
const gamingController = require('../controllers/gamingController');

/**
 * Config of the Fileserver storage of multer
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const upload_path = path.join(__dirname, '..', 'public', `images`, `upload`);
        if (!fs.existsSync(upload_path)) {
            fs.mkdirSync(upload_path);
        }
        cb(null, upload_path);
    },
    filename: function(req, file, cb) {
        const filename = `${file.originalname}_${uuidv4()}.${file.mimetype.split("/")[1]}`;
        cb(null, filename)
    }
})

/**
 * Store the uploaded images in the Server Filesystem
 */
const upload = multer({ storage: storage });

/**
 * GET of /gaming/
 */
router.get('/', userValidater.isLoggedIn, async function(req, res, next){
    await gamingController.showPlatforms(req, res, next);
});

/**
 * GET of /gaming/show/:games
 */
router.get('/show/:games', userValidater.isLoggedIn, async function(req, res, next){
    await gamingController.showGames(req, res, next);
});

/**
 * GET of /gaming/manage
 */
router.get('/manage', userValidater.isLoggedIn, async function(req, res, next){
    await gamingController.showManageGames(req, res, next);
});


/**
 * GET of /gaming/new
 */
router.get('/new', userValidater.isLoggedIn, async function(req, res, next){
    await gamingController.showNewGames(req, res, next);
});

/**
 * GET of /gaming/game/:gamename
 */
router.get('/game/:gamename', userValidater.isLoggedIn, async function(req,res,next){
    await gamingController.getGameByName(req, res, next);
});

/**
 * POST of /gaming/manage
 */
router.post('/manage', userValidater.isLoggedIn, async function(req,res,next){
    await gamingController.addGameToUser(req, res, next);
});

/**
 * POST of /gaming/new
 */
router.post('/new', upload.single('cover'), userValidater.isLoggedIn, async function(req,res,next){
    await gamingController.insertNewGame(req, res, next);
});

/**
 * POST of /gaming/delete
 */
router.post('/delete', userValidater.isLoggedIn, async function(req,res,next){
    await gamingController.deleteGame(req, res, next);
});


module.exports = router;