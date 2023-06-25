const connection = require("../../db");

const register = (req, res) => {
    let result = {};
    let body = req.body;
    console.log("REQ : ", body);

    //salt : 솔트값
    //pw : 솔트로 암호화된 값
    connection.query(`INSERT INTO LOGIN(token, id, pw, salt, nickname, email) VALUES("${body.token}", "${body.id}", "${body.pw}", "${body.salt}", "${body.nickName}", "${body.email}")`, (error, rows, fields) => {
        if (error) {
            result = {
                message: error.message,
                data: error.errno
            }
            return res.send(result);
        } else {
            result = {
                message: "200 OK"
            };    
            return res.send(result);
        }
    });
    
    
}

module.exports = {
    register
}