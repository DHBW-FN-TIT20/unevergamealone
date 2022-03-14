const UserPlatform = require('./UserPlatform.js');

/**
 * DB Connection to the userPlatformMapping Table
 */
class UserPlatformRepository {
    /**
     * @constructor
     * @param {Database} db sqlite connection
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Create the Table userPlatformMapping if not exist
     * @returns string sql response of the command
     */
    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS userPlatformMapping(username text, usernameOfPlatform text, platformId integer, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, FOREIGN KEY(platformId) REFERENCES platforms(id) ON DELETE CASCADE, PRIMARY KEY(username, platformId))";
        return this.db.run(sql);
    }

    /**
     * Add the usernames demo_steam, demo_origin, demo_epic, demo_ubisoft and demo_battlenet
     * to the user demo
     */
    initialSetup() {
        this.insert(new UserPlatform("demo", "demo_steam", 1))
        this.insert(new UserPlatform("demo", "demo_origin", 2))
        this.insert(new UserPlatform("demo", "demo_epic", 3))
        this.insert(new UserPlatform("demo", "demo_ubisoft", 4))
        this.insert(new UserPlatform("demo", "demo_battlenet", 5))
    }

    /**
     * Add a new mapping from user to username of a platform
     * @param {UserPlatform} userPlatform mapping from user to username of the platform
     * @returns string sql response of the command
     */
    insert(userPlatform) {
        const sql = "INSERT INTO userPlatformMapping(username, usernameOfPlatform, platformId) VALUES (?, ?, ?)";
        return this.db.run(sql, [userPlatform.username, userPlatform.usernameOfPlatform, userPlatform.platform]);
    }

    /**
     * Get all UserPlatform from a User
     * @param {string} username name of the user
     * @returns {UserPlatform[]}
     */
    selectAllByUsername(username) {
        const sql = "SELECT * FROM userPlatformMapping WHERE username = ?";
        return this.db.all(sql, [username]);
    }

    /**
     * Get the UserPlatform for one user to one platform
     * @param {string} username name of the user
     * @param {Platform} platform platform to search
     * @returns {UserPlatform}
     */
    selectUsernameOfPlatform(username, platform) {
        const sql = "SELECT * FROM userPlatformMapping WHERE username = ? AND platform = ?";
        return this.db.get(sql, [username, platform]);
    }
}

module.exports = UserPlatformRepository;