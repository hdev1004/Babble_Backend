
const { poolPromise } = require("../../db");

const isNicknameDuplicate = async(param) => {
    let query =`SELECT nickname from LOGIN WHERE nickname="${param.nickname}"`;
    let rows = null;
    let conn = await poolPromise.getConnection(async con => con);
    let isError = false;

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(query);
        await conn.commit();
    } catch(err) {
        console.log("REGISTER - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows.length === 0 ? false : true
    }    
}


const isIdDuplicate = async(param) => {
    let query =`SELECT id from LOGIN WHERE id="${param.id}"`;
    let rows = null;
    let conn = await poolPromise.getConnection(async con => con);
    let isError = false;

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(query);
        await conn.commit();
    } catch(err) {
        console.log("REGISTER - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows.length === 0 ? false : true
    }    
}


const register = async(body) => {
    console.log("REQ : ", body);

    let query =`INSERT INTO LOGIN(token, id, pw, salt, nickname, email) VALUES("${body.token}", "${body.id}", "${body.pw}", "${body.salt}", "${body.nickName}", "${body.email}")`;
    let conn = await poolPromise.getConnection(async con => con);
    let isError = false;

    try {
        await conn.beginTransaction();
        await conn.query(query);
        await conn.commit();
    } catch(err) {
        console.log("REGISTER - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError
    }
}

module.exports = {
    isIdDuplicate,
    isNicknameDuplicate,
    register
}