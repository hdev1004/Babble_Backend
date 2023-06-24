const connection = require("../../db");

const getSalt = (req, res) => {
    let result = {};
    let param = req.params;
    console.log(param);
 
    connection.query(`SELECT salt from LOGIN WHERE id="${param.id}"`, (error, rows, fields) => {
        if (error) {
            result = {
                message: error.message,
                data: error.errno
            }
            return res.send(result);
        } else {
            if(rows.length === 0) {
                result = {
                    message: "204 Content",
                    data: {
                        salt: ""
                    }
                };
            } else if(rows.length === 1) {
                result = {
                    message: "200 OK",
                    data: rows[0]
                };
            } else {
                result = {
                    message: "400 Bad Request",
                    data: {}
                };
            }
            return res.send(result);
        }
    });
}

module.exports = {
    getSalt
}