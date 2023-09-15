const { poolPromise } = require("../../db");

//친구 목록
const getFriendList = async (param) => {
    let rows = [];
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    console.log(param);
 
    try {
        await conn.beginTransaction();
        [rows] = await conn.query(`SELECT FL.friend_token,L.nickname  FROM FRIEND_LIST AS FL 
        LEFT JOIN LOGIN AS L ON FL.friend_token = L.token WHERE FL.token="${param.token}" ORDER BY L.nickname DESC`);
        await conn.commit();
    } catch(err) {
        console.log("FRIEND_LIST - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows
    }
}

//친구 요청 목록
const getFriendRequest = async (param) => {
    let rows = [];
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    console.log(param);
 
    try {
        await conn.beginTransaction();
        [rows] = await conn.query(`SELECT FR.*, L.nickname  FROM FRIEND_REQ AS FR 
        LEFT JOIN LOGIN AS L ON FR.token = L.token WHERE FR.token="${param.token}" ORDER BY FR.update_date DESC`);
        await conn.commit();
    } catch(err) {
        console.log("FRINED_REQUEST - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows
    }
}

const getFriendRequestSendList = async(param) => {
    let rows = [];
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    console.log(param);
 
    try {
        await conn.beginTransaction();
        [rows] = await conn.query(`SELECT FR.token, FR.update_date, L.nickname  FROM FRIEND_REQ AS FR
        LEFT JOIN LOGIN AS L ON FR.token = L.token WHERE FR.friend_token="${param.token}" ORDER BY FR.update_date DESC`);
        await conn.commit();
    } catch(err) {
        console.log("FRIEND_LIST - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows
    }
}

const friendAdd = async(body) => {
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
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
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError
    }
}

const friendRequest = async(body) => {
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`INSERT INTO FRIEND_REQ(token, friend_token) VALUES ("${body.token}", "${body.friend_token}")`);
        await conn.commit();
    } catch(err) {
        console.log("Err");
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError
    }
}

//친구 끊기
const unFriend = async(body) => {
    let isError = false;
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
        isError = true;
    } finally {
        conn.release();
    }
    return {
        isError: isError
    }
}

//친구 요청 취소
const cancleFriend = async(body) => {
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`DELETE FROM FRIEND_REQ WHERE token = "${body.token}" and friend_token = "${body.friend_token}"`);
        await conn.commit();
    } catch(err) {
        console.log("Err");
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }
    return {
        isError: isError
    }
}

//친구 추가 거부
const refuseFrined = async(body) => {
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    try {
        await conn.beginTransaction();
        await conn.query(`DELETE FROM FRIEND_REQ WHERE token = "${body.friend_token}" and friend_token = "${body.token}"`);
        await conn.commit();
    } catch(err) {
        console.log("Err");
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }
    return {
        isError: isError
    }
}


const listFriend = async () => {
    let rows = [];
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
 
    try {
        await conn.beginTransaction();
        [rows] = await conn.query(`SELECT * from FRIEND_LIST`);
        await conn.commit();
    } catch(err) {
        console.log("FRINED_REQUEST - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows
    }
} 

module.exports = {
    getFriendList,
    getFriendRequest,
    getFriendRequestSendList,
    friendAdd,
    friendRequest,
    unFriend,
    cancleFriend,
    refuseFrined,
    listFriend
}