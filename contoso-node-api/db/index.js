const MongoClient = require("mongodb").MongoClient;
const config = require('../config.json');

let connection = null;
let url = config.mongodbConnection

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) { reject(err); return; };
        resolve(db);        
        connection = db;
    });
});

module.exports.get = () => {
    if(!connection) {
        throw new Error('Call connect first!');
    }
    return connection;
}

module.exports.getDB = () => {
    if(!connection) {
        throw new Error('Call connect first!');
    }
    return connection.db(config.dbName)
}