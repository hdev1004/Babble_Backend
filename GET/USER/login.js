const connection = require("../../db");
const jwt = require("../../FUNCTION/jwt");

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

const verifyToken = (req, res) => {
    let result = {};
    let param = req.params;
    let headers = req.headers;

    connection.query(`SELECT refresh_token FROM TOKEN WHERE token="${param.token}"`,  (error, rows, fields) => {
        if (error) {
            result = {
                message: error.message,
                data: error.errno
            }
            return res.send(result);
        } else {
            console.log(rows);
            let count = rows.length;
            if(count === 1) { //데이터가 있을때
                let access_token_valid = jwt.verifyToken(headers.authorization);
                let refresh_token_valid = jwt.verifyToken(rows[0].refresh_token);
                result = {
                    message: "200 OK",
                    data: true,
                    access_token: access_token_valid,
                    refresh_token: refresh_token_valid
                }
            } else {
                result = {
                    message: "400 Bad Request",
                    data: false
                }
            }
            return res.send(result)
        }
    })
}



module.exports = {
    getSalt,
    verifyToken
}