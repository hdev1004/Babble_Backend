const jwt = require("../../FUNCTION/jwt");
const { poolPromise } = require("../../db");

/**
 * Salt값을 디비에서 받아오는 함수
 * @param {*} req 
 * @param {*} res 
 */
const getSalt = async(param) => {
    let query = `SELECT salt from LOGIN WHERE id="${param.id}"`;
    let res = null;
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
        data: res[0]
    }
}

/**
 * Access Token, Refresh Token이 유효한지 확인
 * @param {*} req 
 * @param {*} res 
 */
const verifyToken = async (param, headers) => {
    let query = `SELECT refresh_token FROM TOKEN WHERE token="${param.token}"`;
    let rows = null;
    let conn = await poolPromise.getConnection(async con => con);
    let isError = false;

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(query);
        await conn.commit();
    } catch(err) {
        console.log("Verify - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    let count = rows.length;
    if(count === 1) { //데이터가 있을때
        let access_token_valid = jwt.verifyToken(headers.authorization);
        let refresh_token_valid = jwt.verifyToken(rows[0].refresh_token);
        return {
            isError: isError,
            data: true,
            access_token: access_token_valid,
            refresh_token: refresh_token_valid
        }
    } else {
        return {
            isError: isError,
            data: false
        }
    }
}

const loginCheck = async (body) => {
    let result = {};
    let selectQuery = `SELECT id, nickname, email, token from LOGIN WHERE id="${body.id}" and pw="${body.pw}"`;
    let rows = null;
    let conn = await poolPromise.getConnection(async con => con);
    let isError = false;

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(selectQuery);

        if(rows.length === 0) {
            result = {
                isError: isError,
                data: {}
            }
        }
        else if(rows.length === 1) {
            let user_token = rows[0].token;
            let new_refresh_token = jwt.tokenGenerator({
                token: user_token
            }, '14d');
            let updateQuery = `UPDATE TOKEN SET refresh_token="${new_refresh_token}" WHERE token="${user_token}"`;
            await conn.query(updateQuery);
            
            result = {
                isError: isError,
                data: rows[0]
            }
        } else {
            isError = true;
        }
        await conn.commit();
    } catch(err) {
        console.log("Verify - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    console.log(result);
    return result;
}


const tokenGenerator = async (header, body) => {
    let result = {};

    let access_token = header.authorization;
    let user_token = body.token;

    let query = `SELECT refresh_token from TOKEN WHERE token="${user_token}"`;
    let rows = null;
    let conn = await poolPromise.getConnection(async con => con);
    let isError = false;

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(query);

        if(rows.length === 1) { //Refresh Token 없음
            let refresh_token = rows[0].refresh_token;
            let refresh_valid = jwt.verifyToken(refresh_token);
            if(refresh_valid) { //Refresh Token이 유효함
                console.log("[Refresh Valid]");
                //Access Token이 유효한지 확인
                let access_valid = jwt.verifyToken(access_token);
                if(access_valid) { //Access Token이 유효함 (Refresh O, Access O, 아무런 동작 X)
                    console.log("Refresh O, Access O Not Work..");
                    let new_access_token = jwt.tokenGenerator({
                        token: user_token
                    }, "2h")

                    result = {
                        isError: isError,
                        message: "200 OK",
                        data: new_access_token
                    }
                } else { //Access Token이 유효하지 않음 (Refresh O, Access X, Access Token 발급)
                    console.log("Refresh O, Access X Access Token Generate..");
                    let new_access_token = jwt.tokenGenerator({
                        token: user_token
                    }, "2h")
                    result = {
                        isError: isError,
                        message: "200 OK",
                        data: new_access_token
                    }
                }
            } else { //유효하지 않음
                console.log("[Refresh inValid]");
                let new_access_token = jwt.tokenGenerator({
                    token: user_token
                }, "2h");

                let new_refresh_token = jwt.tokenGenerator({
                    token: user_token
                }, "14d");

                console.log({
                    isError: isError,
                    access: new_access_token,
                    refresh: new_refresh_token
                })

                await conn.query(`UPDATE TOKEN SET refresh_token="${new_refresh_token}" WHERE token="${user_token}"`);   
                result = {
                    isError: isError,
                    message: "200 OK",
                    data: new_access_token
                }
            }
            
        } else {
            isError = true;
            result = {
                isError: isError,
                message: "Login Error"
            }
        }

        await conn.commit();
    } catch(err) {
        console.log("Verify - ERR");
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return result;    
    
}



module.exports = {
    getSalt,
    verifyToken,
    loginCheck,
    tokenGenerator
}