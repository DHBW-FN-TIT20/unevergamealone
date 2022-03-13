const Database = require('better-sqlite3');
/**
 * Class representing the database connection.
 */
class AppDB {
    /**
     * @constructor
     * @param {string} dbFilePath path to the database file
     */
    constructor(dbFilePath) {
        this.db = new Database(dbFilePath, { verbose: console.log });
    }

    /**
     * Get the first result
     * @param {string} sql the sql statement
     * @param {string[]} params the parameters used in the sql statement
     * @returns {object} an object that represents the first row retrieved by the query
     */
    get(sql, params = []) {
        const statement = this.db.prepare(sql);
        return statement.get(params);
    }

    /**
     * Get all results
     * @param {string} sql the sql statement
     * @param {string[]} params the parameters used in the sql statement
     * @returns {object} an object that represents all row retrieved by the query
     */
    all(sql, params = []) {
        const statement = this.db.prepare(sql);
        return statement.all(params);
    }

    /**
     * Run the statement
     * @param {string} sql the sql statement
     * @param {array} params the parameters used in the sql statement
     * @returns {object} an info object describing any changes made
     */
    run(sql, params = []) {
        return this.db.prepare(sql).run(params);
    }
}

module.exports = AppDB