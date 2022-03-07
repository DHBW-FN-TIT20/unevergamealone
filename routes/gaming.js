let express = require('express');
let router = express.Router();
const app = require('../app')
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const multer = require('multer')
const userValidater = require('../handlers/users.js');
const Game = require('../database/Models/Game/Game');
const { response } = require('../app');
const path = require('path');
const GameCreate = require('../database/Models/Game/GameCreate');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const upload_path = path.join(__dirname, '..', 'public', `images`, `upload`);
        if (!fs.existsSync(upload_path)) {
            fs.mkdirSync(upload_path);
        }
        cb(null, upload_path);
    },
    filename: function (req, file, cb) {
        const filename = `${file.originalname}_${uuidv4()}.${file.mimetype.split("/")[1]}`;
        cb(null, filename)
    }
})

const upload = multer({ storage: storage });

router.get('/', userValidater.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.sendFile("platforms.html", { root: __dirname + "/../public/gaming" });
});

router.get('/show/:games', userValidater.isLoggedIn, (req, res, next) => {
    switch (req.params.games) {
        case "origin":
            let username = req.userData.username;
            let games = app.gameRepo.selectAllGamesWithPlatformByUser("Origin", username);
            let gamesWithUsers = [];
            for (const game of games) {
                let usersOfGame = app.gameRepo.selectUsersOfGame(game.id);
                gamesWithUsers.push(new Game(game.id, game.platformName, game.game, game.coverImage, usersOfGame))
            }
            return res.render('games', { title: 'Origin', games: gamesWithUsers });
        default:
            res.redirect("/gaming");
    }
});

//Get Request to add New Game to the User
router.get('/add', userValidater.isLoggedIn, (req, res, next) => {
    let games = app.gameRepo.selectAll();
    const platforms = app.platformRepo.selectAll();
    let already_selected_games = app.gameRepo.selectAllGamesFromUser(req.userData.username);

    // Remove already mapped games
    let filtered_games = games.filter((value, index, arr) => {
        for (const key in already_selected_games) {
            if (Object.hasOwnProperty.call(already_selected_games, key)) {
                const game = already_selected_games[key];
                if (game.id === value.id) {
                    return false;
                }
            }
        }
        return true;
    });

    return res.render('add-games', { games: filtered_games, platforms: platforms });
});

//Post Request to add New Game to the User
router.post('/add', userValidater.isLoggedIn, (req, res, next) => {
    const username = req.userData.username;
    const games = req.body.games;
    let response;
    try {
        games.forEach(game => {
            app.gameRepo.addGameToUser(game.game_id, username)
        });
        response = res.json({
            status: "success",
            games: games,
            username: username
        });
    } catch (error) {
        response = res.json({
            status: "error",
            msg: JSON.stringify(error)
        })
    }
    finally {
        return response;
    }
});

//Get Request to add New Game to the DB
router.get('/new', userValidater.isLoggedIn, (req, res, next) => {
    const platforms = app.platformRepo.selectAll();
    return res.render('new-games', { platforms: platforms });
});


router.post('/new', upload.single('cover'), userValidater.isLoggedIn, (req, res, next) => {
    const username = req.userData.username;
    const game_name = req.body.game_name;
    const platform = req.body.platform;
    const coverImage = `/images/upload/${req.file.filename}`;
    let response;

    try {
        const new_game = new GameCreate(game_name, coverImage);
        app.gameRepo.insertNewGame(new_game, platform);

        const new_game_id = app.gameRepo.selectByName(game_name).id;
        app.gameRepo.addGameToUser(new_game_id, username);

        response = res.status(201).json({
            status: "success",
            game: game_name
        });
    } catch (error) {
        response = res.status(400).json({
            status: "error",
            msg: JSON.stringify(error)
        })
    }
    finally {
        return response;
    }
});

// Get Request to get a specific Game
router.get('/game/:gamename', userValidater.isLoggedIn, (req, res, next) => {
    let game_name = req.params.gamename;
    try {
        let game = app.gameRepo.selectByName(game_name);
        return res.json(game);
    } catch (error) {
        return res.status(404).json({ msg: `Game ${game_name} not Found` });
    }
})

module.exports = router;