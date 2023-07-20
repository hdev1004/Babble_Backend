const { poolPromise } = require("../../db");

const friendAdd = async(req, res) => {
    let body = req.body;
    conn = await poolPromise.getConnection();
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`INSERT INTO FRIEND_LIST(token, friend_token) VALUES ("${body.token}", "${body.friend_token}")`);
        await conn.query(`INSERT INTO FRIEND_LIST(token, friend_token) VALUES ("${body.friend_token}", "${body.token}")`);
        await conn.query(`DELETE FROM FRIEND_REQ WHERE friend_token = "${body.token}" and token = "${body.friend_token}"`);
        await conn.commit();
    } catch(err) {
        console.log("Err");
        await conn.rollback();
        throw err;
    } finally {
        await conn.release();
    }
    return res.send({
        message: "200 OK"
    })
}

const friendRequest = async(req, res) => {
    let body = req.body;
    conn = await poolPromise.getConnection();
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`INSERT INTO FRIEND_REQ(token, friend_token) VALUES ("${body.token}", "${body.friend_token}")`);
        await conn.commit();
    } catch(err) {
        await conn.rollback();
        throw err;
    } finally {
        await conn.release();
    }

    return res.send({
        message: "200 OK"
    })

}

module.exports = {
    friendAdd,
    friendRequest
}