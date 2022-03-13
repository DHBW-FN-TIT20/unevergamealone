const Token = require('./Token.js');

/**
 * DB Connection to the invalidToken Table
 */
class TokenRepository {
    /**
     * @constructor
     * @param {*} db 
     */
    constructor(db) {
        this.db = db;
    }

    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS invalidToken(token text PRIMARY KEY, expiration TIMESTAMP NOT NULL DEFAULT (strftime('%s', 'now')))";
        return this.db.run(sql);
    }

    /**
     * Insert a new invalid Token to the DB
     * @param {Token} token 
     * @returns {object} an info object describing any changes made
     */
    insert(token) {
        this.cleanup();

        const sql = "INSERT INTO invalidToken(token) VALUES (?)";
        return this.db.run(sql, [token.token]);
    }

    /**
     * Search for a token in the db
     * @param {Token} token 
     * @returns Token
     */
    selectToken(token) {
        this.cleanup();

        const sql = "SELECT * FROM invalidToken WHERE invalidToken.token = ?"
        return this.db.get(sql, [token.token]);
    }

    /**
     * Get all invalid token in the DB
     * @returns Array.<Token>
     */
    selectAllToken() {
        this.cleanup();

        const sql = "SELECT * FROM invalidToken"
        return this.db.getAll(sql, []);
    }

    /**
     * Remove all token that are invalid by them self
     */
    cleanup() {
        const currentUnixTime = Date.now();

        const sql = "DELETE FROM invalidToken WHERE expiration > ?";
        this.db.run(sql, [currentUnixTime]);
    }
}

module.exports = TokenRepository;