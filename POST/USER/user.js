const connection = require("../../db");

const getUser = (req, res) => {
    let result = {};
    let body = req.body;

    connection.query(`SELECT * from LOGIN`, (error, rows, fields) => {
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
    getUser
}