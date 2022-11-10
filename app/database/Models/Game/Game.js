/**
 * Game with all Informations
 */
class Game {
    /**
     * @constructor
     * @param {string} id ID of the game
     * @param {string} platformName Name of the platform
     * @param {string} name name of the game
     * @param {path} coverImage path to the image on the server
     * @param {string[]} playerNames all names of players that own the game
     */
    constructor(id, platformName, name, coverImage, playerNames = []) {
        this.id = id;
        this.platformName = platformName;
        this.name = name;
        this.coverImage = coverImage;
        this.playerNames = playerNames;
    }
}

module.exports = Game;