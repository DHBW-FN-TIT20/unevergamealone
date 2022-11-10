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
     * Create the Table users if not exist
     * @returns string sql response of the command
     */
    async createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS users(username varchar(100) PRIMARY KEY, password text, registered text, email text, operating_system text)";
        return await this.db.run(sql);
    }

    /**
     * Add the user demo with the password "password" to the DB
     */
    async initialSetup() {
        let salt = bcrypt.genSaltSync(10);
        let hashedPw = bcrypt.hashSync("password", salt);
        await this.insert(new User("demo", hashedPw, "d@d.d", "Windows"));
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