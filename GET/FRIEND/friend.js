const { getConnection } = require("../../db");

//친구 목록
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

const getFriendRequest = (req, res) => {
    let result = {};
    let param = req.params;
    console.log(param);
 
    getConnection((connection) => {
        connection.query(`SELECT FR.friend_token, FR.update_date, L.nickname  FROM FRIEND_REQ AS FR
        LEFT JOIN LOGIN AS L ON FR.friend_token = L.token WHERE FR.token="${param.token}" ORDER BY FR.update_date DESC`, (error, rows, fields) => {
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
    getFriendList,
    getFriendRequest
}