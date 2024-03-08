const database = require('../../sqlite');
const createUsers = require('./createUsers');
const createNotes = require('./createNotes');
const createTags = require('./createTags');

async function migrationsRun() {
    const tabelas = [
        createUsers,
        createNotes,
        createTags,
    ].join('');

    database()
        .then(db => db.exec(tabelas))
        .catch(error => console.error(error));
}

module.exports = migrationsRun;