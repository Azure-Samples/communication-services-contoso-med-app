const userService = require('../services/user.service');
const config = require("../config.json");

if (!config || !config.connectionString || config.connectionString.indexOf('endpoint=') === -1) {
    throw new Error("Update `config.json` with connection string");
}