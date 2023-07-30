const { poolPromise } = require("../../db");

const userList = async(param, token) => {
    let query = "";
    let res = null;
    if(token === undefined) {
        query = `SELECT * from LOGIN WHERE nickname LIKE "${param.nickname}%"`
    }  else {
        query = `SELECT * FROM LOGIN AS L WHERE nickname LIKE "${param.nickname}%" and L.token NOT IN ("${param.token}")`
    }
    let conn = await poolPromise.getConnection(async con => con);
    let isError = false;

    try {
        await conn.beginTransaction();
        [res] = await conn.query(query);
        await conn.commit();
    } catch(err) {
        console.log("USER - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: res
    }
}

module.exports = {
    userList
}