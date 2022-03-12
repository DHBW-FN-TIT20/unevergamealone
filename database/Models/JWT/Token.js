/**
 * Class to handle the invalid tokens
 */
class Token {
    /**
     * @constructor
     * @param {string} token 
     * @param {Date.time} expiration unix timestamp
     */
    constructor(token, expiration) {
        this.token = token;
        this.expiration = expiration;
    }
}

module.exports = Token;