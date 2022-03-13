/**
 * Class representing a user
 */
class User {
    /**
     * @constructor
     * @param {string} username name of the user
     * @param {string} password password of the user hashed
     * @param {string} email mail of the user
     * @param {string} os operating system of the user
     */
    constructor(username, password, email, os) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.os = os;
        this.registered = Date.now();
    }
}

module.exports = User;