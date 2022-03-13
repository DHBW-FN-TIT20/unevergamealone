class GameCreate {
    /**
     * 
     * @param {String} name 
     * @param {String} coverImage Path of the filesystem
     */
    constructor(name, coverImage) {
        this.name = name;
        this.coverImage = coverImage;
    }
}

module.exports = GameCreate;