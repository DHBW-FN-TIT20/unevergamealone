/**
 * Controller for all gaming functions
 * @module gamingController
 */

const app = require('../app')
const Game = require('../database/Models/Game/Game');
const GameCreate = require('../database/Models/Game/GameCreate');
const Platform = require('../database/Models/Platform/Platform');

module.exports = {
    /**
     * GET-Render the platforms
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str rendered HTML string
     */
    showPlatforms: function (req, res, next) {
        let platforms = [];
        const userPlatforms = app.userPlatformRepo.selectAllByUsername(req.userData.username);
        const os = app.userRepo.selectByUsername(req.userData.username).operating_system;

        userPlatforms.forEach(userPlatform => {
            platforms.push(app.platformRepo.selectByID(userPlatform.platformId));
        });

        return res.render('platforms', { title: 'Plattformen', os: os, platforms: platforms });
    },

    /**
     * GET-Render the Games for the user
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns (str|redirect) rendered HTML string or redirect to /gaming
     */
    showGames: function (req, res, next) {
        let title;
        let games;
        let gamesWithUsers = [];

        let os = app.userRepo.selectByUsername(req.userData.username).operating_system;
        let username = req.userData.username;

        if (app.platformRepo.selectByName(req.params.games) === undefined) {
            return res.redirect("/gaming");
        }

        games = app.gameRepo.selectAllGamesWithPlatformByUser(req.params.games, username);
        title = req.params.games;

        // Sort Games Alphabetic
        games.sort((a, b) => {
            if (a.game > b.game) {
                return 1;
            }
            if (a.game < b.game){
                return -1;
            }
            return 0;
        });

        for (const game of games) {
            let usersOfGame = app.gameRepo.selectUsersOfGame(game.id);
            gamesWithUsers.push(new Game(game.id, game.platformName, game.game, game.coverImage, usersOfGame))
        }
        return res.render('games', { title: title, os: os, games: gamesWithUsers });

    },

    /**
     * GET-Render for managing the games
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str rendered HTML string
     */
    showManageGames: function (req, res, next) {
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

        // Sort Games Alphabetic
        already_selected_games.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name){
                return -1;
            }
            return 0;
        });

        filtered_games.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name){
                return -1;
            }
            return 0;
        });

        let os = app.userRepo.selectByUsername(req.userData.username).operating_system;
        return res.render('manage-games', { selected_games: already_selected_games, unselected_games: filtered_games, platforms: platforms, os: os, title: "Spiele verwalten" });
    },

    /**
     * POST-Request add games to the user
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str JSON with more infos
     */
    addGameToUser: function (req, res, next) {
        let response;
        let added_games_res = [];
        let removed_games_res = [];

        const username = req.userData.username;
        const add_games = req.body.add_game;
        const removed_games = req.body.removed_games;
        try {
            add_games.forEach(gameID => {
                try {
                    app.gameRepo.addGameToUser(gameID, username)
                    added_games_res.push(app.gameRepo.selectByID(gameID));
                } catch (error) {
                    // Ignore duplicate entry errors
                    if (error.code != "SQLITE_CONSTRAINT_PRIMARYKEY") {
                        throw error;
                    }
                }
            });

            removed_games.forEach(gameID => {
                const result = app.gameRepo.removeGameFromUser(gameID, username);
                if (result.changes) {
                    removed_games_res.push(app.gameRepo.selectByID(gameID));
                }
            });

            response = res.status(201).json({
                games: {
                    added_games: added_games_res,
                    removed_games: removed_games_res
                },
                username: username
            });

        } catch (error) {
            console.error(error);
            response = res.status(500).json(error);

        } finally {
            return response;
        }
    },

    /**
     * GET-Render to add a new game to the db
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str rendered HTML string
     */
    showNewGames: function (req, res, next) {
        const platforms = app.platformRepo.selectAll();
        let os = app.userRepo.selectByUsername(req.userData.username).operating_system;
        return res.render('new-games', { platforms: platforms, os: os, title: "Neues Spiel hinzufügen" });
    },

    /**
     * POST-Request to create a new game
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str JSON with more infos
     */
    insertNewGame: function (req, res, next) {
        let response;

        const username = req.userData.username;
        const game_name = req.body.game_name;
        const platform = req.body.platform;
        const coverImage = `/images/upload/${req.file.filename}`;

        try {
            const new_game = new GameCreate(game_name, coverImage);
            app.gameRepo.insertNewGame(new_game, platform);

            const added_game = app.gameRepo.selectByName(game_name);
            app.gameRepo.addGameToUser(added_game.id, username);

            response = res.status(201).json(added_game);
        } catch (error) {
            console.error(error);
            response = res.status(500).json(error);

        } finally {
            return response;
        }
    },

    /**
     * POST-Request add games to the user
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str JSON with more infos
     */
    deleteGame: function (req, res, next) {
        let response;
        const game_id = req.body.game_id;
        const game = app.gameRepo.selectByID(game_id);

        try {
            const result = app.gameRepo.deleteGame(game_id);
            if (result.changes) {
                response = res.status(201).json(game);
            }
            else {
                response = res.status(400).json({
                    msg: `Spiel mit der ID ${game_id} nicht gefunden!`
                });
            }
        } catch (error) {
            console.error(error);
            response = res.status(500).json(error)

        } finally {
            return response;
        }
    },

    /**
     * GET-Request get infos for a Game
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str object as JSON
     */
    getGameByName: function (req, res, next) {
        let game_name = req.params.gamename;
        try {
            let game = app.gameRepo.selectByName(game_name);
            return res.json(game);
        } catch (error) {
            return res.status(404).json({ msg: `Game ${game_name} not Found` });
        }
    }
};