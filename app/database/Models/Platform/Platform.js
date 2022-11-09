/**
 * Represent the platform in the DB
 */
class Platform {
    /**
     * @constructor
     * @param {string} id id of the platform
     * @param {string} name name of the platform
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

module.exports = Platform;