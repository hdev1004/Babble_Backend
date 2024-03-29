const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

const pool = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    port     : process.env.DB_PORT,
    connectionLimit: 30,
    enableKeepAlive: true
});

const poolPromise = mysqlPromise.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    port     : process.env.DB_PORT,
    multipleStatements: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
    
});

function getConnection(callback) {
    pool.getConnection(function(err, conn) {
        if(!err) {
            console.log("Database connected successfully !");
            callback(conn);
        } else {
            console.log("Database connected Failed ..");
        }       
    })
}


module.exports = {
    getConnection,
    poolPromise
}