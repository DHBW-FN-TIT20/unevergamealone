let express = require('express');
let router = express.Router();
const app = require('../app')
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const multer = require('multer')
const userValidater = require('../handlers/middleware.js');
const Game = require('../database/Models/Game/Game');
const { response } = require('../app');
const path = require('path');
const GameCreate = require('../database/Models/Game/GameCreate');
const gamingController = require('../controllers/gamingController');

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

const upload = multer({ storage: storage });

router.get('/', userValidater.isLoggedIn, gamingController.showPlatforms);

router.get('/show/:games', userValidater.isLoggedIn, gamingController.showGames);

//Get Request to add New Game to the User
router.get('/manage', userValidater.isLoggedIn, gamingController.showManageGames);

//Post Request to add New Game to the User
router.post('/manage', userValidater.isLoggedIn, gamingController.addGameToUser);

//Get Request to add New Game to the DB
router.get('/new', userValidater.isLoggedIn, gamingController.showNewGames);


router.post('/new', upload.single('cover'), userValidater.isLoggedIn, gamingController.insertNewGame);


router.post('/delete', userValidater.isLoggedIn, gamingController.deleteGame);

// Get Request to get a specific Game
router.get('/game/:gamename', userValidater.isLoggedIn, gamingController.getGameByName);

module.exports = router;