const getConnection = require("../../db");

const getFriendList = (req, res) => {
    let result = {};
    let param = req.params;
    console.log(param);
 
    getConnection((connection) => {
        connection.query(`SELECT FL.friend_token,L.nickname  FROM FRIEND_LIST AS FL 
        LEFT JOIN LOGIN AS L ON FL.friend_token = L.token WHERE FL.token="${param.token}" ORDER BY L.nickname DESC`, (error, rows, fields) => {
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
                        data: []
                    };
                } else {
                    result = {
                        message: "200 OK",
                        data: rows
                    };
                } 
                return res.send(result);
            }
        });
        connection.release();
    });
}

module.exports = {
    getFriendList
}