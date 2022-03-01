/**
 * Class representing a user
 */
class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.registered = Date.now();
    }
}

module.exports = User;