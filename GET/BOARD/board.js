const { getConnection } = require("../../db");

const getBoardKindList = async (req, res) => {
    let param = req.params;
    let query = null;
    if(param.id === undefined) {
        query = `SELECT * FROM BOARD_KINDS ORDER BY sequence ASC`;
    } else {
        query = `SELECT * FROM BOARD_KINDS WHERE board_kind="${param.id}"`;
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
    getBoardKindList
}