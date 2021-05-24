const Datastore = require('nedb');

const db = {};
db.boards = new Datastore({ filename: 'datasets/boards.db', autoload: true });

export default db;
