class Game {
    constructor(id, platformName, name, coverImage, playerNames = []) {
        this.id = id;
        this.platformName = platformName;
        this.name = name;
        this.coverImage = coverImage;
        this.playerNames = playerNames;
    }
}

module.exports = Game;