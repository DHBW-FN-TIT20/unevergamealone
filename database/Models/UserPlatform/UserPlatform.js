/**
 * Class that contain the username of the platform for a user
 */
class UserPlatform {
    /**
     * @constructor
     * @param {string} username name of the user
     * @param {string} usernameOfPlatform username from the platform
     * @param {Platform} platform the platform object
     */
    constructor(username, usernameOfPlatform, platform) {
        this.username = username;
        this.usernameOfPlatform = usernameOfPlatform;
        this.platform = platform;
    }
}

module.exports = UserPlatform;