let express = require('express');
let router = express.Router();
const app = require('../app')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../database/Models/User/User');
const userValidater = require('../handlers/users.js');
const Game = require('../database/Models/Game/Game');

router.get('/', userValidater.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.sendFile("platforms.html", { root: __dirname + "/../public/gaming" });
});

router.get('/:games', userValidater.isLoggedIn, (req, res, next) => {
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

module.exports = router;