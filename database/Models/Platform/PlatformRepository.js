const Platform = require('./Platform.js');

class PlatformRepository {
    constructor(db) {
        this.db = db;
    }

    createTable() {
        const sql = "CREATE TABLE IF NOT EXISTS platforms(id integer PRIMARY KEY, name text)";
        return this.db.run(sql);
    }

    initialSetup() {
        this.insert(new Platform(1, "Steam"));
        this.insert(new Platform(2, "Origin"));
        this.insert(new Platform(3, "EpicGames"));
        this.insert(new Platform(4, "UbisoftConnect"));
        this.insert(new Platform(5, "BattleNET"));
    }

    insert(platform) {
        const sql = "INSERT INTO platforms(id, name) VALUES (?, ?)";
        return this.db.run(sql, [platform.id, platform.name]);
    }

    selectByName(name) {
        const sql = "SELECT * FROM platforms WHERE name = ?";
        return this.db.get(sql, [name]);
    }

    selectAll() {
        const sql = "SELECT * FROM platforms";
        return this.db.all(sql);
    }
}

module.exports = PlatformRepository;