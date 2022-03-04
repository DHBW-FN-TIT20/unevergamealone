const User = require('./User.js');
const bcrypt = require('bcryptjs');

class UserRepository {
    constructor(db) {
        this.db = db;
    }

    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS users(username text PRIMARY KEY, password text, registered text, email text, operating_system text)";
        return this.db.run(sql);
    }

    initialSetup() {
        let salt = bcrypt.genSaltSync(10);
        let hashedPw = bcrypt.hashSync("password", salt);
        this.insert(new User("demo", hashedPw, "d@d.d", "Windows"));
    }

    insert(user) {
        const sql = "INSERT INTO users(username, password, registered, email, operating_system) VALUES (?, ?, ?, ?, ?)";
        return this.db.run(sql, [user.username, user.password, user.registered, user.email, user.os]);
    }

    selectByUsername(username) {
        const sql = "SELECT * FROM users WHERE username = ?";
        return this.db.get(sql, [username]);
    }
}

module.exports = UserRepository;