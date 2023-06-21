const mysql = require('mysql2');

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    port     : process.env.DB_PORT
});

connection.connect((err) => {
    if(err) {
        console.log("Error Connecting to database : ", err);
        return;
    } 
    console.log("Database connected successfully !");
})

module.exports = connection;