const Game = require('./Game.js');
const GameCreate = require('./GameCreate.js');

class GameRepository {
    constructor(db) {
        this.db = db;
    }

    createGameTable() {
        const sql = "CREATE TABLE IF NOT EXISTS games(id integer PRIMARY KEY AUTOINCREMENT, platform_id integer, name text UNIQUE, coverImage text, FOREIGN KEY(platform_id) REFERENCES platforms(id))";
        return this.db.run(sql);
    }

    createGameUserMappingTable() {
        const sql = "CREATE TABLE IF NOT EXISTS gameUserMapping(game_id integer PRIMARY KEY, username text, FOREIGN KEY(game_id) REFERENCES games(id), FOREIGN KEY(username) REFERENCES users(username))";
        return this.db.run(sql);
    }

    initialSetup() {
        this.insertNewGame(new GameCreate("Battlefield 2042", "/images/upload/bf2042.jpg", "Floqueboque"), 2);
        this.insertNewGame(new GameCreate("Battlefield V", "/images/upload/bf5.jpg", "Floqueboque"), 2);
    }

    insertNewGame(game, platformId) {
        const sql1 = "INSERT INTO games(platform_id, name, coverImage) VALUES (? ,?, ?)";
        this.db.run(sql1, [platformId, game.name, game.coverImage]);
        let insertedGame = this.selectByName(game.name);
        let idOfInsertedGame = insertedGame.id;
        const sql2 = "INSERT INTO gameUserMapping(game_id, username) VALUES (?,?)";
        return this.db.run(sql2, [idOfInsertedGame, game.username]);
    }

    addGameToUser(gameId, username) {
        const sql = "INSERT INTO gameUserMapping(game_id, username) VALUES (?,?)";
        return this.db.run(sql, [gameId, username]);
    }

    selectAll() {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name FROM games JOIN platforms ON platform_id=platforms.id";
        return this.db.all(sql);
    }

    selectAllGamesWithPlatformByUser(platformName, username) {
        const sql = "SELECT games.id, games.name AS game, games.coverImage, platforms.name AS platformName, gameUserMapping.username FROM games JOIN platforms ON platform_id=platforms.id JOIN gameUserMapping ON gameUserMapping.game_id=games.id WHERE gameUserMapping.username=? AND platforms.name=?";
        return this.db.all(sql, [username, platformName]);
    }

    selectByName(name) {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name FROM games JOIN platforms ON platform_id=platforms.id WHERE games.name=?";
        return this.db.get(sql, [name]);
    }

    selectUsersOfGame(gameId) {
        const sql = "SELECT userPlatformMapping.username, userPlatformMapping.usernameOfPlatform AS usernameOfPlatform FROM userPlatformMapping JOIN games ON games.platform_id=userPlatformMapping.platformId JOIN gameUsermapping ON gameUserMapping.username = userPlatformMapping.username WHERE games.id=?";
        return this.db.all(sql, [gameId]);
    }
}

module.exports = GameRepository;