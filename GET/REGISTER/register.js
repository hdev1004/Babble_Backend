const connection = require("../../db");

const isNicknameDuplicate = (req, res) => {
    let result = {};
    let param = req.params;
    console.log(param);
 
    connection.query(`SELECT nickname from LOGIN WHERE nickname="${param.nickname}"`, (error, rows, fields) => {
        if (error) {
            result = {
                message: error.message,
                data: error.errno
            }
            return res.send(result);
        } else {
            result = {
                message: "200 OK",
                data: rows.length === 0 ? false : true
            };
            return res.send(result);
        }
    });
    connection.end();
}

const isIdDuplicate = (req, res) => {
    let result = {};
    let param = req.params;
 
    connection.query(`SELECT id from LOGIN WHERE id="${param.id}"`, (error, rows, fields) => {
        if (error) {
            result = {
                message: error.message,
                data: error.errno
            }
            return res.send(result);
        } else {
            result = {
                message: "200 OK",
                data: rows.length === 0 ? false : true
            };
            return res.send(result);
        }
    });
    connection.end();
}

module.exports = {
    isIdDuplicate,
    isNicknameDuplicate
}