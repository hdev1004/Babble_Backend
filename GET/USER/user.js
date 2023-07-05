const { getConnection } = require("../../db");

const getUserList = (req, res) => {
    let result = {};
    let param = req.params;
    let token = param.token;
    console.log("TOKEN : ", token);
    let query = null;

    if(token === undefined) {
        query = `SELECT * from LOGIN WHERE nickname LIKE "${param.nickname}%"`
    }  else {
        query = `SELECT * FROM LOGIN AS L WHERE nickname LIKE "${param.nickname}%" and L.token NOT IN ("${param.token}")`
    }
    getConnection((connection) => {
        connection.query(query, (error, rows, fields) => {
            if (error) {
                result = {
                    message: error.message,
                    data: error.errno
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
        connection.release();
    });
}

module.exports = {
    getUserList
}