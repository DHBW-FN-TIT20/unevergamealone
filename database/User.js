class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.registered = Date.now();
    }
}

module.exports = User;