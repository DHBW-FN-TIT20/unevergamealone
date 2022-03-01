const User = require('./UserPlatform.js');

class UserPlatformRepository {
    constructor(db) {
        this.db = db;
    }

    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS userPlatformMapping(username text, usernameOfPlatform text, platformId integer)";
        return this.db.run(sql);
    }

    insert(userPlatform) {
        const sql = "INSERT INTO userPlatformMapping(username, usernameOfPlatform, platformId) VALUES (?, ?, ?)";
        return this.db.run(sql, [userPlatform.username, userPlatform.usernameOfPlatform, userPlatform.platform]);
    }

    selectAllByUsername(username) {
        const sql = "SELECT * FROM userPlatformMapping WHERE username = ?";
        return this.db.all(sql, [username]);
    }

    selectUsernameOfPlatform(username, platform) {
        const sql = "SELECT * FROM userPlatformMapping WHERE username = ? AND platform = ?";
        return this.db.get(sql, [username, platform]);
    }
}

module.exports = UserPlatformRepository;