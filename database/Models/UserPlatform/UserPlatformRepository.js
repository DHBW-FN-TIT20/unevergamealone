const UserPlatform = require('./UserPlatform.js');
const User = require('./UserPlatform.js');

class UserPlatformRepository {
    constructor(db) {
        this.db = db;
    }

    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS userPlatformMapping(username text, usernameOfPlatform text, platformId integer, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, FOREIGN KEY(platformId) REFERENCES platforms(id) ON DELETE CASCADE, PRIMARY KEY(username, platformId))";
        return this.db.run(sql);
    }

    initialSetup() {
        this.insert(new UserPlatform("demo", "demo_steam", 1))
        this.insert(new UserPlatform("demo", "demo_origin", 2))
        this.insert(new UserPlatform("demo", "demo_epic", 3))
        this.insert(new UserPlatform("demo", "demo_ubisoft", 4))
        this.insert(new UserPlatform("demo", "demo_battlenet", 5))
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