const Game = require('./Game.js');
const GameCreate = require('./GameCreate.js');

/**
 * Contain functions to interact with the Game in the DBs
 */
class GameRepository {
    /**
     * @constructor
     * @param {Database} db sqlite connection
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Create the Table games if not exist
     * @returns string sql response of the command
     */
    async createGameTable() {
        const sql = "CREATE TABLE IF NOT EXISTS games(id integer PRIMARY KEY AUTOINCREMENT, platform_id integer, name varchar(100) UNIQUE, coverImage text, FOREIGN KEY(platform_id) REFERENCES platforms(id))";
        return await this.db.run(sql);
    }

    /**
     * Create the Table gameUserMapping if not exist
     * @returns string sql response of the command
     */
    async createGameUserMappingTable() {
        const sql = "CREATE TABLE IF NOT EXISTS gameUserMapping(game_id integer, username text, FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, PRIMARY KEY(game_id, username))";
        return await this.db.run(sql);
    }

    /**
     * Add a new Game to the DB
     * @param {GameCreate} game Game to Add
     * @param {int} platformID Id 
     * @returns string sql response of the command
     */
    async insertNewGame(game, platformId) {
        const sql = "INSERT INTO games(platform_id, name, coverImage) VALUES (? ,?, ?)";
        return await this.db.run(sql, [platformId, game.name, game.coverImage]);
    }

    /**
     * Add a Game to a User
     * @param {int} gameId
     * @param {string} username
     * @returns string sql response of the command
     */
    async addGameToUser(gameId, username) {
        const sql = "INSERT INTO gameUserMapping(game_id, username) VALUES (?,?)";
        const res = await this.db.run(sql, [gameId, username]);
        return res;
    }

    /**
     * Delete a Game that was added to a User
     * @param {int} gameId 
     * @param {string} username 
     * @returns string sql response of the command
     */
    async removeGameFromUser(gameId, username) {
        const sql = "DELETE " +
            "FROM gameUserMapping " +
            "WHERE gameUserMapping.game_id = ? " +
            "AND gameUserMapping.username = ?" +
            "RETURNING *";
        const res = await this.db.run(sql, [gameId, username]);
        return res;
    }

    /**
     * Return all saved Games
     * @returns {Game[]}
     */
    async selectAll() {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name AS platformName FROM games JOIN platforms ON platform_id=platforms.id";
        const sql_games = await this.db.all(sql);
        let games = [];
        sql_games.forEach(sql_game => {
            games.push(sql_game);
        });
        return games;
    }

    /**
     * Get all Games from a User for a specific platform
     * @param {string} platformName 
     * @param {string} username 
     * @returns string sql response of the command
     */
    async selectAllGamesWithPlatformByUser(platformName, username) {
        const sql = "SELECT games.id, games.name AS game, games.coverImage, platforms.name AS platformName, gameUserMapping.username FROM games JOIN platforms ON platform_id=platforms.id JOIN gameUserMapping ON gameUserMapping.game_id=games.id WHERE gameUserMapping.username=? AND platforms.name=?";
        return await this.db.all(sql, [username, platformName]);
    }

    /**
     * Get a Game by his name
     * @param {string} name 
     * @returns Game
     */
    async selectByName(name) {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name AS platformName FROM games JOIN platforms ON platform_id=platforms.id WHERE games.name=?";
        const sql_game = await this.db.get(sql, [name]);
        const game = new Game(sql_game.id, sql_game.platformName, sql_game.name, sql_game.coverImage);
        return game;
    }

    /**
     * Get a Game by his id
     * @param {string} id 
     * @returns Game
     */
    async selectByID(id) {
        const sql = "SELECT games.id, games.name, games.coverImage, platforms.name AS platformName FROM games JOIN platforms ON platform_id=platforms.id WHERE games.id=?";
        const sql_game = await this.db.get(sql, [id]);
        const game = new Game(sql_game.id, sql_game.platformName, sql_game.name, sql_game.coverImage);
        return game;
    }

    /**
     * Get all Usernames that have this game
     * @param {string} gameId 
     * @returns {string[]}
     */
    async selectUsersOfGame(gameId) {
        const platformId = await this.db.get("SELECT platform_id FROM games WHERE id = ?", [gameId]);
        const playersOwning = await this.db.all("SELECT username FROM gameUserMapping WHERE game_id = ?", [gameId]);
        const playernames = [];
        for (const player of playersOwning) {
            const username = await this.db.get("SELECT usernameOfPlatform FROM userPlatformMapping WHERE username = ? AND platformId = ?", [player.username, platformId.platform_id]);
            if ( username !== undefined ){
                playernames.push(username);
            }
        }
        return playernames;
    }

    /**
     * Get all Games from a User
     * @param {string} username 
     * @returns {Game[]}
     */
    async selectAllGamesFromUser(username) {
        const sql = "SELECT games.id, platforms.name AS platformName, games.name, games.coverImage, users.username AS playerName " +
            "FROM users " +
            "JOIN gameUserMapping ON users.username = gameUserMapping.username " +
            "JOIN games ON gameUserMapping.game_id = games.id " +
            "JOIN platforms ON games.platform_id = platforms.id " +
            "WHERE users.username = ?";
        const sql_games = await this.db.all(sql, [username]);
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
    async deleteGame(gameId) {
        const sql = "DELETE " +
            "FROM games " +
            "WHERE games.id = ?";
        return await this.db.run(sql, [gameId]);
    }
}

module.exports = GameRepository;