const { poolPromise } = require("../../db");

const posting =  async(req, res) => {
    let body = req.body;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    const board_token = body.board_token;
    const token = body.token;
    const title = body.title;
    const category = body.category;
    const content = body.content;

    try {
        await conn.beginTransaction();
        let [res] = await conn.query(`SELECT * FROM BOARD_KINDS WHERE name="${category}"`);
        await conn.query(`INSERT INTO BOARD_LIST(board_token, board_kind, token, title, likes) VALUES ("${board_token}", "${res[0].board_kind}", "${token}", "${title}", 0)`);
        await conn.query(`INSERT INTO BOARD(board_token, token, post) VALUES ("${board_token}", "${token}", "${content}")`);
        await conn.commit();
    } catch(err) {
        console.log("Err");
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
    return res.send({
        message: "200 OK"
    })
}

module.exports = {
    posting
}