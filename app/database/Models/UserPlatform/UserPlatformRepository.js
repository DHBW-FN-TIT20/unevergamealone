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
    async createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS userPlatformMapping(username varchar(100), usernameOfPlatform text, platformId integer, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, FOREIGN KEY(platformId) REFERENCES platforms(id) ON DELETE CASCADE, PRIMARY KEY(username, platformId))";
        return await this.db.run(sql);
    }

    /**
     * Add the usernames demo_steam, demo_origin, demo_epic, demo_ubisoft and demo_battlenet
     * to the user demo
     */
    async initialSetup() {
        await this.insert(new UserPlatform("demo", "demo_steam", 1));
        await this.insert(new UserPlatform("demo", "demo_origin", 2));
        await this.insert(new UserPlatform("demo", "demo_epic", 3));
        await this.insert(new UserPlatform("demo", "demo_ubisoft", 4));
        await this.insert(new UserPlatform("demo", "demo_battlenet", 5));
    }

    /**
     * Add a new mapping from user to username of a platform
     * @param {UserPlatform} userPlatform mapping from user to username of the platform
     * @returns string sql response of the command
     */
    async insert(userPlatform) {
        const sql = "INSERT INTO userPlatformMapping(username, usernameOfPlatform, platformId) VALUES (?, ?, ?)";
        return await this.db.run(sql, [userPlatform.username, userPlatform.usernameOfPlatform, userPlatform.platform]);
    }

    /**
     * Get all UserPlatform from a User
     * @param {string} username name of the user
     * @returns {UserPlatform[]}
     */
    async selectAllByUsername(username) {
        const sql = "SELECT * FROM userPlatformMapping WHERE username = ?";
        return await this.db.all(sql, [username]);
    }

    /**
     * Get the UserPlatform for one user to one platform
     * @param {string} username name of the user
     * @param {Platform} platform platform to search
     * @returns {UserPlatform}
     */
    async selectUsernameOfPlatform(username, platform) {
        const sql = "SELECT * FROM userPlatformMapping WHERE username = ? AND platform = ?";
        return await this.db.get(sql, [username, platform]);
    }
}

module.exports = UserPlatformRepository;