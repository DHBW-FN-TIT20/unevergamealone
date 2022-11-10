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
     * Add a new platform to the DB
     * @param {Platform} platform platform to add
     * @returns string sql response of the command
     */
    async insert(platform) {
        const sql = "INSERT INTO platforms(id, name) VALUES (?, ?)";
        return await this.db.run(sql, [platform.id, platform.name]);
    }

    /**
     * Get a platform by id
     * @param {string} id id of the platform
     * @returns Platform
     */
    async selectByID(id) {
        const sql = "SELECT * FROM platforms WHERE id = ?";
        return await this.db.get(sql, [id]);
    }

    /**
     * Get a platform by name
     * @param {string} name name of the platform
     * @returns Platform
     */
    async selectByName(name) {
        const sql = "SELECT * FROM platforms WHERE name = ?";
        return await this.db.get(sql, [name]);
    }

    /**
     * Get all Platforms in the Database
     * @returns {Platform[]} sql response of the command
     */
    async selectAll() {
        const sql = "SELECT * FROM platforms";
        return await this.db.all(sql);
    }
}

module.exports = PlatformRepository;