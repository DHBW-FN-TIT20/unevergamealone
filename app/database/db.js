const mariadb = require('mariadb');
/**
 * Class representing the database connection.
 */
class AppDB {
    /**
     * @constructor
     * @param {string} dbFilePath path to the database file
     */
    constructor() {
        // this.pool = mariadb.createPool({
        //     // host: process.env.DB_NAME,
        //     host: "http://floqueboque.ddnss.de:8081/",
        //     database: "unevergamealone",
        //     user: "root",
        //     password: "140117",
        //     connectionLimit: 5
        // });
    }

    async connect(){
        try{
            this.db = await mariadb.createConnection({
                // host: process.env.DB_NAME,
                host: "217.160.255.237",
                database: "unga",
                user: "root",
                password: "db_root_password",
                connectionLimit: 5
            });
            console.log("connected to database");
            const res = await this.db.query("SHOW tables", []);
            console.log(res);
        }catch(err){
            throw err;
        }
    }

    

    /**
     * Get the first result
     * @param {string} sql the sql statement
     * @param {string[]} params the parameters used in the sql statement
     * @returns {object} an object that represents the first row retrieved by the query
     */
    async get(sql, params = []) {
        let result = await this.run(sql, params);
        return result[0];
    }

    /**
     * Get all results
     * @param {string} sql the sql statement
     * @param {string[]} params the parameters used in the sql statement
     * @returns {object} an object that represents all row retrieved by the query
     */
    async all(sql, params = []) {
        return await this.run(sql, params);
    }

    /**
     * Run the statement
     * @param {string} sql the sql statement
     * @param {array} params the parameters used in the sql statement
     * @returns {object} an info object describing any changes made
     */
    async run(sql, params = []) {
        try{
            let result = await this.db.query(sql, params)
            return result;
        }catch(err){
            throw err;
        }        
    }
}

module.exports = AppDB