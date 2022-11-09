const mariadb = require('mariadb');
/**
 * Class representing the database connection.
 */
class AppDB {
    /**
     * @constructor
     * @param {string} dbFilePath path to the database file
     */
    constructor() {
        this.db = mariadb.createPool({
            // host: process.env.DB_NAME,
            host: "217.160.255.237",
            database: "unga",
            user: "root",
            password: "db_root_password",
            connectionLimit: 5
        });
    }

    /**
     * Get the first result
     * @param {string} sql the sql statement
     * @param {string[]} params the parameters used in the sql statement
     * @returns {object} an object that represents the first row retrieved by the query
     */
    get(sql, params = []) {
        return this.run(sql, params);
    }

    /**
     * Get all results
     * @param {string} sql the sql statement
     * @param {string[]} params the parameters used in the sql statement
     * @returns {object} an object that represents all row retrieved by the query
     */
    all(sql, params = []) {
        return this.run(sql, params);
    }

    /**
     * Run the statement
     * @param {string} sql the sql statement
     * @param {array} params the parameters used in the sql statement
     * @returns {object} an info object describing any changes made
     */
    async run(sql, params = []) {
        let result;
        this.db.query(sql, params)
            .then(rows => {
                console.log(rows);
                result = rows
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        return result;
    }
}

module.exports = AppDB