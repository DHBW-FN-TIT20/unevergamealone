const Database = require('better-sqlite3');

class AppDB {
    // open the database
    constructor(dbFilePath) {
        this.db = new Database(dbFilePath, { verbose: console.log });
    }

    query(sql, params = []) {
        const statement = this.db.prepare(sql);
        return statement.get(params);
    }

    run(sql, params = []) {
        return this.db.prepare(sql).run(params);
    }
}

module.exports = AppDB