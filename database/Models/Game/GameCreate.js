/**
 * Class if you create a Game
 */
class GameCreate {
    /**
     * @constructor
     * @param {string} name name of the game
     * @param {string} coverImage Path of the filesystem
     */
    constructor(name, coverImage) {
        this.name = name;
        this.coverImage = coverImage;
    }
}

module.exports = GameCreate;