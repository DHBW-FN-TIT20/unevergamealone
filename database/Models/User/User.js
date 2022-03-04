/**
 * Class representing a user
 */
class User {
    constructor(username, password, email, os) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.os = os;
        this.registered = Date.now();
    }
}

module.exports = User;