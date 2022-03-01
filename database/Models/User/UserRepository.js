const User = require('./User.js');
const bcrypt = require('bcryptjs');

class UserRepository {
    constructor(db) {
        this.db = db;
    }

    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS users(username text PRIMARY KEY, password text, registered text, email text)";
        return this.db.run(sql);
    }

    initialSetup() {
        let salt = bcrypt.genSaltSync(10);
        let hashedPw = bcrypt.hashSync("Sesam1234!", salt);
        this.insert(new User("Floqueboque", hashedPw, "florian.herkommer@gmx.de"));
    }

    insert(user) {
        const sql = "INSERT INTO users(username, password, registered, email) VALUES (?, ?, ?, ?)";
        return this.db.run(sql, [user.username, user.password, user.registered, user.email]);
    }

    selectByUsername(username) {
        const sql = "SELECT * FROM users WHERE username = ?";
        return this.db.get(sql, [username]);
    }

    selectUsernameOfPlatform(username, platform) {

    }
}

module.exports = UserRepository;