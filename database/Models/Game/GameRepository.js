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
        const sql = "CREATE TABLE IF NOT EXISTS gameUserMapping(game_id integer, username text, FOREIGN KEY(game_id) REFERENCES games(id), FOREIGN KEY(username) REFERENCES users(username))";
        return this.db.run(sql);
    }

    initialSetup() {
        this.insertNewGame(new GameCreate("Battlefield 2042", "/images/upload/bf2042.jpg"), 2);
        this.addGameToUser(this.selectByName("Battlefield 2042").id, "demo");
        this.insertNewGame(new GameCreate("Battlefield V", "/images/upload/bf5.jpg"), 2);
        this.addGameToUser(this.selectByName("Battlefield V").id, "demo");
    }

    /**
     * @param {GameCreate} game Game to Add
     * @param {int} platformID Id 
     */
    insertNewGame(game, platformId) {
        const sql = "INSERT INTO games(platform_id, name, coverImage) VALUES (? ,?, ?)";
        return this.db.run(sql, [platformId, game.name, game.coverImage]);
    }

    /**
     * @param {int} gameId
     * @param {string} username
     */
    addGameToUser(gameId, username) {
        const sql = "INSERT INTO gameUserMapping(game_id, username) VALUES (?,?)";
        return this.db.run(sql, [gameId, username]);
    }

    /**
     * Return all saved Games
     * @returns Array.<Game>
     */
    selectAll() {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name AS platformName FROM games JOIN platforms ON platform_id=platforms.id";
        const sql_games = this.db.all(sql);
        let games = [];
        sql_games.forEach(sql_game => {
            games.push(sql_game);
        });
        return games;
    }

    selectAllGamesWithPlatformByUser(platformName, username) {
        const sql = "SELECT games.id, games.name AS game, games.coverImage, platforms.name AS platformName, gameUserMapping.username FROM games JOIN platforms ON platform_id=platforms.id JOIN gameUserMapping ON gameUserMapping.game_id=games.id WHERE gameUserMapping.username=? AND platforms.name=?";
        return this.db.all(sql, [username, platformName]);
    }

    /**
     * Get a Game by his name
     * @param {string} name 
     * @returns Game
     */
    selectByName(name) {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name AS platformName FROM games JOIN platforms ON platform_id=platforms.id WHERE games.name=?";
        const sql_game = this.db.get(sql, [name]);
        const game = new Game(sql_game.id, sql_game.platformName, sql_game.name, sql_game.coverImage);
        return game;
    }

    selectUsersOfGame(gameId) {
        // const sql = "SELECT userPlatformMapping.username, userPlatformMapping.usernameOfPlatform AS usernameOfPlatform FROM userPlatformMapping JOIN games ON games.platform_id=userPlatformMapping.platformId JOIN gameUsermapping ON gameUserMapping.username = userPlatformMapping.username WHERE game_id=?";
        // return this.db.all(sql, [gameId]);

        let platformId = this.db.get("SELECT platform_id FROM games WHERE id = ?", [gameId]);
        let playersOwning = this.db.all("SELECT username FROM gameUserMapping WHERE game_id = ?", [gameId]);
        let playernames = [];
        for (let player of playersOwning) {
            playernames.push(this.db.get("SELECT usernameOfPlatform FROM userPlatformMapping WHERE username = ? AND platformId = ?", [player.username, platformId.platform_id]));
        }
        return playernames;
    }
}

module.exports = GameRepository;