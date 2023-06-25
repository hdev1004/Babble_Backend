const connection = require("../../db");
const jwt = require("../../FUNCTION/jwt");


const loginCheck = (req, res) => {
    let result = {};
    let body = req.body;
    console.log(body);
 
    connection.query(`SELECT id, nickname, email, token from LOGIN WHERE id="${body.id}" and pw="${body.pw}"`, (error, rows, fields) => {
        if (error) {
            result = {
                message: error.message,
                data: error.errno
            }
            return res.send(result);
        } else {
            if(rows.length === 0) {
                result = {
                    message: "200 OK",
                    data: {}
                }
            }
            else if(rows.length === 1) {
                result = {
                    message: "200 OK",
                    data: rows[0]
                };    
            } else {
                result = {
                    message: "400 Bad Request",
                    data: {}
                }
            }
            return res.send(result);
        }
    });
    
}


const tokenGenerator = async (req, res) => {
    let result = {};
    let header = req.headers;
    let body = req.body;

    let access_token = header.authorization;
    let user_token = body.token;
    connection.query(`SELECT refresh_token from TOKEN WHERE token="${user_token}"`, (error, rows, fields) => {
        if (error) {
            result = {
                message: error.message,
                data: error.errno
            }
            return res.send(result);
        } else { //쿼리가 유효
            if(rows.length === 0) { //Refresh Token 없음
                result = {
                    message: "400 Bad Request",
                    data: "No Data"
                }
                return res.send(result);
            } else if(rows.length >= 2) { //Bad Request
                result = {
                    message: "400 Bad Request",
                    data: "Bad Request"
                }
                return res.send(result);
            }

            let refresh_token = rows[0].refresh_token;
            let refresh_valid = jwt.verifyToken(refresh_token);
            if(refresh_valid) { //Refresh Token이 유효함
                console.log("[Refresh Valid]");
                //Access Token이 유효한지 확인
                let access_valid = jwt.verifyToken(access_token);
                if(access_valid) { //Access Token이 유효함 (Refresh O, Access O, 아무런 동작 X)
                    console.log("Refresh O, Access O Not Work..");
                    let new_access_token = jwt.tokenGenerator({
                        token: user_token
                    }, "2h")

                    return res.send({
                        message: "200 OK",
                        data: new_access_token
                    })
                } else { //Access Token이 유효하지 않음 (Refresh O, Access X, Access Token 발급)
                    console.log("Refresh O, Access X Access Token Generate..");
                    let new_access_token = jwt.tokenGenerator({
                        token: user_token
                    }, "2h")
                    return res.send({
                        message: "200 OK",
                        data: new_access_token
                    })
                }
            } else { //유효하지 않음
                console.log("[Refresh inValid]");
                let new_access_token = jwt.tokenGenerator({
                    token: user_token
                }, "2h");

                let new_refresh_token = jwt.tokenGenerator({
                    token: user_token
                }, "14d");

                console.log({
                    access: new_access_token,
                    refresh: new_refresh_token
                })
                connection.query(`UPDATE TOKEN SET refresh_token="${new_refresh_token}" WHERE token="${user_token}"`, (error2, rows2, fields2) => {
                    if(error2) {
                        result = {
                            message: error2.message,
                            data: error2.errno
                        }
                        return res.send(result);
                    } else {
                        result = {
                            message: "200 OK",
                            data: new_access_token
                        }
                        return res.send(result);
                    }
                })
            }
        }
    })
    
}

module.exports = {
    loginCheck,
    tokenGenerator
}