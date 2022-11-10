const Token = require('./Token.js');

/**
 * DB Connection to the invalidToken Table
 */
class TokenRepository {
    /**
     * @constructor
     * @param {Database} db sqlite connection
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Insert a new invalid Token to the DB
     * @param {Token} token 
     * @returns {object} an info object describing any changes made
     */
    async insert(token) {
        await this.cleanup();

        const sql = "INSERT INTO invalidToken(token) VALUES (?)";
        return await this.db.run(sql, [token.token]);
    }

    /**
     * Search for a token in the db
     * @param {Token} token 
     * @returns Token
     */
    async selectToken(token) {
        await this.cleanup();

        const sql = "SELECT * FROM invalidToken WHERE invalidToken.token = ?"
        return await this.db.get(sql, [token.token]);
    }

    /**
     * Get all invalid token in the DB
     * @returns Array.<Token>
     */
    async selectAllToken() {
        await this.cleanup();

        const sql = "SELECT * FROM invalidToken"
        return await this.db.getAll(sql, []);
    }

    /**
     * Remove all token that are invalid by them self
     */
    async cleanup() {
        const currentUnixTime = Date.now();

        const sql = "DELETE FROM invalidToken WHERE expiration > ?";
        await this.db.run(sql, [currentUnixTime]);
    }
}

module.exports = TokenRepository;