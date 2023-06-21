const connection = require("./db");

const getAllUsers = (req, res) => {
    let result = {};

    connection.query('SELECT * from USER', (error, rows, fields) => {
        if (error) {
            result = {
                code: error.errno,
                data: error.message
            }
            return res.send(result);
        } else {
            result = {
                message: "200 OK",
                data: rows
            };    
            return res.send(result);
        }
    });
}

module.exports = {
    getAllUsers
}