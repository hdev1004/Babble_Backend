const { getConnection, poolPromise } = require("../../db");

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

const getBoardList = async(req, res) => {
    let param = req.params;
    let unit = parseInt(param.unit);
    let page = parseInt(param.page);

    let conn = await poolPromise.getConnection(async con => con);
    let result = null;

    try {
        await conn.beginTransaction();
        result = await conn.query(`SELECT *, L.nickname  FROM BOARD_LIST as B 
            LEFT JOIN (SELECT nickname, token FROM LOGIN) as L ON B.token = L.token 
            LEFT JOIN (SELECT board_kind, name FROM BOARD_KINDS) as BK ON B.board_kind = BK.board_kind
            ORDER BY B.upload_date DESC LIMIT ${(page - 1) * unit}, ${page * unit}`);
        await conn.commit();
    } catch(err) {
        console.log(err);
        await conn.rollback();
        return res.status(500).send({
            code: 500,
            message: "Error"
        })
    } finally {
        conn.release();
    }
    return res.send({
        data: result[0],
        message: "200 OK"
    })
}

const getBoardContents = async(req, res) => {
    let param = req.params;
    let board_token = param.board_token;

    let conn = await poolPromise.getConnection(async con => con);
    let result = null;

    try {
        await conn.beginTransaction();
        result = await conn.query(`SELECT * FROM BOARD_LIST as BL 
        LEFT JOIN (SELECT board_token, post FROM BOARD) as B ON BL.board_token = B.board_token
        LEFT JOIN (SELECT board_kind, name FROM BOARD_KINDS) as BK ON BL.board_kind = BK.board_kind
        LEFT JOIN (SELECT token, nickname FROM LOGIN) as L ON BL.token = L.token WHERE BL.board_token="${board_token}"`);
        await conn.commit();
    } catch(err) {
        console.log(err);
        await conn.rollback();
        return res.status(500).send({
            code: 500,
            message: "Error"
        })
    } finally {
        conn.release();
    }
    return res.send({
        data: result[0],
        message: "200 OK"
    })
}


module.exports = {
    getBoardKindList,
    getBoardList,
    getBoardContents
}