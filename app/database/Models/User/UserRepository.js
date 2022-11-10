const User = require('./User.js');
const bcrypt = require('bcryptjs');

/**
 * DB Connection to the users Table
 */
class UserRepository {
    /**
     * @constructor
     * @param {Database} db sqlite connection
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Add a new user to the DB
     * @param {User} user user to add
     * @returns string sql response of the command
     */
    async insert(user) {
        const sql = "INSERT INTO users(username, password, registered, email, operating_system) VALUES (?, ?, ?, ?, ?)";
        return await this.db.run(sql, [user.username, user.password, user.registered, user.email, user.os]);
    }

    /**
     * Get a user by his username
     * @param {string} username username of the user
     * @returns string sql response of the command
     */
    async selectByUsername(username) {
        const sql = "SELECT * FROM users WHERE username = ?";
        return await this.db.get(sql, [username]);
    }
}

module.exports = UserRepository;