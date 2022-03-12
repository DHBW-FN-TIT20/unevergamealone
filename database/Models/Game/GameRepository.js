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
        const sql = "CREATE TABLE IF NOT EXISTS gameUserMapping(game_id integer, username text, FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, PRIMARY KEY(game_id, username))";
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
     * @param {int} gameId 
     * @param {string} username 
     */
    removeGameFromUser(gameId, username) {
        const sql = "DELETE " +
            "FROM gameUserMapping " +
            "WHERE gameUserMapping.game_id = ? " +
            "AND gameUserMapping.username = ?";
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

    /**
     * 
     * @param {String} platformName 
     * @param {String} username 
     * @returns Array
     */
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

    /**
     * Get a Game by his id
     * @param {string} id 
     * @returns Game
     */
    selectByID(id) {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name AS platformName FROM games JOIN platforms ON platform_id=platforms.id WHERE games.id=?";
        const sql_game = this.db.get(sql, [id]);
        const game = new Game(sql_game.id, sql_game.platformName, sql_game.name, sql_game.coverImage);
        return game;
    }

    selectUsersOfGame(gameId) {
        // const sql = "SELECT userPlatformMapping.username, userPlatformMapping.usernameOfPlatform AS usernameOfPlatform FROM userPlatformMapping JOIN games ON games.platform_id=userPlatformMapping.platformId JOIN gameUsermapping ON gameUserMapping.username = userPlatformMapping.username WHERE game_id=?";
        // return this.db.all(sql, [gameId]);

        const platformId = this.db.get("SELECT platform_id FROM games WHERE id = ?", [gameId]);
        const playersOwning = this.db.all("SELECT username FROM gameUserMapping WHERE game_id = ?", [gameId]);
        const playernames = [];
        for (const player of playersOwning) {
            playernames.push(this.db.get("SELECT usernameOfPlatform FROM userPlatformMapping WHERE username = ? AND platformId = ?", [player.username, platformId.platform_id]));
        }
        return playernames;
    }

    /**
     * Get all Games from a User
     * @param {String} username 
     * @returns Array.<Game>
     */
    selectAllGamesFromUser(username) {
        const sql = "SELECT games.id, platforms.name AS platformName, games.name, games.coverImage, users.username AS playerName " +
            "FROM users " +
            "JOIN gameUserMapping ON users.username = gameUserMapping.username " +
            "JOIN games ON gameUserMapping.game_id = games.id " +
            "JOIN platforms ON games.platform_id = platforms.id " +
            "WHERE users.username = ?";
        const sql_games = this.db.all(sql, [username]);
        let games = [];
        sql_games.forEach(sql_game => {
            games.push(new Game(sql_game.id, sql_game.platformName, sql_game.name, sql_game.coverImage, [sql_game.playerName]));
        });
        return games;
    }

    /**
     * Delete a game from the DB
     * @param {int} gameId 
     */
    deleteGame(gameId) {
        const sql = "DELETE " +
            "FROM games " +
            "WHERE games.id = ?";
        return this.db.run(sql, [gameId]);
    }
}

module.exports = GameRepository;