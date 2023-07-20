const { poolPromise } = require("../../db");

//친구 끊기
const unFriend = async(req, res) => {
    let body = req.body;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`DELETE FROM FRIEND_LIST WHERE friend_token = "${body.token}" and token = "${body.friend_token}"`);
        await conn.query(`DELETE FROM FRIEND_LIST WHERE friend_token = "${body.friend_token}" and token = "${body.token}"`);
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

//친구 요청 취소
const cancleFriend = async(req, res) => {
    let body = req.body;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`DELETE FROM FRIEND_REQ WHERE token = "${body.token}" and friend_token = "${body.friend_token}"`);
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

//친구 추가 거부
const refuseFrined = async(req, res) => {
    let body = req.body;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`DELETE FROM FRIEND_REQ WHERE token = "${body.friend_token}" and friend_token = "${body.token}"`);
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

module.exports = {
    unFriend,
    cancleFriend,
    refuseFrined
}