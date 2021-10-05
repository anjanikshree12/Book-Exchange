const mysql = require('mysql2');
require('dotenv').config();const mysql = require('mysql2');

// console.log(1);
const pool = mysql.createPool({
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: 'localhost',
    user: 'root',
    database: 'booksite',
    password:process.env.MYSQL_PASSWORD,
    password:'123345'
});

module.exports = pool.promise();