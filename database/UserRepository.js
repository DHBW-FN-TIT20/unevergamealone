const User = require('./User.js');

let currentUser = "";

function getUser(result) {
    currentUser = new User(result.username, result.password);
    alert(currentUser.username);
}

class UserRepository {
    constructor(db) {
        this.db = db;
    }

    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS users(username text PRIMARY KEY, password text, registered text)";
        return this.db.run(sql);
    }

    insert(user) {
        const sql = "INSERT INTO users(username, password, registered) VALUES (?, ?, ?)";
        return this.db.run(sql, [user.username, user.password, user.registered]);
    }

    selectByUsername(username) {
        const sql = "SELECT * FROM users WHERE username = ?";
        return this.db.query(sql, [username]);
    }
}

module.exports = UserRepository;