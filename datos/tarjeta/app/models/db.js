const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
//crear la conexion con la bd
var connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

module.exports = connection;