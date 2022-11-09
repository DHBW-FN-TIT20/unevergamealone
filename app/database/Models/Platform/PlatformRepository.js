const Platform = require('./Platform.js');

/**
 * DB Connection to the platforms Table
 */
class PlatformRepository {
    /**
     * @constructor
     * @param {Database} db sqlite connection
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Create the Table platforms if not exist
     * @returns string sql response of the command
     */
    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS platforms(id integer PRIMARY KEY, name text)";
        return this.db.run(sql);
    }
    /**
     * Add Steam, Origin, EpicGames, UbisoftConnect and BattleNET to the DB
     */
    initialSetup() {
        this.insert(new Platform(1, "Steam"));
        this.insert(new Platform(2, "Origin"));
        this.insert(new Platform(3, "EpicGames"));
        this.insert(new Platform(4, "UbisoftConnect"));
        this.insert(new Platform(5, "BattleNET"));
    }

    /**
     * Add a new platform to the DB
     * @param {Platform} platform platform to add
     * @returns string sql response of the command
     */
    insert(platform) {
        const sql = "INSERT INTO platforms(id, name) VALUES (?, ?)";
        return this.db.run(sql, [platform.id, platform.name]);
    }

    /**
     * Get a platform by id
     * @param {string} id id of the platform
     * @returns Platform
     */
    selectByID(id) {
        const sql = "SELECT * FROM platforms WHERE id = ?";
        return this.db.get(sql, [id]);
    }

    /**
     * Get a platform by name
     * @param {string} name name of the platform
     * @returns Platform
     */
    selectByName(name) {
        const sql = "SELECT * FROM platforms WHERE name = ?";
        return this.db.get(sql, [name]);
    }

    /**
     * Get all Platforms in the Database
     * @returns {Platform[]} sql response of the command
     */
    selectAll() {
        const sql = "SELECT * FROM platforms";
        return this.db.all(sql);
    }
}

module.exports = PlatformRepository;