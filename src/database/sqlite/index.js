const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path");

async function database() {
    const database = await sqlite.open({
        filename: path.resolve(__dirname, "..", "database.db"),
        driver: sqlite3.Database
    });

        database.get("PRAGMA foreign_keys=ON")

    return database;
}

module.exports = database;
